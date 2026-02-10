import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ImageIcon,
  FileUp,
  Sparkles,
  CheckCircle2,
  Box,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import { PRODUCTS } from "@/data/products";
import Button from "../components/common/Button";

const PRODUCT_IMAGES = [
  {
    id: "prod-img-1",
    title: "프리미엄 패키지 디자인",
    desc: "고급스러운 색상",
  },
  { id: "prod-img-2", title: "모던 스타일 패키지", desc: "심플한 디자인" },
  { id: "prod-img-3", title: "내추럴 컨셉 패키지", desc: "친환경 이미지" },
  { id: "prod-img-4", title: "럭셔리 골드 패키지", desc: "프리미엄 느낌" },
  { id: "prod-img-5", title: "미니멀 화이트 패키지", desc: "깔끔한 디자인" },
  { id: "prod-img-6", title: "비비드 컬러 패키지", desc: "젊고 역동적" },
];

export default function DesignPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(productId)) || {
    name: "제품 선택 안됨",
  };

  const [selectedId, setSelectedId] = useState("prod-img-1");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleGenerate = () => {
    // 생성 로직 및 결과 페이지 이동
    navigate(-1, { state: { productId, selectedId } });
  };

  return (
    <Container className="relative py-8">
      {/* 상단 네비게이션 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} /> 프로잭트 목록
        </button>
      </div>
      {/* 헤더 섹션 */}
      <div className="space-y-10 pb-24 border border-gray-200 bg-white rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-xl">도안 생성</h3>
        <p className="-mt-8 text-sm text-gray-400">
          제품을 선택하고 도면을 업로드하여 AI 목업을 생성하세요.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* 1. 제품 이미지 선택 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#F9F5FF] rounded-xl text-[#7F56D9]">
                <ImageIcon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  제품 이미지 선택
                </h3>
                <p className="text-sm text-[#667085]">
                  광고 생성에서 만든 제품 이미지를 선택하세요
                </p>
              </div>
            </div>

            <div className="space-y-3 p-2">
              {PRODUCT_IMAGES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedId === item.id
                      ? "border-[#7F56D9] bg-[#F9F5FF]"
                      : "border-[#F2F4F7] bg-white hover:border-[#EAECF0]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-[#D0D5DD]">
                      <Box size={24} />
                    </div>
                    <div>
                      <h4
                        className={`text-[15px] font-bold ${selectedId === item.id ? "text-[#7F56D9]" : "text-[#101828]"}`}
                      >
                        {item.title} - {item.desc}
                      </h4>
                      <p className="text-xs text-[#667085] mt-1">{item.id}</p>
                    </div>
                  </div>
                  {selectedId === item.id && (
                    <CheckCircle2 size={24} className="text-[#7F56D9]" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 2. 패키지 도면 업로드 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#EFF8FF] rounded-xl text-[#60A5FA]">
                <FileUp size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  패키지 도면 업로드
                </h3>
                <p className="text-sm text-[#667085]">
                  제품 패키지 도면 파일을 업로드하세요 (PNG, JPG)
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsUploaded(true)}
              className={`group border-2 border-dashed rounded-3xl p-14 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isUploaded
                  ? "border-[#60A5FA] bg-[#edf5ff]"
                  : "border-[#EAECF0] hover:bg-[#F9FAFB] hover:border-[#D0D5DD]"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  isUploaded
                    ? "bg-[#edf5ff] text-[#60A5FA]"
                    : "bg-[#F2F4F7] text-[#667085]"
                }`}
              >
                {isUploaded ? <CheckCircle2 size={28} /> : <FileUp size={28} />}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-[#101828]">
                  {isUploaded
                    ? "파일 업로드 완료"
                    : "클릭하여 업로드 또는 드래그 앤 드롭"}
                </p>
                <p className="text-sm text-[#98A2B3] mt-1 font-medium">
                  PNG, JPG (최대 10MB)
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* 하단 플로팅 액션바 스타일 버튼 */}
        <div className="mt-12 flex flex-col items-center">
          <Button
            variant="secondary"
            onClick={handleGenerate}
            className={`flex items-center gap-3 rounded-lg text-sm px-4 py-2 font-bold shadow-sm transition-all active:scale-95 ${
              isUploaded
                ? "bg-primary hover:bg-yellow-500 shadow-yellow-100"
                : "bg-[#F3F3F3] text-[#98A2B3] cursor-not-allowed"
            }`}
          >
            <Sparkles size={22} />
            목업 생성하기
          </Button>
          {!isUploaded && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#F04438] font-medium">
              <AlertCircle size={16} />
              <span>파일 업로드가 완료되어야 생성이 가능합니다.</span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
