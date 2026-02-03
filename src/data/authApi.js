const JSON_HEADERS = { "Content-Type": "application/json" };

async function parseError(res) {
  const text = await res.text();
  console.error(`[AuthApi] Error ${res.status}:`, text);
  try {
    const payload = JSON.parse(text);
    return payload?.message || payload?.error?.message || "요청에 실패했습니다.";
  } catch {
    return "요청에 실패했습니다. (서버 응답 파싱 불가)";
  }
}

export async function loginApi({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: JSON_HEADERS,
    credentials: "include", // refresh 쿠키 받기/보내기
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json(); // { accessToken, ... }
}

export async function refreshApi() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json(); // { accessToken }
}

export async function logoutApi() {
  // 서버가 refresh 쿠키 무효화/삭제 처리
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // 로그아웃은 실패해도 프론트는 상태를 비워야 하므로 에러를 굳이 throw 안 함
  return res.ok;
}
