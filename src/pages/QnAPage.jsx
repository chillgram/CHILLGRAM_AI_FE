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
            <Card onClick={() => navigate(`/qna/${q.id}`)}>
              <h3 className="text-2xl font-extrabold text-[#3b312b]">{q.title}</h3>
              <p className="mt-3 text-base text-gray-600">{q.category}</p>
              <div className="mt-16 text-sm text-gray-500">생성 일시 {q.createdAt}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
