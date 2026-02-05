import { Lightbulb, Image, Sparkles } from "lucide-react";
import Card from "@/components/common/Card";

export default function ContentGenerationSection({
  contentTypes,
  tip,
  selectedTypes,
  setSelectedTypes,
}) {
  return (
    <Card className="p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#3b312b]">콘텐츠 생성</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">최종 광고 콘텐츠 생성</p>
      </div>

      <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4 text-green-700">
        <Sparkles className="mt-0.5 h-5 w-5" />
        <div>
          <p className="font-semibold">광고 콘텐츠 생성 준비 완료</p>
          <p className="mt-1 text-sm">선택한 옵션으로 광고를 생성합니다.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-3 rounded-lg border border-blue-400 bg-sky-50 p-4 text-blue-400">
        <Image className="mt-0.5 h-5 w-5" />
        <div>
          <p className="font-semibold">제품 이미지 AI</p>
          <p className="mt-1 text-sm">제품 사진을 AI로 생성 준비 완료!</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg font-bold text-[#3b312b]">
          생성할 콘텐츠 타입 선택 (복수 선택 가능)
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const selected = selectedTypes.includes(type.title);

          return (
            <button
              key={type.title}
              onClick={() =>
                setSelectedTypes((prev) =>
                  prev.includes(type.title)
                    ? prev.filter((t) => t !== type.title)
                    : [...prev, type.title]
                )
              }
              className={[
                "rounded-xl border px-4 py-3 text-left",
                selected ? "border-green-300 bg-green-50" : "border-gray-200",
              ].join(" ")}
            >
              <Icon className="mb-2 h-5 w-5" />
              <p className="font-bold">{type.title}</p>
              <p className="text-xs text-gray-500">{type.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
        <Lightbulb className="mt-0.5 h-4 w-4" />
        <span>{tip}</span>
      </div>
    </Card>
  );
}
