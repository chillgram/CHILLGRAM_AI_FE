export default function StepProgress({ currentStep = 1, steps = [] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-6">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCurrent = stepNumber === currentStep;

          // 규칙: 현재만 파란색, 나머지는 회색
          const circleClass = isCurrent
            ? "bg-blue-500 border-blue-500 text-white"
            : "bg-gray-100 border-gray-300 text-gray-700";

          const labelClass = isCurrent
            ? "text-blue-600 font-bold"
            : "text-gray-600 font-medium";

          // 구분 화살표(>)도 현재 기준으로 강조하지 말고 그냥 회색 고정
          const arrowClass = "text-gray-300";

          return (
            <div key={label} className="flex items-center gap-6">
              {/* step item */}
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-full border text-base font-bold",
                    circleClass,
                  ].join(" ")}
                >
                  {stepNumber}
                </div>
                <div className={["text-base", labelClass].join(" ")}>
                  {label}
                </div>
              </div>

              {/* arrow between steps */}
              {idx !== steps.length - 1 && (
                <span className={["text-2xl font-bold", arrowClass].join(" ")}>
                  ›
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
