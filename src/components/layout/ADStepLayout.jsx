import Container from "@/components/common/Container";
import StepProgress from "@/components/common/StepProgress";

const DEFAULT_STEPS = [
  "정보 입력",
  "트렌드 분석",
  "가이드 선택",
  "광고 문구 선택",
  "콘텐츠 생성",
];

export default function ADStepLayout({
  step,
  children,
  onPrev,
  onNext,
  disableNext,
  nextLabel,
}) {
  const labels = DEFAULT_STEPS;

  return (
    <div className="min-h-full bg-[#F9FAFB] py-12">
      <Container className="relative space-y-16">
        <div className="sticky top-0 z-20 bg-[#F9FAFB] pb-4">
          <StepProgress currentStep={step} steps={labels} />
        </div>

        <div className="space-y-24 pb-24">{children}</div>

        <div className="sticky bottom-0 z-20 border-t bg-[#F9FAFB] pt-4">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onPrev}
              disabled={step === 1}
              className="flex h-12 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 font-bold text-gray-700 shadow-sm disabled:opacity-50"
            >
              <span>←</span>
              이전
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={disableNext}
              className={`flex h-12 items-center gap-2 rounded-2xl px-6 font-black shadow-sm ${
                disableNext
                  ? "bg-gray-300 text-gray-500"
                  : "bg-[#5BF22F] text-black hover:brightness-95"
              }`}
            >
              {nextLabel ?? "다음"}
              <span>→</span>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
