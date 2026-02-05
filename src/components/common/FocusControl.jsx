/**
 * 필수:
 * - value: number
 * - onChange: (next:number) => void
 * - points: number[]  (예: [0,25,50,75,100] / 오름차순 권장)
 *
 * 선택:
 * - title: string
 * - helperText: string
 * - leftLabel / rightLabel: string (바 양끝 라벨)
 * - tickLabels: string[] (points 길이와 같으면 하단에 라벨 표시)
 * - className: string
 */
export default function FocusControl({
  value,
  onChange,
  points,
  title,
  helperText,
  leftLabel = "트렌드 중심",
  rightLabel = "제품 특징 중심",
  tickLabels, // optional string[]
  className = "",
}) {
  if (!Array.isArray(points) || points.length < 2) {
    throw new Error("FocusControl: points는 최소 2개 이상의 숫자 배열이어야 합니다.");
  }
  if (typeof value !== "number") {
    throw new Error("FocusControl: value는 number여야 합니다.");
  }
  if (typeof onChange !== "function") {
    throw new Error("FocusControl: onChange는 함수여야 합니다.");
  }

  const normalizedPoints = normalizePoints(points);
  const selected = nearest(normalizedPoints, value);

  const min = normalizedPoints[0];
  const max = normalizedPoints[normalizedPoints.length - 1];

  const percent = toPercent(selected, min, max);

  // 클릭한 위치를 value로 환산한 뒤 points로 스냅
  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const ratio = rect.width === 0 ? 0 : x / rect.width;
    const raw = min + (max - min) * ratio;
    const snapped = nearest(normalizedPoints, raw);
    onChange(snapped);
  };

  // 키보드 접근성(좌/우로 스냅 이동)
  const handleKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();

    const idx = normalizedPoints.indexOf(selected);
    if (idx < 0) return;

    if (e.key === "ArrowLeft" && idx > 0) onChange(normalizedPoints[idx - 1]);
    if (e.key === "ArrowRight" && idx < normalizedPoints.length - 1)
      onChange(normalizedPoints[idx + 1]);
  };

  return (
    <div className={className}>
      {title ? (
        <div className="mb-2 text-sm font-bold text-[#111827]">{title}</div>
      ) : null}
      {helperText ? (
        <p className="mb-3 text-sm text-[#9CA3AF]">{helperText}</p>
      ) : null}

      {/* 양 끝 라벨 */}
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {/* 트랙 */}
      <div className="relative">
        <button
          type="button"
          onClick={handleTrackClick}
          onKeyDown={handleKeyDown}
          aria-label={title ?? "focus control"}
          className={[
            "relative h-10 w-full overflow-hidden rounded-full border border-gray-200 bg-[#F9FAFB]",
            "focus:outline-none focus:ring-2 focus:ring-gray-300",
          ].join(" ")}
        >
          {/* 왼쪽(파랑) */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-100 rounded-l-full"
            style={{ width: `${percent}%` }}
          />

          {/* 오른쪽(빨강) */}
          <div
            className="absolute top-0 h-full bg-red-100 rounded-r-full"
            style={{ left: `${percent}%`, width: `${100 - percent}%` }}
          />

          {/* 눈금(ticks) */}
          {normalizedPoints.map((p) => {
            const pPercent = toPercent(p, min, max);
            const active = p <= selected;

            return (
              <span
                key={p}
                className={[
                  "absolute top-1/2 -translate-y-1/2",
                  "h-3 w-1 rounded-full",
                  active ? "bg-blue-500" : "bg-gray-300",
                ].join(" ")}
                style={{ left: `calc(${pPercent}% - 2px)` }} // tick 중앙 보정
              />
            );
          })}

          {/* 핸들(thumb) */}
          <span
            className={[
              "absolute top-1/2 -translate-y-1/2",
              "h-6 w-6 rounded-full border",
              "bg-white shadow-sm",
              "border-blue-500",
            ].join(" ")}
            style={{ left: `calc(${percent}% - 12px)` }} // thumb 중앙 보정
          />
        </button>
      </div>

      {/* 하단 라벨(옵션) */}
      {Array.isArray(tickLabels) && tickLabels.length === normalizedPoints.length ? (
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          {tickLabels.map((t, idx) => (
            <span key={`${t}-${idx}`} className="select-none">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function normalizePoints(points) {
  const arr = points
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));

  const uniq = Array.from(new Set(arr)).sort((a, b) => a - b);

  if (uniq.length < 2) {
    throw new Error("FocusControl: points는 유효한 숫자 2개 이상이어야 합니다.");
  }
  return uniq;
}

function nearest(points, value) {
  return points.reduce((acc, cur) => {
    if (Math.abs(cur - value) < Math.abs(acc - value)) return cur;
    return acc;
  }, points[0]);
}

function toPercent(v, min, max) {
  if (max === min) return 0;
  return ((v - min) / (max - min)) * 100;
}
