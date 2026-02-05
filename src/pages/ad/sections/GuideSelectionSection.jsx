import { Sparkles } from "lucide-react";
import Card from "@/components/common/Card";

export default function GuideSelectionSection({
  guides,
  recommendedGuideId,
  selectedGuideId,
  setSelectedGuideId,
  isLoading,
}) {
  return (
    <Card className="p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#3b312b]">가이드 선택</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">AI 생성 가이드 선택</p>
      </div>

      <div className="mb-6 flex gap-3 rounded-lg bg-purple-50 p-4 text-purple-700">
        <Sparkles className="mt-0.5 h-5 w-5" />
        <div>
          <p className="font-semibold">
            {isLoading ? "AI 가이드 생성 중..." : "AI 가이드 생성 완료"}
          </p>
          <p className="mt-1 text-sm">
            추천: <span className="font-semibold">{recommendedGuideId || "-"}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {guides.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelectedGuideId(g.id)}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left",
              selectedGuideId === g.id
                ? "border-purple-300 bg-purple-50"
                : "border-gray-200",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <p className="font-bold">{g.title}</p>
              {g.badge ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {g.badge}
                </span>
              ) : null}
              {typeof g.score === "number" ? (
                <span className="text-xs text-gray-500">{g.score}점</span>
              ) : null}
            </div>

            <p className="mt-1 text-sm text-gray-600">{g.summary}</p>

            {g.rationale ? (
              <p className="mt-2 text-xs text-gray-500">{g.rationale}</p>
            ) : null}
          </button>
        ))}
      </div>
    </Card>
  );
}
