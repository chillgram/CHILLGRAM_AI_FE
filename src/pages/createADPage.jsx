import { useRef, useState } from "react";
import StepProgress from "../components/common/StepProgress";
import Card from "../components/common/Card";
import Container from "@/components/common/Container";

export default function CreateADPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

  /* STEP 1 상태 */
  const [productId, setProductId] = useState("");
  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");

  /* refs */
  const stepRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
  };

  const scrollToStep = (step) => {
    setCurrentStep(step);
    stepRefs[step]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const canProceedStep1 = Boolean(productId && adGoal);

  const goNext = () => {
    if (currentStep === 1 && !canProceedStep1) return;

    if (currentStep === 5) {
      console.log("광고 생성 시작");
      return;
    }

    const next = currentStep + 1;
    setMaxUnlockedStep((prev) => Math.max(prev, next));
    scrollToStep(next);
  };

  const goPrev = () => {
    if (currentStep === 1) return;
    scrollToStep(currentStep - 1);
  };

  return (
    <Container className="relative mt-10 space-y-16 text-xs">
      {/* StepProgress */}
      <div className="sticky top-0 z-20 bg-white pb-4">
        <StepProgress currentStep={currentStep} />
      </div>

      {/* CONTENT */}
      <div className="space-y-24 pb-24">
        {/* STEP 1 */}
        <section ref={stepRefs[1]}>
          <Card className="rounded-xl p-8">
            <h2 className="mb-6 text-lg font-semibold">정보 입력</h2>

            <select
              className="mb-4 w-full rounded-lg border px-4 py-2"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">제품 선택 *</option>
              <option value="A">제품 A</option>
              <option value="B">제품 B</option>
            </select>

            <select
              className="mb-4 w-full rounded-lg border px-4 py-2"
              value={adGoal}
              onChange={(e) => setAdGoal(e.target.value)}
            >
              <option value="">광고 목적 *</option>
              <option value="brand">브랜드 인지도</option>
              <option value="sales">판매 촉진</option>
            </select>

            <textarea
              className="min-h-[80px] w-full rounded-lg border px-4 py-2"
              placeholder="요청사항"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
            />
          </Card>
        </section>

        {/* STEP 2 */}
        {maxUnlockedStep >= 2 && (
          <section ref={stepRefs[2]}>
            <Card className="rounded-xl p-8">
              <h2 className="mb-2 font-semibold">AI 트렌드 분석 완료</h2>

              {/* 안내사항 */}
              <div className="mb-6 flex gap-3 rounded-lg bg-blue-50 p-4 text-blue-700">
                <div className="mt-0.5 text-lg">📊</div>
                <div>
                  <p className="font-semibold">트렌드 분석 안내</p>
                  <p className="mt-1">
                    현재 식품 업계의 트렌드를 분석하여 최적의 키워드를 추천합니다
                  </p>
                </div>
              </div>

              <p className="mb-2 font-semibold">
                추천 트렌드 키워드 (복수 선택 가능)
              </p>

              <div className="space-y-2 mb-6">
                {[
                  ["건강", "건강을 중시하는 트렌드"],
                  ["친환경", "지속가능한 소비"],
                  ["프리미엄", "고급화 트렌드"],
                  ["신선함", "신선한 원료"],
                  ["자연주의", "자연 친화적"],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-lg border px-4 py-3">
                    <p className="font-medium">{t}</p>
                    <p className="mt-1 text-xs text-gray-500">{d}</p>
                  </div>
                ))}
              </div>

              <p className="mb-2 font-semibold">추천 해시태그</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  "#건강간식",
                  "#친환경포장",
                  "#프리미엄디저트",
                  "#신선한과일",
                  "#자연주의",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-600">
                현재 가장 인기 있는 스타일은 <b>미니멀리즘</b> 과{" "}
                <b>자연친화적 이미지</b> 입니다.
              </p>
            </Card>
          </section>
        )}

        {/* STEP 3 */}
        {maxUnlockedStep >= 3 && (
          <section ref={stepRefs[3]}>
            <Card className="rounded-xl p-8">
              <h2 className="mb-2 font-semibold">AI 생성 가이드 선택</h2>

              <div className="mb-6 flex gap-3 rounded-lg bg-purple-50 p-4 text-purple-700">
                <div className="mt-0.5 text-lg">🧭</div>
                <div>
                  <p className="font-semibold">가이드 생성 완료</p>
                  <p className="mt-1">
                    선택한 트렌드를 바탕으로 맞춤형 광고 가이드를 생성했습니다
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">감성적 스토리텔링</p>
                  <p className="text-xs text-gray-500">
                    소비자의 감성을 자극하는 스토리 중심 광고
                  </p>
                </div>
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">제품 중심 홍보</p>
                  <p className="text-xs text-gray-500">
                    제품의 특장점을 강조하는 정보형 광고
                  </p>
                </div>
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">트렌디한 비주얼</p>
                  <p className="text-xs text-gray-500">
                    최신 트렌드를 반영한 시각적 광고
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* STEP 4 */}
        {maxUnlockedStep >= 4 && (
          <section ref={stepRefs[4]}>
            <Card className="rounded-xl p-8">
              <h2 className="mb-2 font-semibold">맞춤형 광고 문구 선택</h2>

              <div className="mb-6 flex gap-3 rounded-lg bg-indigo-50 p-4 text-indigo-700">
                <div className="mt-0.5 text-lg">✍️</div>
                <div>
                  <p className="font-semibold">광고 문구 생성 완료</p>
                  <p className="mt-1">
                    선택한 가이드에 맞춘 광고 문구를 추천합니다
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">행복한 순간</p>
                  <p className="text-sm text-gray-500">
                    작은 행복이 모여 큰 추억이 됩니다.
                  </p>
                </div>
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">따뜻한 마음</p>
                  <p className="text-sm text-gray-500">
                    소중한 사람과 함께 나누는 달콤함
                  </p>
                </div>
                <div className="rounded-lg border px-4 py-3">
                  <p className="font-medium">일상의 여유</p>
                  <p className="text-sm text-gray-500">
                    바쁜 하루 속 작은 쉼표
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* STEP 5 */}
        {maxUnlockedStep >= 5 && (
          <section ref={stepRefs[5]}>
            <Card className="rounded-xl p-8">
              <h2 className="mb-2 font-semibold">최종 광고 콘텐츠 생성</h2>

              <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4 text-green-700">
                <div className="mt-0.5 text-lg">🚀</div>
                <div>
                  <p className="font-semibold">콘텐츠 생성 준비 완료</p>
                  <p className="mt-1">
                    선택한 옵션으로 다양한 광고 콘텐츠를 생성합니다
                  </p>
                </div>
              </div>

              <p className="mb-2 font-semibold">
                생성할 콘텐츠 타입 선택 (복수 선택 가능)
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  "🎨 제품 이미지 AI",
                  "📦 패키지 시안 AI",
                  "📱 SNS 이미지 AI",
                  "🎬 쇼츠 AI",
                  "🖼️ 배너 이미지 AI",
                ].map((c) => (
                  <div key={c} className="rounded-lg border px-4 py-3">
                    {c}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-yellow-700">
                💡 여러 타입을 선택하여 다양한 채널에 맞는 광고를 한 번에
                생성할 수 있습니다
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* BUTTONS */}
      <div className="sticky bottom-0 z-20 border-t bg-white pt-4">
        <div className="flex justify-between">
          <button
            onClick={goPrev}
            disabled={currentStep === 1}
            className="h-10 rounded-lg bg-gray-100 px-6 disabled:opacity-50"
          >
            이전
          </button>

          <button
            onClick={goNext}
            disabled={currentStep === 1 && !canProceedStep1}
            className={`h-10 rounded-lg px-6 font-medium ${
              currentStep === 1 && !canProceedStep1
                ? "bg-gray-300 text-gray-500"
                : "bg-green-500 text-white"
            }`}
          >
            {currentStep === 5 ? "광고 생성 시작" : "다음"}
          </button>
        </div>
      </div>
    </Container>
  );
}
