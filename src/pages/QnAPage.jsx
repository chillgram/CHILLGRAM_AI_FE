import Card from "@/components/common/Card";

export default function QnAPage() {
  const items = [
    { id: 1, title: "문의 제목입니다.", category: "category #01", createdAt: "2026-01-19 16:10" },
    { id: 2, title: "문의 제목입니다.", category: "category #01", createdAt: "2026-01-19 16:10" },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-5xl font-extrabold text-[#3b312b]">Q&amp;A</h1>
        <div className="mt-10 space-y-10">
          {items.map((q) => (
            <Card
              key={q.id}
              title={q.title}
              category={q.category}
              createdAt={q.createdAt}
              onClick={() => console.log("go detail", q.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
