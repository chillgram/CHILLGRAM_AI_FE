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

        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#111827] mb-2 tracking-tighter">
              제품 관리
            </h1>
            <p className="text-[#6B7280] font-medium">
              제품을 등록하고 관리하세요
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#60A5FA] hover:brightness-95 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} /> 제품 추가
          </button>
        </div>

        {/* 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="flex h-32 flex-col justify-between border-gray-200 shadow-sm bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {stat.title}
                </span>
                <stat.icon size={20} className="text-blue-400" strokeWidth={2} />
              </div>
              <div className="text-3xl font-bold text-[#111827] tabular-nums">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>



        <Card className="border-gray-200 shadow-sm p-8 overflow-hidden bg-white">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#111827] mb-1">제품 목록</h3>
            <p className="text-sm text-gray-400">
              등록된 모든 제품을 확인하고 관리하세요
            </p>
          </div>

          <div className="mb-8 bg-gray-100 rounded-lg flex items-center px-4 py-3">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="제품을 검색해주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[15%]">
                    제품명
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[15%]">
                    카테고리
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[25%]">
                    설명
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[10%]">
                    가격
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[10%]">
                    상태
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[15%]">
                    등록일
                  </th>
                  <th className="py-4 font-bold text-gray-500 text-xs px-4 text-center w-[10%]">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/products/${product.id}`)}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">/</td>
                    <td className="py-4 px-4 text-sm text-gray-600 block line-clamp-1">
                      /
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {/* 가격 부분을 / 로 숨김 */}
                      /
                    </td>
                    <td className="py-4 px-4">
                      {product.status === "활성" ? (
                        <span className="bg-cyan-50 text-cyan-600 px-2.5 py-1 rounded text-xs font-bold">
                          활성
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded text-xs font-bold">
                          비활성
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                      {product.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => handleEditOpen(e, product)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-red-400 hover:text-red-500 transition-colors"
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
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm">검색 결과가 없습니다</p>
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
          title="제품 수정"
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
    initialData || { name: "", category: "", desc: "" }
  );
  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isEdit ? "제품 수정" : "새 제품 추가"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isEdit ? "제품 정보를 수정하세요" : "제품 정보를 입력하세요"}
          </p>
        </div>

        <div className="space-y-5">
          {/* 제품명 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">
              제품명
            </label>
            <input
              type="text"
              placeholder="프리미엄 초콜릿"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">
              카테고리
            </label>
            <input
              type="text"
              placeholder="초콜릿"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
            />
          </div>

          {/* 설명 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">
              설명
            </label>
            <textarea
              rows={3}
              placeholder={isEdit ? "" : "제품에 대한 설명을 입력하세요"}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm resize-none"
            />
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-900">
              {isEdit ? "제품 이미지" : "제품 이미지 첨부"}
            </label>
            {isEdit && (
              <p className="text-xs text-gray-500 mb-2">
                제품의 이미지를 수정해 주세요
              </p>
            )}

            {isEdit ? (

              <div className="w-full h-32 bg-[#F0F9FF] border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center text-blue-300">
                <Package size={40} strokeWidth={1.5} />
              </div>
            ) : (

              <div className="w-full h-40 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group">
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 shadow-sm mb-3 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  파일 선택
                </button>
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  이미지를 드래그하여 놓거나 클릭하여 업로드
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF 형식 지원 • 파일당 최대 5MB
                </p>
              </div>
            )}
          </div>


          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-[#60A5FA] text-white font-semibold text-sm hover:bg-blue-500 shadow-sm transition-all"
            >
              {isEdit ? "저장" : "추가"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
