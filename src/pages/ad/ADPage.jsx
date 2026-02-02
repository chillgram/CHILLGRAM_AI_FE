import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Lightbulb, Image } from "lucide-react";
import StepProgress from "@/components/common/StepProgress";
import ADStepLayout from "@/components/layout/ADStepLayout";
import Card from "@/components/common/Card";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// PRODUCT_OPTIONS에서 PRODUCTS의 name의 데이터로 데이터 관리
import { PRODUCTS } from "@/data/products";
import {
  AD_CONTENT_TYPE_OPTIONS,
  AD_COPY_OPTIONS,
  AD_GOAL_OPTIONS,
  CONTENT_TIP,
  STEP_LABELS,
  TREND_SUMMARY,
} from "@/data/ads";
import {
  TREND_AI_GUIDE_OPTIONS,
  TREND_HASHTAGS,
  TREND_KEYWORDS,
  TREND_STYLE_SUMMARY,
} from "@/data/trend";

export default function ADPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const { productId } = useParams();
  const { name } = PRODUCTS.find((p) => p.id === Number(productId));

  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [selectedCopy, setSelectedCopy] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  // STEP_LABELS >> ad 데이터로 분리
  const label = STEP_LABELS;

  const canProceed = () => {
    if (currentStep === 1)
      return productId && adGoal && selectedKeywords.length > 0;
    if (currentStep === 2) return selectedGuide;
    if (currentStep === 3) return selectedCopy;
    return true;
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === 4) {
      navigate("./result", {
        state: {
          productId,
          adGoal,
          requestText,
          selectedKeywords,
          selectedGuide,
          selectedCopy,
          selectedTypes,
        },
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <ADStepLayout
      step={currentStep}
      onPrev={handlePrev}
      onNext={handleNext}
      disableNext={!canProceed()}
      nextLabel={currentStep === 4 ? "광고 생성 시작" : "다음"}
    >
      <StepProgress currentStep={currentStep} steps={label} />

      {/* STEP 1 : 정보 입력 + 트렌드 분석 */}
      {currentStep === 1 && (
        <ErrorBoundary>
          <section>
            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#3b312b]">정보 입력</h2>
                <p className="mt-1 text-sm text-[#9CA3AF]">
                  제품 및 광고 목적 입력
                </p>
              </div>

              {/* 제품 선택 */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-[#111827]">
                  제품명
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 text-sm"
                  value={name}
                  readOnly
                />
              </div>

              {/* 광고 목적 */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-[#111827]">
                  광고 목적
                </label>
                <select
                  className="w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 text-sm"
                  value={adGoal}
                  onChange={(e) => setAdGoal(e.target.value)}
                >
                  <option value="">광고 목적을 선택하세요</option>
                  {AD_GOAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 요청사항 */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-[#111827]">
                  요청사항
                </label>
                <textarea
                  className="w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 text-sm"
                  placeholder="광고에 포함하고 싶은 내용을 입력하세요..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                />
              </div>

              {/* 트렌드 분석 UI */}
              <div className="mt-8">
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
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                        selectedKeywords.includes(keyword.title)
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 border-2 border-gray-200"
                        checked={selectedKeywords.includes(keyword.title)}
                        onChange={() =>
                          setSelectedKeywords((prev) =>
                            prev.includes(keyword.title)
                              ? prev.filter((k) => k !== keyword.title)
                              : [...prev, keyword.title],
                          )
                        }
                      />
                      <div>
                        <p
                          className={`font-bold ${selectedKeywords.includes(keyword.title) ? `text-blue-700` : `text-black`}`}
                        >
                          {keyword.title}
                        </p>
                        <p
                          className={`text-sm  ${selectedKeywords.includes(keyword.title) ? `text-blue-700` : `text-gray-500`}`}
                        >
                          {keyword.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <p className="mb-2 text-sm font-bold">추천 해시태그</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {TREND_HASHTAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="rounded-xl bg-[#F9FAFB] p-4 text-sm text-gray-500">
                  인기 & 스타일
                  <br />
                  <span className="text-gray-400">{TREND_STYLE_SUMMARY}</span>
                </div>
              </div>
            </Card>
          </section>
        </ErrorBoundary>
      )}

      {/* STEP 2 : 가이드 선택 */}
      {currentStep === 2 && (
        <ErrorBoundary>
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">가이드 선택</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">AI 생성 가이드 선택</p>
            </div>
            <div className="mb-6 flex gap-3 rounded-lg bg-purple-50 p-4 text-purple-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">AI 가이드 생성 완료</p>
                <p className="mt-1 text-sm">
                  트렌드 분석을 바탕으로 가이드를 추천합니다.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {TREND_AI_GUIDE_OPTIONS.map((guide) => (
                <button
                  key={guide.title}
                  onClick={() => setSelectedGuide(guide.title)}
                  className={`w-full rounded-xl border px-4 py-3 text-left ${
                    selectedGuide === guide.title
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-bold">{guide.title}</p>
                  <p className="text-sm text-gray-500">{guide.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </ErrorBoundary>
      )}

      {/* STEP 3 : 광고 문구 선택 */}
      {currentStep === 3 && (
        <ErrorBoundary>
          <Card className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">
                광고 문구 선택
              </h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">
                맞춤형 광고 문구 선택
              </p>
            </div>
            <div className="mb-6 flex gap-3 rounded-lg bg-indigo-50 p-4 text-indigo-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">AI 광고 문구 생성 완료</p>
                <p className="mt-1 text-sm">
                  선택한 가이드에 맞춘 광고 문구입니다.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {AD_COPY_OPTIONS.map((copy) => (
                <button
                  key={copy.title}
                  onClick={() => setSelectedCopy(copy.title)}
                  className={`w-full rounded-xl border px-4 py-3 text-left ${
                    selectedCopy === copy.title
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-bold">{copy.title}</p>
                  <p className="text-sm text-gray-500">{copy.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </ErrorBoundary>
      )}

      {/* STEP 4 : 콘텐츠 생성 */}
      {currentStep === 4 && (
        <ErrorBoundary>
          <Card className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#3b312b]">콘텐츠 생성</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">
                최종 광고 콘텐츠 생성
              </p>
            </div>
            <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4 text-green-700">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">광고 콘텐츠 생성 준비 완료</p>
                <p className="mt-1 text-sm">
                  선택한 옵션으로 광고를 생성합니다.
                </p>
              </div>
            </div>
            <div className="mb-6 flex gap-3 rounded-lg bg-sky-50 border border-blue-400 p-4 text-blue-400">
              <Image className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">제품 이미지 AI</p>
                <p className="mt-1 text-sm">
                  제품 사진을 AI로 생성 준비 완료!
                </p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-bold text-[#111827]">
                생성할 콘텐츠 타입 선택 생성 (복수 선택 가능)
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {AD_CONTENT_TYPE_OPTIONS.map((type) => {
                const Icon = type.icon;
                const selected = selectedTypes.includes(type.title);

                return (
                  <button
                    key={type.title}
                    onClick={() =>
                      setSelectedTypes((prev) =>
                        prev.includes(type.title)
                          ? prev.filter((t) => t !== type.title)
                          : [...prev, type.title],
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left ${
                      selected
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Icon className="mb-2 h-5 w-5" />
                    <p className="font-bold">{type.title}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
              <Lightbulb className="mt-0.5 h-4 w-4" />
              <span>{CONTENT_TIP}</span>
            </div>
          </Card>
        </ErrorBoundary>
      )}
    </ADStepLayout>
  );
}
