export async function fetchCompanies() {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("회사 목록을 불러오지 못했습니다.");
  const data = await res.json();

  // 기대 형태: [{ companyId, name }]
  return data;
}
