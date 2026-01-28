import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Lightbulb, Clapperboard, Image, ImageUp, Package, Smartphone } from "lucide-react";
import ADStepLayout from "@/components/layout/ADStepLayout";
import Card from "@/components/common/Card";
import {
  AD_GOAL_OPTIONS,
  PRODUCT_OPTIONS,
  TREND_HASHTAGS,
  TREND_KEYWORDS,
  TREND_STYLE_SUMMARY,
  TREND_SUMMARY,
  GUIDE_OPTIONS,
  AD_COPY_OPTIONS,
} from "@/data/createAdData";

const CONTENT_TYPE_OPTIONS = [
  {
    title: "제품 이미지 AI",
    description: "제품 사진을 AI로 생성",
    icon: Image,
  },
  { title: "패키지 시안 AI", description: "패키지 디자인 시안", icon: Package },
  {
    title: "SNS 이미지 AI",
    description: "소셜미디어용 이미지",
    icon: Smartphone,
  },
  { title: "숏츠 AI", description: "짧은 영상 콘텐츠", icon: Clapperboard },
  { title: "배너 이미지 AI", description: "광고 배너 이미지", icon: ImageUp },
];

const CONTENT_TIP =
  "여러 타입을 선택하여 다양한 채널에 맞는 광고를 한 번에 생성할 수 있습니다.";

