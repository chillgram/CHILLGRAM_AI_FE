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
    // 401이면 인증 깨진 상태로 보고 store 정리(선택)
    if (res.status === 401) {
      useAuthStore.getState().logout();
      // UI에서 로그인 모달을 띄우는 로직이 따로 있으면 여기서 openAuthModal 호출도 가능
      // useAuthStore.getState().openAuthModal(location.pathname);
    }

    const msg = (data && (data.message || data.msg)) || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}
