import { useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "../components/common/Container";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Field } from "../components/common/Field";
import { PrimaryButton } from "../components/common/PrimaryButton";

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const stats = [
    { title: "전체 제품", value: "3", icon: Package, color: "text-blue-500" },
    {
      title: "활성 제품",
      value: "2",
      icon: CheckCircle,
      color: "text-green-500",
    },
    { title: "비활성 제품", value: "1", icon: XCircle, color: "text-gray-400" },
  ];

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
            <h1 className="text-5xl font-black text-[#111827] mb-3">
              제품 관리
            </h1>
            <p className="text-lg text-[#9CA3AF] font-medium">
              제품을 등록하고 광고 현황을 확인하세요
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#5BF22F] hover:brightness-95 text-black px-6 py-4 rounded-2xl flex items-center gap-2 font-black text-lg shadow-sm transition-all"
          >
            <Plus size={24} strokeWidth={3} /> 제품 추가
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="flex h-44 flex-col justify-between border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-[#9CA3AF]">
                  {stat.title}
                </span>
                <stat.icon size={22} className={stat.color} strokeWidth={2.5} />
              </div>
              <div className="text-4xl font-black text-[#111827]">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-gray-200 shadow-sm p-10">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-[#111827] mb-2">
              제품 목록
            </h3>
            <p className="text-[#9CA3AF] font-medium">
              제품명을 클릭하면 상세 광고 현황 페이지로 이동합니다
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-bold text-gray-400 text-sm">
                    제품명
                  </th>
                  <th className="py-4 font-bold text-gray-400 text-sm">
                    카테고리
                  </th>
                  <th className="py-4 font-bold text-gray-400 text-sm">설명</th>
                  <th className="py-4 font-bold text-gray-400 text-sm">가격</th>
                  <th className="py-4 font-bold text-gray-400 text-sm">상태</th>
                  <th className="py-4 font-bold text-gray-400 text-sm text-center">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/products/${product.id}`)
                    }
                  >
                    <td className="py-6 font-bold text-[#111827] hover:text-[#5BF22F] underline decoration-dotted underline-offset-4">
                      {product.name}
                    </td>
                    <td className="py-6 text-gray-600">{product.category}</td>
                    <td className="py-6 text-gray-500 text-sm max-w-xs truncate">
                      {product.desc}
                    </td>
                    <td className="py-6 font-semibold text-[#111827]">
                      {product.price}
                    </td>
                    <td className="py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          product.status === "활성"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => handleEditOpen(e, product)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>

      {isAddModalOpen && (
        <ProductModal
          title="새 제품 추가"
          confirmLabel="추가"
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      {isEditModalOpen && (
        <ProductModal
          title="제품 수정"
          confirmLabel="저장"
          initialData={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

function ProductModal({ title, confirmLabel, onClose, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { name: "", category: "", desc: "", price: "" },
  );
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-4xl w-full max-w-lg p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-black"
        >
          <X size={28} />
        </button>
        <h2 className="text-3xl font-black text-[#111827] mb-2">{title}</h2>
        <div className="space-y-6 mt-10">
          <Field
            label="제품명"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
          <Field
            label="가격"
            value={formData.price}
            onChange={(val) => setFormData({ ...formData, price: val })}
          />
          <div className="flex gap-4 pt-4">
            <Button
              variant="secondary"
              className="flex-1 h-16! rounded-xl font-bold"
              onClick={onClose}
            >
              취소
            </Button>
            <PrimaryButton className="flex-1 mt-0! h-16!" onClick={onClose}>
              {confirmLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
