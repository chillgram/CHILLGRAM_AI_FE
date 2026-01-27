const DEFAULT_STEPS = [
  "정보 입력",
  "트렌드 분석",
  "가이드 선택",
  "광고 문구 선택",
  "콘텐츠 생성",
];

export default function StepProgress({ currentStep, steps = DEFAULT_STEPS }) {
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-10 mt-10 w-full">
      <div className="relative mb-5 flex items-center text-xs text-gray-500">
        <span>
          Step {currentStep} / {steps.length}
        </span>
        <span className="absolute right-0">{progressPercent}% 완료</span>
      </div>

      <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="relative flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted
                      ? "bg-[#5BF22F] text-black"
                      : isActive
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {stepNumber}
              </div>

              <div
                className={`mt-4 whitespace-nowrap text-xs
                  ${isActive ? "font-semibold text-black" : "text-gray-500"}`}
              >
                {label}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}


