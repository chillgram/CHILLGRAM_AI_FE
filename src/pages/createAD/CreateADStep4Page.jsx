import Card from "@/components/common/Card";
import { Sparkles } from "lucide-react";
import { AD_COPY_OPTIONS } from "@/data/createAdData";

export default function CreateADStep4Page({ selectedCopy, onSelectCopy }) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-100 bg-white p-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">광고 문구 선택</h2>
          <p className="mt-1 text-xs text-gray-500">맞춤형 광고 문구 선택</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg bg-indigo-50 p-4 text-indigo-700">
          <Sparkles className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">AI 광고 문구 생성 완료</p>
            <p className="mt-1">선택한 가이드 "감성적 스토리텔링"에 맞춘 광고 문구를 추천합니다.</p>
          </div>
        </div>

        <div className="space-y-3">
          {AD_COPY_OPTIONS.map((copy) => (
            <button
              key={copy.title}
              type="button"
              onClick={() => onSelectCopy(copy.title)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                selectedCopy === copy.title
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-100"
              }`}
            >
              <p className="font-medium text-gray-900">{copy.title}</p>
              <p className="mt-2 text-xs text-gray-500">{copy.description}</p>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}
