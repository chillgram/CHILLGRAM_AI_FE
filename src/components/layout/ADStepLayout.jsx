import Container from "@/components/common/Container";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
          <ArrowLeft size={20} />
          제품관리
        </button>
      </div>
      <div className="space-y-10 pb-24 border border-gray-200 bg-white rounded-3xl p-5 shadow-lg">
        {children}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <ArrowLeft size={20} />
          이전
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className={`flex items-center gap-1.5 rounded-lg text-sm px-4 py-2 font-bold shadow-sm ${
            disableNext
              ? "bg-gray-300 text-gray-500"
              : "bg-[#60A5FA] text-white hover:brightness-95"
          }`}
        >
          {nextLabel ?? "다음"}
          <ArrowRight size={20} />
        </button>
      </div>
    </Container>
  );
}
