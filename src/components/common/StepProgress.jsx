import { ArrowRightCircleIcon } from "lucide-react";

export default function StepProgress({ currentStep, steps }) {
  // const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="mb-10 mt-10 w-full">
      {/* progress bar 구현 - 후 순위 */}
      {/* <div className="relative mb-5 flex items-center text-xs">
        <span>
          Step {currentStep} / {steps.length}
        </span>
        <span className="absolute right-0">{progressPercent}% 완료</span>
      </div> */}

      {/* <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${progressPercent}%`}}
        />
      </div> */}

      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="relative gap-5 flex items-center ">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xm font-semibold
                  ${
                    isCompleted
                      ? "bg-[#60A5FA] text-black"
                      : isActive
                        ? "bg-[#60A5FA] text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              <div
                className={`whitespace-nowrap text-xm font-semibold 
                  ${isCompleted ? "text-black" : isActive ? "font-semibold text-[#60A5FA]" : "text-gray-200"}`}
              >
                {label}
              </div>
              <div
                className={`ml-10 whitespace-nowrap text-xm font-semibold 
                  ${isCompleted ? "text-[#60A5FA]" : isActive ? "font-semibold text-black" : "text-gray-200"}`}
              >
                {stepNumber !== 4 && <ArrowRightCircleIcon className={`${isCompleted ? "text-gray-200" : isActive ? "font-semibold text-[#60A5FA] animate-pulse" : "text-gray-200"}`}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
