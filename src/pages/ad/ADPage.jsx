import { useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import StepProgress from "@/components/common/StepProgress";
import ADStepLayout from "@/components/layout/ADStepLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { PRODUCTS } from "@/data/products";
import { AD_CONTENT_TYPE_OPTIONS, CONTENT_TIP, STEP_LABELS } from "@/data/ads";

import InfoInputSection from "./sections/InfoInputSection";
import GuideSelectionSection from "./sections/GuideSelectionSection";
import CopySelectionSection from "./sections/CopySelectionSection";
import ContentGenerationSection from "./sections/ContentGenerationSection";

import {
  fetchAdGuides,
  fetchAdCopies,
  createAdContents,
  createBasicImageJob,
  fetchJob,
  fetchBasicImageResult,
} from "@/services/api/ad";

function pickSelectedGuide(guideResponse, selectedGuideId) {
  const guides = guideResponse?.guides ?? [];
  return guides.find((g) => String(g.id) === String(selectedGuideId)) ?? null;
}

function pickSelectedCopy(copyResponse, selectedCopyId) {
  const copies = copyResponse?.copies ?? [];
  const found =
    copies.find((c) => String(c.id) === String(selectedCopyId)) ?? null;
  if (!found) return null;

  if (found.result) {
    return {
      id: String(found.id),
      concept: found.result.selectedConcept ?? "",
      finalCopy: found.result.finalCopy ?? "",
      shortformPrompt: found.result.shortformPrompt ?? "",
      bannerPrompt: found.result.bannerPrompt ?? "",
      snsPrompt: found.result.snsPrompt ?? "",
      selectionReason: found.result.selectionReason ?? "",
      productName: found.result.productName ?? "",
      raw: found,
    };
  }

  return {
    id: String(found.id),
    concept: found.title ?? "",
    finalCopy: found.body ?? "",
    shortformPrompt: "",
    bannerPrompt: "",
    snsPrompt: "",
    selectionReason: "",
    productName: "",
    raw: found,
  };
}

// 간단 폴링 유틸(최대 timeoutMs)
async function pollJobUntilDone(
  jobId,
  { intervalMs = 1000, timeoutMs = 60000 } = {},
) {
  const started = Date.now();

  while (true) {
    const job = await fetchJob(jobId);
    const s = job?.status;

    if (s === "SUCCEEDED" || s === "FAILED") return job;

    if (Date.now() - started > timeoutMs) {
      throw new Error("제품 이미지 생성 시간이 초과되었습니다.");
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

export default function ADPage() {
  const navigate = useNavigate();
  const { productId: productIdParam } = useParams();

  const productId = useMemo(() => {
    const n = Number(productIdParam);
    return Number.isFinite(n) ? n : undefined;
  }, [productIdParam]);

  const productName = useMemo(() => {
    if (productId == null) return "";
    const product = PRODUCTS.find((p) => p.id === productId);
    return product?.name ?? "";
  }, [productId]);

  const invalidProductId = !(Number.isFinite(productId) && productId > 0);
  const [currentStep, setCurrentStep] = useState(1);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const [baseDate, setBaseDate] = useState(`${yyyy}-${mm}`);

  // Step1
  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [adFocus, setAdFocus] = useState(50);
  const [projectTitle, setProjectTitle] = useState("");

  // selections
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [selectedCopyId, setSelectedCopyId] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [bannerSize, setBannerSize] = useState("");

  // BASIC preview 상태
  const [previewJobId, setPreviewJobId] = useState("");
  const [isLoadingPreviewImages, setIsLoadingPreviewImages] = useState(false);
  const [previewError, setPreviewError] = useState("");

  // server responses
  const [guideResponse, setGuideResponse] = useState(null);
  const [copyResponse, setCopyResponse] = useState(null);

  // Step4 product images
  const [productImages, setProductImages] = useState([]); // [{id,url,label,meta}]
  const [selectedProductImageId, setSelectedProductImageId] = useState("");

  // 비용 절감 모드(네 코드 유지)
  const USE_GUIDE_API = false;
  const USE_COPY_API = false;

  const LOCAL_GUIDE_RESPONSE = useMemo(
    () => ({
      recommendedGuideId: "local-g1",
      guides: [
        {
          id: "local-g1",
          title: "제품 중심 홍보",
          summary: "핵심 효익 1개 + 근거 1개 + 행동 유도 1개로 단순화",
          badge: "전환형",
          score: 91,
          rationale: "로컬 더미(비용 절감)",
          key_points: {
            tone: ["명확함"],
            structure: "benefit-proof-cta",
            cta: "direct",
          },
        },
        {
          id: "local-g2",
          title: "감성적 스토리텔링",
          summary: "상황→해결→변화 흐름",
          badge: "브랜드형",
          score: 78,
          rationale: "로컬 더미(비용 절감)",
          key_points: {
            tone: ["공감"],
            structure: "problem-solution",
            cta: "soft",
          },
        },
      ],
    }),
    [],
  );

  const LOCAL_COPY_RESPONSE = useMemo(
    () => ({
      recommendedCopyId: "c3",
      copies: [
        {
          id: "c1",
          title: "행복한 순간",
          body: "작은 행복이 모여 큰 추억이 됩니다.\n당신의 특별한 순간을 더 달콤하게.",
        },
        {
          id: "c2",
          title: "따뜻한 마음",
          body: "마음을 담아 정성스럽게 만든 달콤함.\n소중한 사람과 함께 나누세요.",
        },
        {
          id: "c3",
          title: "일상의 여유",
          body: "바쁜 하루 속 작은 쉼표.\n달콤한 여유로 일상을 채워보세요.",
        },
        {
          id: "c4",
          title: "오늘의 리셋",
          body: "지친 하루를 가볍게 리셋.\n한 입으로 기분까지 환해집니다.",
        },
        {
          id: "c5",
          title: "선물 같은 한입",
          body: "특별한 날이 아니어도 좋아요.\n오늘을 선물처럼 만드는 한 입.",
        },
      ],
    }),
    [],
  );

  const guideMutation = useMutation({ mutationFn: fetchAdGuides });
  const copyMutation = useMutation({ mutationFn: fetchAdCopies });
  const createMutation = useMutation({ mutationFn: createAdContents });

  // ✅ BASIC 프리뷰 생성
  const generateProductImages = useCallback(async () => {
    if (!attachedFile)
      throw new Error("첨부파일이 없습니다. 제품 이미지 후보 생성 불가.");

    const previewPayload = {
      productId,
      productName,
      projectTitle,
      adGoal,
      requestText,
      selectedKeywords,
      adFocus,
      n: 3,
    };

    setPreviewError("");
    setIsLoadingPreviewImages(true);
    setProductImages([]);
    setSelectedProductImageId("");

    try {
      // 1) 잡 생성
      const { jobId } = await createBasicImageJob({
        payload: previewPayload,
        file: attachedFile,
      });
      setPreviewJobId(jobId);

      // ✅ 로컬 스토리지에 jobId 저장 (AD 프로젝트용) 목업
      // ad_jobs_{productId} 키에 배열로 저장
      const storageKey = `cg_ad_jobs_${productId}`;
      const existingJobs = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!existingJobs.includes(jobId)) {
        localStorage.setItem(
          storageKey,
          JSON.stringify([...existingJobs, jobId]),
        );
      }

      // 2) 완료 폴링
      const job = await pollJobUntilDone(jobId, {
        intervalMs: 1000,
        timeoutMs: 60000,
      });

      if (job.status === "FAILED") {
        throw new Error(job.errorMessage || "제품 이미지 후보 생성 실패");
      }

      // 3) 결과(manifest) 읽기
      const result = await fetchBasicImageResult(jobId);
      const candidates = result?.candidates ?? [];

      if (!Array.isArray(candidates) || candidates.length === 0) {
        throw new Error("제품 이미지 후보가 생성되지 않았습니다.");
      }

      const mapped = candidates.map((c, idx) => ({
        id: String(c.id ?? `c${idx + 1}`),
        url: c.url, // ✅ public URL
        label: c.label ?? `image${idx + 1}`,
        meta: c.meta ?? null,
      }));

      setProductImages(mapped);
      setSelectedProductImageId(mapped[0]?.id ?? "");
    } catch (e) {
      setPreviewError(e?.message || "제품 이미지 후보 생성 실패");
      throw e;
    } finally {
      setIsLoadingPreviewImages(false);
    }
  }, [
    attachedFile,
    productId,
    productName,
    projectTitle,
    adGoal,
    requestText,
    selectedKeywords,
    adFocus,
  ]);

  const handleRegenerateImages = useCallback(async () => {
    try {
      await generateProductImages();
    } catch (e) {
      console.error(e);
    }
  }, [generateProductImages]);

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        Number.isFinite(productId) &&
        productId > 0 &&
        projectTitle.trim().length > 0 &&
        Boolean(adGoal) &&
        selectedKeywords.length > 0 &&
        attachedFile !== null
      );
    }
    if (currentStep === 2) return Boolean(selectedGuideId);
    if (currentStep === 3) return Boolean(selectedCopyId);
    if (currentStep === 4)
      return selectedTypes.length > 0 && Boolean(selectedProductImageId);
    return true;
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleNext = async () => {
    if (!canProceed()) return;

    // Step1 -> Step2
    if (currentStep === 1) {
      if (!USE_GUIDE_API) {
        setGuideResponse(LOCAL_GUIDE_RESPONSE);
        setSelectedGuideId(LOCAL_GUIDE_RESPONSE.recommendedGuideId || "");
        setCopyResponse(null);
        setSelectedCopyId("");
        setCurrentStep(2);
        return;
      }

      try {
        const resp = await guideMutation.mutateAsync({
          productId,
          baseDate,
          projectTitle,
          adGoal,
          requestText,
          selectedKeywords,
          adFocus,
        });

        const guides = resp?.guides ?? [];
        if (!Array.isArray(guides) || guides.length === 0)
          throw new Error("가이드 응답 비어있음");

        setGuideResponse(resp);
        setSelectedGuideId(resp?.recommendedGuideId || guides[0]?.id || "");
        setCopyResponse(null);
        setSelectedCopyId("");
        setCurrentStep(2);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Step2 -> Step3
    if (currentStep === 2) {
      if (!USE_COPY_API) {
        setCopyResponse(LOCAL_COPY_RESPONSE);
        setSelectedCopyId(
          LOCAL_COPY_RESPONSE.recommendedCopyId ||
            LOCAL_COPY_RESPONSE.copies[0].id,
        );
        setCurrentStep(3);
        return;
      }

      try {
        const resp = await copyMutation.mutateAsync({
          productId,
          baseDate,
          projectTitle,
          adGoal,
          requestText,
          selectedKeywords,
          adFocus,
          guideId: selectedGuideId,
        });

        const copies = resp?.copies ?? [];
        if (!Array.isArray(copies) || copies.length === 0)
          throw new Error("문구 응답 비어있음");

        setCopyResponse(resp);
        setSelectedCopyId(resp?.recommendedCopyId || copies[0].id);
        setCurrentStep(3);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Step3 -> Step4 : 여기서 BASIC 생성 + 후보 세팅
    if (currentStep === 3) {
      try {
        await generateProductImages();
        setCurrentStep(4);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Step4: 최종 생성 호출
    if (currentStep === 4) {
      const selectedGuide = pickSelectedGuide(guideResponse, selectedGuideId);
      const selectedCopy = pickSelectedCopy(copyResponse, selectedCopyId);
      if (!selectedGuide || !selectedCopy) return;
      if (!attachedFile) return;

      const selectedProduct = productImages.find(
        (x) => String(x.id) === String(selectedProductImageId),
      );
      if (!selectedProduct?.meta) {
        console.error(
          "선택된 제품 이미지 meta가 없습니다. preview 응답(meta 포함) 확인 필요",
        );
        return;
      }

      const payload = {
        productId,
        productName,
        projectTitle,
        adGoal,
        requestText,
        selectedKeywords,
        adFocus,
        baseDate,
        bannerSize,

        selectedGuideId,
        selectedGuide,

        selectedCopyId,
        selectedCopy: {
          id: selectedCopy.id,
          productName: selectedCopy.productName || productName,
          selectedConcept: selectedCopy.concept,
          finalCopy: selectedCopy.finalCopy,
          shortformPrompt: selectedCopy.shortformPrompt,
          bannerPrompt: selectedCopy.bannerPrompt,
          snsPrompt: selectedCopy.snsPrompt,
          selectionReason: selectedCopy.selectionReason,
        },

        selectedTypes,

        // ✅ BASIC에서 고른 후보 정보
        selectedProductImage: {
          candidateId: selectedProduct.id,
          meta: selectedProduct.meta,
          // 필요하면 previewJobId도 같이 보내서 서버에서 tmp 경로 추적 가능
          previewJobId,
        },
      };

      const form = new FormData();
      form.append("payload", JSON.stringify(payload));
      form.append("file", attachedFile);

      const created = await createMutation.mutateAsync(form);
      navigate("./result", { state: { ...payload, created } });
      return;
    }
  };

  const isLoadingGuides = USE_GUIDE_API ? guideMutation.isPending : false;
  const isLoadingCopies = USE_COPY_API ? copyMutation.isPending : false;
  const isCreating = createMutation.isPending;

  return (
    <ADStepLayout
      step={currentStep}
      onPrev={handlePrev}
      onNext={handleNext}
      disableNext={
        !canProceed() ||
        (currentStep === 1 && USE_GUIDE_API && isLoadingGuides) ||
        (currentStep === 2 && USE_COPY_API && isLoadingCopies) ||
        (currentStep === 3 && isLoadingPreviewImages) ||
        (currentStep === 4 && isCreating)
      }
      nextLabel={
        currentStep === 3 && isLoadingPreviewImages
          ? "제품 이미지 생성 중..."
          : currentStep === 4 && isCreating
            ? "광고 생성 중..."
            : currentStep === 4
              ? "광고 생성 시작"
              : "다음"
      }
    >
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#111827]">
          AI 광고 생성{productName ? ` · ${productName}` : ""}
        </h1>
      </div>

      <StepProgress currentStep={currentStep} steps={STEP_LABELS} />

      <ErrorBoundary>
        {invalidProductId && currentStep === 1 ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            유효하지 않은 productId 입니다. (URL 파라미터를 확인하세요)
          </div>
        ) : null}

        {createMutation.isError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {createMutation.error?.message || "최종 광고 생성 실패"}
          </div>
        ) : null}

        {previewError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {previewError}
          </div>
        ) : null}

        {currentStep === 1 && !invalidProductId && (
          <InfoInputSection
            productId={productId}
            adGoal={adGoal}
            projectTitle={projectTitle}
            setProjectTitle={setProjectTitle}
            setAdGoal={setAdGoal}
            requestText={requestText}
            setRequestText={setRequestText}
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            adFocus={adFocus}
            setAdFocus={setAdFocus}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            baseDate={baseDate}
            setBaseDate={setBaseDate}
          />
        )}

        {currentStep === 2 && (
          <GuideSelectionSection
            guides={guideResponse?.guides ?? []}
            recommendedGuideId={guideResponse?.recommendedGuideId ?? ""}
            selectedGuideId={selectedGuideId}
            setSelectedGuideId={setSelectedGuideId}
            isLoading={isLoadingGuides}
          />
        )}

        {currentStep === 3 && (
          <CopySelectionSection
            copies={copyResponse?.copies ?? []}
            recommendedCopyId={copyResponse?.recommendedCopyId ?? ""}
            selectedCopyId={selectedCopyId}
            setSelectedCopyId={setSelectedCopyId}
            isLoading={isLoadingCopies}
          />
        )}

        {currentStep === 4 && (
          <ContentGenerationSection
            contentTypes={AD_CONTENT_TYPE_OPTIONS}
            tip={CONTENT_TIP}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            bannerSize={bannerSize}
            setBannerSize={setBannerSize}
            productImages={productImages}
            selectedProductImageId={selectedProductImageId}
            setSelectedProductImageId={setSelectedProductImageId}
            onRegenerateImages={handleRegenerateImages}
            isLoadingImages={isLoadingPreviewImages}
          />
        )}
      </ErrorBoundary>
    </ADStepLayout>
  );
}
