import Container from "@/components/common/Container";
import leftArrow from "@/assets/image/left-arrow.png";
import rightArrow from "@/assets/image/right-arrow.png";
import { useNavigate } from "react-router-dom";

export default function ADStepLayout({
  step,
  children,
  onPrev,
  onNext,
  disableNext,
  nextLabel,
}) {
  const navigate = useNavigate();
  return (
    <Container className="relative py-8">
      {/* 상단 네비게이션 */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard/products")}
          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <img
            src={leftArrow}
            alt="left_arrow"
            className={"max-h-3 opacity-40"}
          />
          제품관리
        </button>
      </div>
      <div className="space-y-10 pb-24 border border-gray-200 bg-white rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-xl">AI 광고 생성</h3>
        <p className="-mt-8 text-sm text-gray-400">제품 정보를 입력하세요</p>
        {children}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <img
            src={leftArrow}
            alt="left_arrow"
            className={"max-h-3 opacity-60"}
          />
          이전
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className={`flex items-center gap-1.5 rounded-2xl rounded-lg text-sm px-4 py-2 font-bold shadow-sm ${
            disableNext
              ? "bg-gray-300 text-gray-500"
              : "bg-[#60A5FA] text-white hover:brightness-95"
          }`}
        >
          {nextLabel ?? "다음"}
          <img
            src={rightArrow}
            alt="left_arrow"
            className={"max-h-3 opacity-60"}
          />
        </button>
      </div>
    </Container>
  );
}
