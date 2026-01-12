export async function fetchHello() {
  const res = await fetch("/api/hello");
  if (!res.ok) throw new Error(`API 실패: ${res.status}`);
  return res.text();
}