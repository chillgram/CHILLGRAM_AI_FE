import Card from "@/components/common/Card";

export default function CopySelectionSection({
  copies,
  recommendedCopyId,
  selectedCopyId,
  setSelectedCopyId,
  isLoading,
}) {
  return (
    <Card className="p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#3b312b]">광고 문구 선택</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          {isLoading ? "생성 중..." : "생성된 문구 중 선택"} · 추천:{" "}
          <span className="font-semibold">{recommendedCopyId || "-"}</span>
        </p>
      </div>

      <div className="space-y-3">
        {copies.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCopyId(c.id)}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left",
              selectedCopyId === c.id
                ? "border-purple-300 bg-purple-50"
                : "border-gray-200",
            ].join(" ")}
          >
            <p className="font-bold">{c.title}</p>
            <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
              {c.body}
            </p>
          </button>
        ))}
      </div>

      {!isLoading && copies.length === 0 ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          광고 문구가 비어있습니다. (응답 스키마/서버 로직 확인 필요)
        </div>
      ) : null}
    </Card>
  );
}
