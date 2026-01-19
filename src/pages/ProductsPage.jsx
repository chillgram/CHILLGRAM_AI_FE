import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import CreateProjectModal from "@/components/products/CreateProjectModal";
import TopTabs from "@/components/navigation/TopTabs";

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL 기준으로 활성 탭 결정 (중요)
  const tab = location.pathname.startsWith("/dashboard") ? "dashboard" : "products";

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

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative z-10 flex justify-end">
          <div className="flex flex-col items-end gap-10">
            <TopTabs
              tabs={[
                { label: "상품", value: "products", path: "/products" },
                { label: "대시보드", value: "dashboard", path: "/dashboard" },
              ]}
            />
            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#66FF2A] px-10 text-base font-extrabold text-black hover:brightness-95"
            >
              제품 추가
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="mt-6">
          <h1 className="text-6xl font-extrabold text-[#3b312b]">상품</h1>
          <p className="mt-6 text-xl text-gray-700">
            새 상품을 추가하거나 기존 상품을 확인하세요
          </p>

          <div className="mt-16 space-y-10">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="cursor-pointer"
              >
                <ProductCard key={p.id} {...p} />
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
