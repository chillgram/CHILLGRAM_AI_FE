import { useEffect, useState } from "react";

export default function HomePage() {
  const [message, setMessage] = useState("로딩 중...");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);

        const res = await fetch("/api/users/hello", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`API 실패: ${res.status}`);
        }

        const text = await res.text();
        setMessage(text);
      } catch (e) {
        setError(e?.message ?? "알 수 없는 에러");
        setMessage("");
      }
    })();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">메인 페이지</h1>

      <div className="mt-6 rounded-xl border p-4">
        {error ? (
          <div className="mt-2 text-red-600">{error}</div>
        ) : (
          <div className="mt-2 text-xl font-semibold">{message}</div>
        )}
      </div>
    </main>
  );
}
