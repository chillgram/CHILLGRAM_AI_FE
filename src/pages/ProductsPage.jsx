import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import CreateProjectModal from "@/components/products/CreateProjectModal";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);

  const handleCreate = (payload) => {
    console.log("create payload:", payload);
    setOpenCreate(false);
  };

  const products = [
    {
      id: 1,
      name: "project name #01",
      category: "category #01",
      progress: 50,
      createdAt: "2026-01-19 20:51",
    },
  ];
  // DashboardPage에서와 같이 TopTabs 제거했습니다
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-end mb-10">
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#66FF2A] px-10 text-base font-extrabold text-black hover:brightness-95 transition-all shadow-sm"
          >
            제품 추가
          </button>
        </div>

        {/* 본문 */}
        <div>
          <h1 className="text-6xl font-extrabold text-[#3b312b]">상품</h1>
          <p className="mt-6 text-xl text-gray-700 font-medium">
            새 상품을 추가하거나 기존 상품을 확인하세요
          </p>

          <div className="mt-16 space-y-10">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="cursor-pointer"
              >
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateProjectModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}
