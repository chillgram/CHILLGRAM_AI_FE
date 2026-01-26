export default function StepProgress({ currentStep }) {
  const steps = [
    "정보 입력",
    "트렌드 분석",
    "가이드 선택",
    "문구 선택",
    "콘텐츠 생성",
  ];

  const progressPercent =
    ((currentStep + 1 - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-10">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 🔹 기존 StepProgress 그대로 */}
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex items-center w-full">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
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
              <span
                className={`ml-3 text-sm whitespace-nowrap
                  ${
                    isActive
                      ? "text-black font-medium"
                      : "text-gray-500"
                  }`}
              >
                {label}
              </span>

              {/* Line */}
              {stepNumber !== steps.length && (
                <div
                  className={`flex-1 h-[2px] mx-4
                    ${
                      isCompleted
                        ? "bg-green-400"
                        : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
