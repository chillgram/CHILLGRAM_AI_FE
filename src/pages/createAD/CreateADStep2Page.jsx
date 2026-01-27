import Card from "@/components/common/Card";
import { Sparkles } from "lucide-react";
import {
  TREND_HASHTAGS,
  TREND_KEYWORDS,
  TREND_STYLE_SUMMARY,
  TREND_SUMMARY,
} from "@/data/createAdData";

export default function CreateADStep2Page({ selectedKeywords, onToggleKeyword }) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-100 bg-white p-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">트렌드 분석</h2>
          <p className="mt-1 text-xs text-gray-500">AI 트렌드 분석 결과</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg bg-blue-50 p-4 text-blue-700">
          <Sparkles className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">AI 트렌드 분석 완료</p>
            <p className="mt-1">{TREND_SUMMARY}</p>
          </div>
        </div>

        <p className="mb-3 font-semibold">추천 트렌드 키워드 (복수 선택 가능)</p>
        <div className="mb-6 space-y-2">
          {TREND_KEYWORDS.map((keyword) => (
            <label
              key={keyword.title}
              className="flex items-start gap-3 rounded-lg border border-gray-100 px-4 py-3"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                checked={selectedKeywords.includes(keyword.title)}
                onChange={() => onToggleKeyword(keyword.title)}
              />
              <div>
                <p className="font-medium text-gray-900">{keyword.title}</p>
                <p className="mt-1 text-xs text-gray-500">{keyword.description}</p>
              </div>
            </label>
          ))}
        </div>

        <p className="mb-2 font-semibold">추천 해시태그</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {TREND_HASHTAGS.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
          인기 &amp; 스타일<br />
          <span className="text-gray-500">{TREND_STYLE_SUMMARY}</span>
        </div>
      </Card>
    </section>
  );
}
