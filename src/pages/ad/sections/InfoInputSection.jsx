import { Sparkles } from "lucide-react";
import Card from "@/components/common/Card";
import { SelectField } from "@/components/common/SelectField";
import { TextAreaField } from "@/components/common/TextAreaField";
import FocusControl from "@/components/common/FocusControl";
import { AD_GOAL_OPTIONS } from "@/data/ads";
import { useAdTrends } from "@/hooks/useAdTrends";

export default function InfoInputSection({
  productId,
  baseDate, // optional
  projectTitle,
  setProjectTitle,
  adGoal,
  setAdGoal,
  requestText,
  setRequestText,
  selectedKeywords,
  setSelectedKeywords,
  adFocus,
  setAdFocus,
}) {
  const { data, isLoading, isError, error, refetch } = useAdTrends({
    productId,
    date: baseDate,
  });

  // 서버 응답: AdTrendsResponse
  const trendKeywords = data?.trendKeywords ?? [];
  const hashtags = data?.hashtags ?? [];
  const styleSummary = data?.styleSummary ?? "";

  const baseDateText = data?.baseDate != null ? String(data.baseDate) : baseDate != null ? String(baseDate) : "";
  console.log("productId", productId, "enabled", Boolean(productId), "baseDate", baseDate);

  const TITLE_MAX = 200;
  
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* LEFT */}
      <Card className="lg:col-span-7 rounded-2xl border border-gray-200 shadow-sm p-10">
        <div className="mb-6">
          <h2 className="text-xl font-black text-[#3b312b]">광고 설정</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            광고 컨텍스트를 설정하세요
          </p>
        </div>

        <div className="space-y-5">
          {/* 프로젝트 이름 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              프로젝트 이름 <span className="text-red-500">*</span>
            </label>
            <input
              value={projectTitle ?? ""}
              onChange={(e) => setProjectTitle(e.target.value)}
              maxLength={TITLE_MAX}
              placeholder="예: 2월 발렌타인데이 프로모션 광고"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>프로젝트를 식별할 이름을 입력하세요.</span>
              <span>
                {(projectTitle?.length ?? 0)}/{TITLE_MAX}
              </span>
            </div>
          </div>

          <SelectField
            label="메시지 목표"
            value={adGoal}
            onChange={setAdGoal}
            options={AD_GOAL_OPTIONS}
            placeholder="목표를 선택하세요"
            variant="neutral"
          />

          <FocusControl
            value={adFocus}
            onChange={setAdFocus}
            points={[0, 25, 50, 75, 100]}
            title="광고 메시지 초점"
            helperText="트렌드 vs 제품 특징 중 무엇을 더 강조할지 선택하세요."
            leftLabel="트렌드"
            rightLabel="제품 특징"
            tickLabels={["매우", "강", "균형", "강", "매우"]}
          />

          <TextAreaField
            label="요청사항"
            value={requestText}
            onChange={setRequestText}
            placeholder="광고에 포함하고 싶은 내용을 입력하세요..."
            minHeight={160}
            variant="neutral"
          />
        </div>
      </Card>

      {/* RIGHT - 스샷 스타일 */}
      <Card className="lg:col-span-5 rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-black text-[#111827]">
          AI 이벤트 트렌드 분석
        </h2>

        <p className="mt-1 text-sm text-[#9CA3AF]">
          {baseDateText ? `기준일 ${baseDateText}` : "현재 시즌을 기준으로 추천합니다."}
        </p>

        {/* 파란 요약 박스 */}
        <div className="mt-4 rounded-2xl bg-blue-50 px-5 py-4 text-blue-700">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-base font-extrabold leading-6">
                {isLoading
                  ? "시즌 이벤트 기반 광고 키워드 분석 중"
                  : isError
                    ? "시즌 이벤트 기반 광고 키워드 분석 실패"
                    : "시즌 이벤트 기반 광고 키워드 분석 완료"}
              </p>

              <p className="mt-1 text-sm leading-5 text-blue-700/80">
                {isLoading
                  ? "잠시만 기다려주세요."
                  : isError
                    ? error?.message || "네트워크/서버 상태를 확인하세요."
                    : "추천 키워드를 선택해 광고에 반영하세요."}
              </p>

              {isError ? (
                <button
                  type="button"
                  onClick={refetch}
                  className="mt-3 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  다시 시도
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* 키워드 */}
        <h3 className="mt-8 text-base font-extrabold text-[#111827]">
          추천 트렌드 키워드 (복수 선택 가능)
        </h3>

        <div className="mt-3 space-y-3">
          {!isLoading && trendKeywords.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">
              추천 키워드가 없습니다.
            </div>
          ) : null}

          {trendKeywords.map((k) => {
            const checked = selectedKeywords.includes(k.name);

            return (
              <label
                key={k.name}
                className={[
                  "flex items-start gap-3 rounded-2xl border px-4 py-3",
                  checked
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-blue-600"
                  checked={checked}
                  onChange={() =>
                    setSelectedKeywords((prev) =>
                      prev.includes(k.name)
                        ? prev.filter((x) => x !== k.name)
                        : [...prev, k.name]
                    )
                  }
                  disabled={isLoading || isError}
                />

                <div className="min-w-0">
                  <p
                    className={[
                      "text-base font-extrabold leading-6",
                      checked ? "text-blue-700" : "text-[#111827]",
                    ].join(" ")}
                  >
                    {k.name}
                  </p>
                  <p
                    className={[
                      "mt-0.5 text-sm leading-5",
                      checked ? "text-blue-700/80" : "text-gray-500",
                    ].join(" ")}
                  >
                    {k.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* 해시태그 */}
        <h3 className="mt-8 text-base font-extrabold text-[#111827]">
          추천 해시태그
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {hashtags.length === 0 && !isLoading ? (
            <span className="text-sm text-gray-400">없음</span>
          ) : null}

          {hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 스타일 요약 */}
        <div className="mt-8 rounded-2xl bg-[#F3F4F6] px-5 py-4">
          <p className="text-sm font-extrabold text-gray-600">
            인기 &amp; 스타일
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isLoading ? "불러오는 중..." : styleSummary || "요약 정보가 없습니다."}
          </p>
        </div>
      </Card>
    </section>
  );
}
