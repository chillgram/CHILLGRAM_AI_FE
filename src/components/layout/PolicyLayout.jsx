import { useEffect, useMemo, useRef, useState } from "react";

function slugify(id) {
  return String(id).replace(/\s+/g, "-").toLowerCase();
}

/**
 * PolicyLayout
 * - 좌측(모바일: 상단) 목차 + 우측 본문
 * - IntersectionObserver로 현재 섹션(active) 자동 하이라이트
 */
export default function PolicyLayout({ title, updatedAt, sections }) {
  const [activeId, setActiveId] = useState(sections?.[0]?.id ?? "");
  const headingRefs = useRef(new Map());

  const normalizedSections = useMemo(() => {
    return (sections ?? []).map((s) => ({
      ...s,
      id: slugify(s.id),
    }));
  }, [sections]);

  useEffect(() => {
    // refs 초기화
    headingRefs.current = new Map();
  }, [normalizedSections]);

  useEffect(() => {
    if (!normalizedSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));

        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      }
    );

    normalizedSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [normalizedSections]);

  const onClickToc = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="border-b pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
          {updatedAt && (
            <p className="mt-2 text-sm text-gray-600">
              시행일자/최종 업데이트: <span className="font-medium">{updatedAt}</span>
            </p>
          )}
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-auto">
            <div className="rounded-xl border bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-900">목차</p>
              <ul className="mt-3 space-y-1">
                {normalizedSections.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => onClickToc(s.id)}
                        className={[
                          "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-200",
                        ].join(" ")}
                      >
                        {s.toc}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* CONTENT */}
          <article className="prose prose-gray max-w-none">
            {normalizedSections.map((s) => (
              <section key={s.id} className="scroll-mt-24">
                <h2
                  id={s.id}
                  ref={(el) => {
                    if (el) headingRefs.current.set(s.id, el);
                  }}
                  className="mt-10 text-2xl font-bold tracking-tight text-gray-900"
                >
                  {s.heading}
                </h2>

                {typeof s.body === "function" ? s.body() : s.body}
              </section>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
