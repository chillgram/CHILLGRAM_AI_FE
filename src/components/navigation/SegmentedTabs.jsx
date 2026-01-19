export default function SegmentedTabs({ value, items = [], onChange }) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-[#66FF2A] bg-white">
      {items.map((it) => {
        const active = value === it.value;

        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange?.(it.value)}
            aria-pressed={active}
            className={[
              "h-12 w-44 text-base font-bold",
              active ? "bg-[#66FF2A] text-black" : "bg-white text-[#66FF2A]",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
