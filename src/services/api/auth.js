export async function signup(payload) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "회원가입에 실패했습니다.";
    try {
      const err = await res.json();
      msg = err?.message ?? err?.error?.message ?? msg;
    } catch {
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const msg = payload?.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
    throw new Error(msg);
  }

  return res.json(); // { accessToken }
}