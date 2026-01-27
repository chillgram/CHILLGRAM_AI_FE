export default function StepProgress({ currentStep }) {
  const steps = [
    "정보 입력",
    "트렌드 분석",
    "가이드 선택",
    "문구 선택",
    "콘텐츠 생성",
  ];

  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="mt-10 mb-10 w-full ">
      {/* 상단 텍스트 */}
      <div className="h-3 mb-5 relative">
        <span>
          Step {currentStep} / {steps.length}
        </span>
        <span className="absolute right-0">{progressPercent}% 완료</span>
      </div>

      {/* 상단 프로그레스 바 */}
      <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* StepProgress */}
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="relative flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted
                      ? "bg-green-400 text-black"
                      : isActive
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {stepNumber}
              </div>

              {/* Label */}
              <div
                className={`mt-5 text-sm whitespace-nowrap
                  ${isActive ? "text-black font-medium" : "text-gray-500"}`}
              >
                {label}
              </div>

              {/* Line */}
              {stepNumber !== steps.length && (
                <div
                  className={`absolute top-8 left-30 h-1 w-20
                    ${isCompleted ? "bg-green-400" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
