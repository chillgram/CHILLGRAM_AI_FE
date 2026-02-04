import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductStats } from "@/services/api/productApi";
import { useAuthStore } from "@/stores/authStore";

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 검색 및 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체");

  // 1. 제품 목록 조회
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ page: 0, size: 10 }),
    enabled: bootstrapped,
  });

  const products = productsData?.content || [];

  // 2. 통계 데이터 조회
  const { data: statsData } = useQuery({
    queryKey: ["productStats"],
    queryFn: fetchProductStats,
    enabled: bootstrapped,
    retry: false,
  });

  // 상단 통계 수치
  const stats = [
    {
      title: "전체 제품",
      value: statsData?.totalProducts || products.length,
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "활성 제품",
      value: statsData?.activeProducts || products.filter((p) => p.status === "활성").length,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "비활성 제품",
      value: statsData?.inactiveProducts || products.filter((p) => p.status === "비활성").length,
      icon: XCircle,
      color: "text-gray-400",
    },
  ];

  // 제품 추가 Mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      setIsAddModalOpen(false);
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  // 제품 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      setIsEditModalOpen(false);
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  // 제품 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
    },
    onError: (err) => {
      alert(err.message);
    }
  });

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

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm("정말로 이 제품을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
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
            <ErrorBoundary key={idx}>
              <Card className="flex h-32 flex-col justify-between border-gray-200 shadow-sm bg-white p-6">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </span>
                  <stat.icon
                    size={20}
                    className="text-blue-400"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-3xl font-bold text-[#111827] tabular-nums">
                  {stat.value}
                </div>
              </Card>
            </ErrorBoundary>
          ))}
        </div>

        <ErrorBoundary>
          <Card className="border-gray-200 shadow-sm p-8 overflow-hidden bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#111827] mb-1">
                제품 목록
              </h3>
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
                    <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[20%]">
                      제품명
                    </th>
                    <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[15%]">
                      카테고리
                    </th>
                    <th className="py-4 font-bold text-gray-500 text-xs px-4 w-[30%]">
                      설명
                    </th>
                    {/* 가격 컬럼 제거 (ERD 미지원) */}
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
                  {isLoading && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400">
                        로딩 중...
                      </td>
                    </tr>
                  )}
                  {isError && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-red-400">
                        제품 목록을 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && filteredProducts.map((product) => {
                    const productId = product.productId || product.product_id || product.id; // ID 호환성
                    const isStatusActive = product.status === "활성";
                    const dateStr = (product.createdAt || product.created_at || "").substring(0, 10);

                    return (
                      <tr
                        key={productId}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/dashboard/products/${productId}`)
                        }
                      >
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 block line-clamp-1">
                          {product.description || "-"}
                        </td>
                        <td className="py-4 px-4">
                          {isStatusActive ? (
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
                          {dateStr}
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
                              onClick={(e) => handleDelete(e, productId)}
                              className="text-red-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {!isLoading && !isError && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-20 text-center text-gray-400 text-sm">
                        검색 결과가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </ErrorBoundary>
      </Container>

      {/* 추가 모달 */}
      {isAddModalOpen && (
        <ProductModal
          title="새 제품 추가"
          confirmLabel="제품 등록하기"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <ProductModal
          title="제품 수정"
          confirmLabel="수정 완료"
          initialData={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(data) => {
            const pid = selectedProduct.productId || selectedProduct.product_id || selectedProduct.id;
            updateMutation.mutate({ id: pid, payload: data });
          }}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}

// 모달 컴포넌트
function ProductModal({ title, confirmLabel, onClose, initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    description: initialData?.description || initialData?.desc || "",
    isActive: initialData ? (initialData.status === "활성") : true,
  });

  const isEdit = !!initialData;

  const handleSubmit = () => {
    onSubmit(formData);
  };

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
            {title}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#60A5FA] text-white font-semibold text-sm hover:bg-blue-500 shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? "처리 중..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
