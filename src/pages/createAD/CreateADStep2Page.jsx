import Card from "@/components/common/Card";
import { Sparkles } from "lucide-react";
import {
  TREND_HASHTAGS,
  TREND_KEYWORDS,
  TREND_STYLE_SUMMARY,
  TREND_SUMMARY,
} from "@/data/createAdData";

export default function CreateADStep2Page({
  selectedKeywords,
  onToggleKeyword,
}) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-black text-[#3b312b]">트렌드 분석</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">AI 트렌드 분석 결과</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg bg-blue-50 p-4 text-blue-700">
          <Sparkles className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">AI 트렌드 분석 완료</p>
            <p className="mt-1">{TREND_SUMMARY}</p>
          </div>
        </div>

        <p className="mb-3 text-sm font-bold text-[#111827]">
          추천 트렌드 키워드 (복수 선택 가능)
        </p>
        <div className="mb-6 space-y-2">
          {TREND_KEYWORDS.map((keyword) => (
            <label
              key={keyword.title}
              className="flex items-start gap-3 rounded-xl border border-gray-200 px-4 py-3"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                checked={selectedKeywords.includes(keyword.title)}
                onChange={() => onToggleKeyword(keyword.title)}
              />
              <div>
                <p className="font-bold text-[#111827]">{keyword.title}</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">
                  {keyword.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        <p className="mb-2 text-sm font-bold text-[#111827]">추천 해시태그</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {TREND_HASHTAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-[#6B7280]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="rounded-xl bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
          인기 &amp; 스타일
          <br />
          <span className="text-[#9CA3AF]">{TREND_STYLE_SUMMARY}</span>
        </div>
      </Card>
    </section>
  );
}
