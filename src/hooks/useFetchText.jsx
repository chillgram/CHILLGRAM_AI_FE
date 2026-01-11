import { useEffect, useState } from "react";

export function useFetchText(url, options) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          ...options,
        });

        if (!res.ok) throw new Error(`API 실패: ${res.status}`);

        const text = await res.text();
        if (!cancelled) setData(text);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "알 수 없는 에러");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
