// 역할: fetch 공통 래퍼
// - Authorization(Bearer) 자동 주입
// - JSON 요청/응답 기본 처리
// - 401 발생 시 스토어 상태 초기화(선택) + 에러 throw

import { useAuthStore } from "@/stores/authStore";

function buildHeaders(extraHeaders) {
  const headers = {
    Accept: "application/json",
    ...extraHeaders,
  };

  const token = useAuthStore.getState().accessToken;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

export async function httpJson(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: buildHeaders({
      "Content-Type": "application/json",
      ...headers,
    }),
    body: body != null ? JSON.stringify(body) : undefined,
  });

  // 204 No Content 같은 케이스 안전 처리
  const data = await res.json().catch(() => null);

  
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.code = data?.code;
    err.details = data?.details;
    throw err;
  }

  return data;
}
