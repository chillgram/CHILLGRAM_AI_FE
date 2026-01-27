import Card from "@/components/common/Card";
import { Sparkles } from "lucide-react";
import { GUIDE_OPTIONS } from "@/data/createAdData";

export default function CreateADStep3Page({ selectedGuide, onSelectGuide }) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-100 bg-white p-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">가이드 선택</h2>
          <p className="mt-1 text-xs text-gray-500">AI 생성 가이드 선택</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg bg-purple-50 p-4 text-purple-700">
          <Sparkles className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">AI 가이드 생성 완료</p>
            <p className="mt-1">선택한 트렌드를 바탕으로 맞춤형 광고 가이드를 생성했습니다.</p>
          </div>
        </div>

        <div className="space-y-3">
          {GUIDE_OPTIONS.map((guide) => (
            <button
              key={guide.title}
              type="button"
              onClick={() => onSelectGuide(guide.title)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                selectedGuide === guide.title
                  ? "border-purple-300 bg-purple-50"
                  : "border-gray-100"
              }`}
            >
              <p className="font-medium text-gray-900">{guide.title}</p>
              <p className="mt-1 text-xs text-gray-500">{guide.description}</p>
              <p className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
                {guide.example}
              </p>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}
