import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ImageIcon,
  FileUp,
  Sparkles,
  CheckCircle2,
  Box,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import { fetchProduct } from "@/services/api/productApi";
import {
  fetchProjectContents,
  createProject,
  createPackageMockup,
  getContentStatus,
  fetchProjectsByProduct,
} from "@/services/api/projectApi";
import Button from "../components/common/Button";

export default function DesignPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const fileInputRef = useRef(null);
  const devBaseInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null); // { url, projectId, ... }
  const [dielineFile, setDielineFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 제품 상세 조회
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  // ✅ 해당 제품의 프로젝트 목록 조회 (userImgGcsUrl로 AI 제품이미지 표시)
  const { data: projectsData, isLoading: isImagesLoading } = useQuery({
    queryKey: ["projects", productId],
    queryFn: () => fetchProjectsByProduct(productId),
    enabled: !!productId,
  });

  const rawProjects = Array.isArray(projectsData)
    ? projectsData
    : projectsData?.projects || projectsData?.content || [];

  // ★ 디버깅: API 응답에서 실제 필드명 확인
  if (rawProjects.length > 0) {
    console.log("[ProductPackagePage] ★ rawProjects 전체 키:", rawProjects.map(p => ({
      projectId: p.projectId || p.id,
      title: p.title,
      userimgGcsUrl: p.userimgGcsUrl,   // DB: userimg_gcs_url → camelCase
      userImgGcsUrl: p.userImgGcsUrl,   // 백엔드 가이드 문서
      keys: Object.keys(p),
    })));
  }

  // ✅ 제품이미지 URL 필터 (DB컬럼: userimg_gcs_url → userimgGcsUrl)
  const baseImages = rawProjects
    .filter((p) => p.userimgGcsUrl || p.userImgGcsUrl || p.user_img_gcs_url || p.userimg_gcs_url)
    .map((p) => {
      const imgUrl = p.userimgGcsUrl || p.userImgGcsUrl || p.user_img_gcs_url || p.userimg_gcs_url;
      return {
        id: String(p.projectId || p.id),
        projectId: p.projectId || p.id,
        projectTitle: p.title || "AI 제품이미지",
        url: imgUrl,
        label: `${p.title || "AI 제품이미지"} (${(p.createdAt || "").split("T")[0] || "-"})`,
      };
    });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDielineFile(file);
    }
  };

  const pollMockupResult = async (contentId) => {
    const maxAttempts = 60;    // 최대 60회
    const intervalMs = 5000;   // 5초 간격 → 총 5분 대기

    for (let i = 0; i < maxAttempts; i++) {
      const content = await getContentStatus(contentId);

      if (content.status === "COMPLETED" || content.gcsImgUrl) {
        return content.gcsImgUrl; // 완료 — 생성된 목업 이미지 URL
      }
      if (content.status === "ARCHIVED") {
        console.error(
          "[pollMockupResult] Failure details:",
          JSON.stringify(content, null, 2),
        );
        throw new Error(
          `목업 생성 실패 (ARCHIVED) - 상세: ${content.errorMessage || content.detail || "없음"}`,
        );
      }

      await new Promise((r) => setTimeout(r, intervalMs));
    }

    throw new Error("Timeout: 목업 생성 시간 초과");
  };

  const handleGenerate = async () => {
    if (!selectedImage || !dielineFile) return;

    try {
      setIsUploading(true);

      // 1. 목업 생성 요청
      // selectedImage는 이제 { id, projectId, url, ... } 형태

      // 개발용 이미지일 경우, 유효한 projectId를 목록에서 빌려옴
      let targetProjectId = selectedImage.projectId || selectedImage.id;
      if (selectedImage.id === "dev-temp-base") {
        const firstProject = rawProjects.find((p) => p.projectId || p.id);
        if (firstProject) {
          targetProjectId = firstProject.projectId || firstProject.id;
        } else {
          // 프로젝트가 하나도 없는 경우 (이론적으로는 드물지만) 0이나 다른 값 대신 경고
          throw new Error(
            "유효한 프로젝트를 찾을 수 없습니다. 광고를 먼저 생성해주세요.",
          );
        }
      }

      const timestamp = Date.now();
      // 파일명을 고유하게 만들지 않고 원본 유지 (워커가 보수적인 파일명을 원할 수 있음)
      const uniqueDielineFile = new File([dielineFile], dielineFile.name, {
        type: dielineFile.type,
      });
      const uniqueBaseFile = selectedImage.file
        ? new File([selectedImage.file], selectedImage.file.name, {
          type: selectedImage.file.type,
        })
        : null;

      const targetBaseImageUrl =
        selectedImage.id === "dev-temp-base" ? "" : selectedImage.url;

      console.log("[createPackageMockup] Request Params (Initial):", {
        productId,
        projectId: targetProjectId,
        baseImageUrl: targetBaseImageUrl,
        file: uniqueDielineFile.name,
        baseFile: uniqueBaseFile?.name,
      });

      // [HARDCODE] 발표 영상을 위한 개발용 하드코딩 (Dev 이미지 선택 시)
      if (selectedImage.id === "dev-temp-base") {
        console.log("[Hardcode] Presentation mode - simulating 20s delay...");
        await new Promise((resolve) => setTimeout(resolve, 20000));

        navigate(`/dashboard/products/${productId}/addAD/result`, {
          state: {
            title: "패키지 도안 AI 생성 프로젝트 (Demo)",
            newMockup: {
              url: "/tmp/package_output.png",
            },
          },
        });
        return;
      }

      const response = await createPackageMockup({
        productId,
        projectId: targetProjectId,
        baseImageUrl: targetBaseImageUrl,
        file: uniqueDielineFile,
        baseFile: uniqueBaseFile,
      });

      console.log("[createPackageMockup] Response:", response);
      const { contentId } = response;

      // 2. 결과 폴링 시작
      // UX: 로딩 상태 유지하며 폴링
      const finalMockupUrl = await pollMockupResult(contentId);

      // 3. 완료 시 처리
      // 상세 페이지로 이동하거나, 현재 페이지에서 결과 보여주기.
      // 기존 로직은 navigate였으므로 유지하되, projectId 등이 달라질 수 있음.
      // 일단 contentId를 가지고 상세 페이지로 가거나 해야하는데,
      // 상세 페이지 라우트가 `/projectDesignDetail/:projectId` 임.
      // 생성된 content의 projectId를 알아야 함. getContentStatus 결과에 projectId가 있음.

      // 폴링 완료 후 다시 컨텐츠 정보 조회해서 projectId 획득 (혹은 create 응답에 있었는지 확인 필요 - 명세엔 없음)
      const content = await getContentStatus(contentId);
      targetProjectId = content.projectId || targetProjectId;

      navigate(
        `/dashboard/products/${productId}/projectDesignDetail/${targetProjectId}`,
        {
          state: {
            jobId: null,
            newMockup: { url: finalMockupUrl },
          },
        },
      );
    } catch (e) {
      console.error("도안 생성 실패:", e);
      alert("도안 생성 요청 중 오류가 발생했습니다: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <Container className="relative py-8">
      {/* 상단 네비게이션 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} /> 프로젝트 목록
        </button>
      </div>
      {/* 헤더 섹션 */}
      <div className="space-y-10 pb-24 border border-gray-200 bg-white rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-xl">도안 생성</h3>
        <p className="-mt-8 text-sm text-gray-400">
          제품을 선택하고 도면을 업로드하여 AI 목업을 생성하세요.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* 1. 제품 이미지 선택 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#F9F5FF] rounded-xl text-[#7F56D9]">
                <ImageIcon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  제품 이미지 선택
                </h3>
                <p className="text-sm text-[#667085]">
                  광고 생성에서 만든 제품 이미지를 선택하세요
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {isImagesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 size={32} className="animate-spin text-gray-300" />
                </div>
              ) : (
                <div className="relative">
                  <select
                    className="w-full p-4 rounded-2xl border-2 border-[#F2F4F7] bg-white text-[#101828] font-bold appearance-none cursor-pointer focus:border-[#7F56D9] outline-none transition-all shadow-sm"
                    onChange={(e) => {
                      const img = baseImages?.find(
                        (i) => String(i.id) === e.target.value,
                      );
                      setSelectedImage(img);
                    }}
                    value={selectedImage?.id || ""}
                  >
                    <option value="" disabled>
                      {baseImages && baseImages.length > 0
                        ? "이미지를 선택하세요"
                        : "사용 가능한 제품 이미지가 없습니다"}
                    </option>
                    {baseImages?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.projectTitle} ({(item.url || "").split("/").pop()?.split("?")[0] || "이미지"})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Box size={20} className="text-[#D0D5DD]" />
                  </div>

                  {selectedImage && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 aspect-video flex items-center justify-center relative group">
                      <img
                        src={selectedImage.url}
                        alt="Selected Concept"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {selectedImage.projectTitle}
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={devBaseInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setSelectedImage({
                          id: "dev-temp-base",
                          url: url,
                          label: "개발용 이미지",
                          projectTitle: "매뉴얼 업로드",
                          candidateId: "dev-temp-candidate",
                          isDev: true,
                          file: file,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* 2. 패키지 도면 업로드 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#EFF8FF] rounded-xl text-[#60A5FA]">
                <FileUp size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  패키지 도면 업로드
                </h3>
                <p className="text-sm text-[#667085]">
                  제품 패키지 도면 파일을 업로드하세요 (PNG, JPG)
                </p>
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-3xl p-14 flex flex-col items-center justify-center transition-all cursor-pointer ${dielineFile
                ? "border-[#60A5FA] bg-[#edf5ff]"
                : "border-[#EAECF0] hover:bg-[#F9FAFB] hover:border-[#D0D5DD]"
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dielineFile
                  ? "bg-[#edf5ff] text-[#60A5FA]"
                  : "bg-[#F2F4F7] text-[#667085]"
                  }`}
              >
                {dielineFile ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <FileUp size={28} />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-[#101828]">
                  {dielineFile
                    ? dielineFile.name
                    : "클릭하여 업로드 또는 드래그 앤 드롭"}
                </p>
                <p className="text-sm text-[#98A2B3] mt-1 font-medium">
                  PNG, JPG (최대 10MB)
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* 하단 플로팅 액션바 스타일 버튼 */}
        <div className="mt-12 flex flex-col items-center">
          <Button
            variant="secondary"
            onClick={handleGenerate}
            disabled={!selectedImage || !dielineFile || isUploading}
            className={`flex items-center gap-3 rounded-lg text-sm px-4 py-2 font-bold shadow-sm transition-all active:scale-95 ${selectedImage && dielineFile && !isUploading
              ? "bg-primary hover:bg-yellow-500 shadow-yellow-100"
              : "bg-[#F3F3F3] text-[#98A2B3] cursor-not-allowed"
              }`}
          >
            {isUploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Sparkles size={22} />
            )}
            {isUploading ? "생성 요청 중..." : "목업 생성하기"}
          </Button>
          {(!selectedImage || !dielineFile) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#F04438] font-medium">
              <AlertCircle size={16} />
              <span>
                이미지 선택과 파일 업로드가 완료되어야 생성이 가능합니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
