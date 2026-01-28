import React, { useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Field } from "@/components/common/Field";
import { PrimaryButton } from "@/components/common/PrimaryButton";

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 검색 및 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");

  // 데이터 (나중에 백엔드 연동 시 이 부분을 state로 관리하면 댐)
  const products = [
    {
      id: 1,
      name: "프리미엄 초콜릿",
      category: "초콜릿",
      desc: "벨기에산 카카오 70% 함유",
      price: "15,000원",
      status: "활성",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "유기농 쿠키",
      category: "쿠키",
      desc: "100% 유기농 재료로 만든 건강 쿠키",
      price: "12,000원",
      status: "활성",
      date: "2024-01-10",
    },
    {
      id: 3,
      name: "과일 캔디",
      category: "캔디",
      desc: "천연 과일 농축액으로 만든 캔디",
      price: "8,000원",
      status: "비활성",
      date: "2024-01-05",
    },
  ];

  // 상단 통계 수치
  const stats = [
    {
      title: "전체 제품",
      value: products.length,
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "활성 제품",
      value: products.filter((p) => p.status === "활성").length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "비활성 제품",
      value: products.filter((p) => p.status === "비활성").length,
      icon: XCircle,
      color: "text-gray-400",
    },
  ];

  // 검색 및 탭에 따른 필터링 로직
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "전체" || product.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleEditOpen = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-full bg-[#F5F7FA] py-12">
      <Container>
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#111827] mb-3 tracking-tighter">
              제품 관리
            </h1>
            <p className="text-lg text-[#9CA3AF] font-medium">
              제품을 등록하고 광고 현황을 확인하세요
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#5BF22F] hover:brightness-95 text-black px-6 py-4 rounded-2xl flex items-center gap-2 font-black text-lg shadow-sm transition-all active:scale-95"
          >
            <Plus size={24} strokeWidth={3} /> 제품 추가
          </button>
        </div>

        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="flex h-44 flex-col justify-between border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">
                  {stat.title}
                </span>
                <stat.icon size={22} className={stat.color} strokeWidth={2.5} />
              </div>
              <div className="text-4xl font-black text-[#111827] tabular-nums">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {/* 검색 및 필터 탭 섹션 */}
        <div className="space-y-6 mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search
                className="text-gray-300 group-focus-within:text-[#5BF22F] transition-colors"
                size={22}
              />
            </div>
            <input
              type="text"
              placeholder="찾으시는 제품명을 입력해 주세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 py-6 pl-16 pr-8 rounded-[24px] text-xl font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-[#5BF22F]/10 focus:border-[#5BF22F] transition-all placeholder:text-gray-300"
            />
          </div>

          {/* 필터 탭 버튼 */}
          <div className="flex gap-3">
            {["전체", "활성", "비활성"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
                  activeTab === tab
                    ? "bg-[#111827] text-white shadow-lg scale-105"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {tab} (
                {tab === "전체"
                  ? products.length
                  : products.filter((p) => p.status === tab).length}
                )
              </button>
            ))}
          </div>
        </div>

        {/* 제품 목록 테이블 카드 */}
        <Card className="border-gray-200 shadow-sm p-10 overflow-hidden">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">
              제품 목록
            </h3>
            <p className="text-[#9CA3AF] font-medium">
              제품명을 클릭하면 해당 제품의 상세 광고 현황으로 이동합니다
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-50">
                  <th className="py-5 font-bold text-gray-400 text-xs uppercase tracking-widest px-4">
                    제품명
                  </th>
                  <th className="py-5 font-bold text-gray-400 text-xs uppercase tracking-widest px-4">
                    카테고리
                  </th>
                  <th className="py-5 font-bold text-gray-400 text-xs uppercase tracking-widest px-4 text-center">
                    상태
                  </th>
                  <th className="py-5 font-bold text-gray-400 text-xs uppercase tracking-widest px-4 text-center">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/products/${product.id}`)
                    }
                  >
                    <td className="py-7 px-4">
                      <div className="font-black text-[#111827] text-lg group-hover:text-[#5BF22F] transition-colors underline underline-offset-8 decoration-transparent group-hover:decoration-[#5BF22F]/30">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 font-medium">
                        {product.desc}
                      </div>
                    </td>
                    <td className="py-7 px-4">
                      <span className="text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-7 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black shadow-sm ${
                          product.status === "활성"
                            ? "bg-[#E9FBE4] text-[#2ECC71]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${product.status === "활성" ? "bg-[#2ECC71]" : "bg-gray-400"}`}
                        />
                        {product.status}
                      </span>
                    </td>
                    <td className="py-7 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={(e) => handleEditOpen(e, product)}
                          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-500 hover:border-blue-100 hover:shadow-sm transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 hover:shadow-sm transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 결과 없음 처리 */}
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center">
                <div className="inline-flex p-6 bg-gray-50 rounded-full mb-4">
                  <Search size={40} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-black text-xl">
                  검색 결과가 없습니다
                </p>
                <p className="text-gray-300 font-medium mt-1">
                  다른 키워드로 검색해 보세요
                </p>
              </div>
            )}
          </div>
        </Card>
      </Container>

      {/* 추가 모달 */}
      {isAddModalOpen && (
        <ProductModal
          title="새 제품 추가"
          confirmLabel="제품 등록하기"
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <ProductModal
          title="제품 정보 수정"
          confirmLabel="수정 완료"
          initialData={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

// 모달 컴포넌트
function ProductModal({ title, confirmLabel, onClose, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { name: "", category: "", desc: "", price: "" },
  );

  return (
    <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] w-full max-w-xl p-12 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-gray-300 hover:text-[#111827] transition-colors p-2 hover:bg-gray-50 rounded-full"
        >
          <X size={32} />
        </button>

        <h2 className="text-4xl font-black text-[#111827] mb-2 tracking-tighter">
          {title}
        </h2>
        <p className="text-gray-400 font-medium mb-10 text-lg">
          제품의 최신 정보를 정확하게 입력해 주세요
        </p>

        <div className="space-y-8">
          <Field
            label="제품명"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
          <div className="grid grid-cols-2 gap-6">
            <Field
              label="카테고리"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
            />
            <Field
              label="판매 가격"
              value={formData.price}
              onChange={(val) => setFormData({ ...formData, price: val })}
            />
          </div>
          <Field
            label="제품 설명"
            value={formData.desc}
            onChange={(val) => setFormData({ ...formData, desc: val })}
          />

          <div className="flex gap-4 pt-6">
            <Button
              variant="secondary"
              className="flex-1 h-20! rounded-[24px] font-black text-xl bg-gray-50 border-none hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              취소
            </Button>
            <PrimaryButton
              className="flex-1 mt-0! h-2 0! rounded-[24px] font-black text-xl shadow-lg shadow-[#5BF22F]/20"
              onClick={onClose}
            >
              {confirmLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
