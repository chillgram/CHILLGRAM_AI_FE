export function getApiBaseUrl() {
  // Vite 환경변수: VITE_API_BASE_URL
  // 개발에서 proxy 쓰면 비워도 가능
  return import.meta.env.VITE_API_BASE_URL ?? "";
}