export default function ADPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [productId, setProductId] = useState("");
  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [selectedCopy, setSelectedCopy] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const canProceedStep1 = Boolean(productId && adGoal);
  const canProceedStep2 = selectedKeywords.length > 0;
  const canProceedStep3 = Boolean(selectedGuide);
  const canProceedStep4 = Boolean(selectedCopy);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return canProceedStep1;
      case 2:
        return canProceedStep2;
      case 3:
        return canProceedStep3;
      case 4:
        return canProceedStep4;
      default:
        return true;
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === 5) {
      navigate("/dashboard/createAD/result", {
        state: {
          selectedTypes,
          productId,
          adGoal,
          requestText,
          selectedKeywords,
          selectedGuide,
          selectedCopy,
        },
      });
      return;
    }

    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  return (
    <ADStepLayout
      step={currentStep}
      onPrev={handlePrev}
      onNext={handleNext}
      disableNext={!canProceed()}
      nextLabel={currentStep === 5 ? "광고 생성 시작" : "다음"}
    >
      {currentStep === 1 && (
        <section>
          <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">정보 입력</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">제품 및 광고 목적 입력</p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-[#111827]">제품 선택</label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827]"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
              >
                <option value="">제품을 선택하세요</option>
                {PRODUCT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-[#111827]">광고 목적</label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827]"
                value={adGoal}
                onChange={(event) => setAdGoal(event.target.value)}
              >
                <option value="">광고 목적을 선택하세요</option>
                {AD_GOAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-[#111827]">요청사항</label>
              <textarea
                className="min-h-30 w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827]"
                placeholder="광고에 포함하고 싶은 내용을 입력하세요..."
                value={requestText}
                onChange={(event) => setRequestText(event.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#9CA3AF]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={isUploadEnabled}
                onChange={(event) => setIsUploadEnabled(event.target.checked)}
              />
              도면 파일 업로드 (선택사항)
            </label>

            {isUploadEnabled && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] p-4">
                <p className="text-sm text-[#9CA3AF]">
                  제품 도면이나 디자인 시안을 업로드하면 더 정확한 광고를 생성할 수 있습니다.
                </p>
                <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-sm text-[#9CA3AF] hover:border-gray-300">
                  <span className="text-2xl">?</span>
                  <span className="mt-2 font-semibold text-[#6B7280]">
                    클릭하여 파일 선택 (JPG, PNG, PDF)
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(event) => setUploadFileName(event.target.files?.[0]?.name ?? "")}
                  />
                </label>
                {uploadFileName && (
                  <p className="mt-3 text-sm text-[#6B7280]">선택된 파일: {uploadFileName}</p>
                )}
              </div>
            )}
          </Card>
        </section>
      )}

      {currentStep === 2 && (
        <section>
          <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">트렌드 분석</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">AI 트렌드 분석 결과</p>
            </div>

            <div className="mb-6 flex gap-3 rounded-lg bg-blue-50 p-4 text-blue-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">AI 트렌드 분석 완료</p>
                <p className="mt-1">{TREND_SUMMARY}</p>
              </div>
            </div>

            <p className="mb-3 text-sm font-bold text-[#111827]">
              추천 트렌드 키워드 (복수 선택 가능)
            </p>
            <div className="mb-6 space-y-2">
              {TREND_KEYWORDS.map((keyword) => (
                <label
                  key={keyword.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    checked={selectedKeywords.includes(keyword.title)}
                    onChange={() =>
                      setSelectedKeywords((prev) =>
                        prev.includes(keyword.title)
                          ? prev.filter((item) => item !== keyword.title)
                          : [...prev, keyword.title],
                      )
                    }
                  />
                  <div>
                    <p className="font-bold text-[#111827]">{keyword.title}</p>
                    <p className="mt-1 text-sm text-[#9CA3AF]">{keyword.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <p className="mb-2 text-sm font-bold text-[#111827]">추천 해시태그</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {TREND_HASHTAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="rounded-xl bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
              인기 &amp; 스타일
              <br />
              <span className="text-[#9CA3AF]">{TREND_STYLE_SUMMARY}</span>
            </div>
          </Card>
        </section>
      )}

      {currentStep === 3 && (
        <section>
          <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">가이드 선택</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">AI 생성 가이드 선택</p>
            </div>

            <div className="mb-6 flex gap-3 rounded-lg bg-purple-50 p-4 text-purple-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">AI 가이드 생성 완료</p>
                <p className="mt-1">선택한 트렌드를 바탕으로 맞춤형 광고 가이드를 생성했습니다.</p>
              </div>
            </div>

            <div className="space-y-3">
              {GUIDE_OPTIONS.map((guide) => (
                <button
                  key={guide.title}
                  type="button"
                  onClick={() => setSelectedGuide(guide.title)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedGuide === guide.title
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-bold text-[#111827]">{guide.title}</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{guide.description}</p>
                  <p className="mt-2 rounded-md bg-[#F9FAFB] px-3 py-2 text-[11px] text-[#6B7280]">
                    {guide.example}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </section>
      )}

      {currentStep === 4 && (
        <section>
          <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">광고 문구 선택</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">맞춤형 광고 문구 선택</p>
            </div>

            <div className="mb-6 flex gap-3 rounded-lg bg-indigo-50 p-4 text-indigo-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">AI 광고 문구 생성 완료</p>
                <p className="mt-1">선택한 가이드 "감성적 스토리텔링"에 맞춘 광고 문구를 추천합니다.</p>
              </div>
            </div>

            <div className="space-y-3">
              {AD_COPY_OPTIONS.map((copy) => (
                <button
                  key={copy.title}
                  type="button"
                  onClick={() => setSelectedCopy(copy.title)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedCopy === copy.title
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-bold text-[#111827]">{copy.title}</p>
                  <p className="mt-2 text-sm text-[#9CA3AF]">{copy.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </section>
      )}

      {currentStep === 5 && (
        <section>
          <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">콘텐츠 생성</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">최종 광고 콘텐츠 생성</p>
            </div>

            <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4 text-green-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">광고 콘텐츠 생성 준비 완료</p>
                <p className="mt-1">선택한 옵션으로 다양한 형태의 광고 콘텐츠를 생성합니다.</p>
              </div>
            </div>

            <p className="mb-3 text-sm font-bold text-[#111827]">
              생성할 콘텐츠 타입 선택 (복수 선택 가능)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_TYPE_OPTIONS.map((type) => {
                const isSelected = selectedTypes.includes(type.title);
                const Icon = type.icon;
                return (
                  <button
                    key={type.title}
                    type="button"
                    onClick={() =>
                      setSelectedTypes((prev) =>
                        prev.includes(type.title)
                          ? prev.filter((item) => item !== type.title)
                          : [...prev, type.title],
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-green-300 bg-green-50"
                        : "border-gray-100"
                    }`}
                  >
                    <Icon className="mb-2 h-5 w-5 text-gray-700" />
                    <p className="text-sm font-bold text-[#111827]">{type.title}</p>
                    <p className="mt-1 text-xs text-[#9CA3AF]">{type.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
              <Lightbulb className="mt-0.5 h-4 w-4" />
              <span>Tip: {CONTENT_TIP}</span>
            </div>
          </Card>
        </section>
      )}
    </ADStepLayout>
  );
}

