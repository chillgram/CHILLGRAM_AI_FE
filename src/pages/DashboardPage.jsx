import TopTabs from "@/components/navigation/TopTabs";

export default function DashboardPage() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex justify-end">
          <TopTabs 
            tabs={[
                { label: "상품", value: "products", path: "/products" },
                { label: "대시보드", value: "dashboard", path: "/dashboard" },
            ]}
            />
        </div>

        <h1 className="text-6xl font-extrabold text-[#3b312b]">사용자 대시보드</h1>
      </div>
    </section>
  );
}
