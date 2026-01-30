import { useAuthStore } from "@/stores/authStore";
import { refreshApi } from "@/data/authApi";

// 동시에 여러 요청이 401 맞으면 refresh 1번만 하도록 잠금
let refreshingPromise = null;

async function refreshAccessTokenOnce() {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const { accessToken } = await refreshApi();
      useAuthStore.getState().login(accessToken);
      return accessToken;
    })().finally(() => {
      refreshingPromise = null;
    });
  }
  return refreshingPromise;
}

/**
 * 인증이 필요한 요청은 apiFetch 사용.
 * - accessToken을 Authorization 헤더로 자동 주입
 * - 401이면 refresh -> 한 번 재시도
 */
export async function apiFetch(url, options = {}) {
  const { accessToken, logout } = useAuthStore.getState();

  const headers = new Headers(options.headers || {});
  // FormData는 Content-Type을 브라우저가 자동 설정해야 함
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status !== 401) return res;

  // access 만료 -> refresh 시도
  try {
    const newToken = await refreshAccessTokenOnce();

    const retryHeaders = new Headers(options.headers || {});
    // FormData는 Content-Type을 브라우저가 자동 설정해야 함
    if (!retryHeaders.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
      retryHeaders.set("Content-Type", "application/json");
    }
    retryHeaders.set("Authorization", `Bearer ${newToken}`);

    const retryRes = await fetch(url, {
      ...options,
      headers: retryHeaders,
      credentials: "include",
    });

    if (retryRes.status === 401) {
      logout();
    }
    return retryRes;
  } catch {
    logout();
    return res;
  }
}
