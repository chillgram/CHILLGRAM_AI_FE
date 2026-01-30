import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { loginApi } from "../../data/authApi";

function SimpleField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-3 text-lg font-semibold text-black">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-16 w-full rounded-lg bg-[#E9FBE4] px-6 text-lg outline-none ring-0 focus:ring-2 focus:ring-[#66FF2A]"
      />
    </label>
  );
}

function SimpleButton({ disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "mt-10 h-16 w-full rounded-lg text-2xl font-extrabold text-black",
        disabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#66FF2A] hover:brightness-95",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function LoginView({ onGoSignup, onClose }) {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    !submitting && email.trim().length > 0 && password.trim().length > 0;

  const onLogin = async () => {
    setError("");
    setSubmitting(true);
    try {
      const data = await loginApi({ email, password });

      // accessToken을 전역 상태에 저장
      login(data.accessToken, data.user);

      onClose?.();
      navigate("/dashboard");
    } catch (e) {
      setError(e?.message || "로그인 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-[#3b312b]">로그인</h2>
        <p className="mt-4 text-lg text-[#3b312b]/70">AI 패키지 디자인 플랫폼</p>
      </div>

      <div className="mt-12 space-y-10">
        <SimpleField
          label="아이디 (이메일)"
          value={email}
          placeholder="test@test.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <SimpleField
          label="비밀번호"
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-lg text-red-700">
          {error}
        </div>
      ) : null}

      <SimpleButton disabled={!canSubmit} onClick={onLogin}>
        {submitting ? "로그인 중..." : "로그인"}
      </SimpleButton>

      <div className="mt-10 text-center text-lg text-black/70">
        아직 계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={onGoSignup}
          className="font-semibold text-black underline underline-offset-4"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}