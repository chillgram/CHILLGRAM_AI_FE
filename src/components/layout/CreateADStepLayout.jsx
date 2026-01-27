import Container from "@/components/common/Container";
import StepProgress from "@/components/common/StepProgress";

const DEFAULT_STEPS = [
  "정보 입력",
  "트렌드 분석",
  "가이드 선택",
  "광고 문구 선택",
  "콘텐츠 생성",
];

export default function CreateADStepLayout({
  step,
  children,
  onPrev,
  onNext,
  disableNext,
  nextLabel,
}) {
  const labels = DEFAULT_STEPS;

  return (
    <Container className="relative mt-10 space-y-16 text-xs">
      <div className="sticky top-0 z-20 bg-white pb-4">
        <StepProgress currentStep={step} steps={labels} />
      </div>

      <div className="space-y-24 pb-24">{children}</div>

      <div className="sticky bottom-0 z-20 border-t bg-white pt-4">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={step === 1}
            className="flex h-10 items-center gap-2 rounded-lg bg-gray-100 px-6 disabled:opacity-50"
          >
            <span>←</span>
            이전
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={disableNext}
            className={`flex h-10 items-center gap-2 rounded-lg px-6 font-medium ${
              disableNext ? "bg-gray-300 text-gray-500" : "bg-green-400 text-black"
            }`}
          >
            {nextLabel ?? "다음"}
            <span>→</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

