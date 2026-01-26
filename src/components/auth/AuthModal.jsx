import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthModal({ open, onClose }) {
  const navigate = useNavigate();

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const goSignup = () => {
    onClose?.();
    navigate("/signup");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-5xl rounded-[48px] bg-white px-12 py-16 shadow-xl">
          <button
            type="button"
            aria-label="close"
            onClick={onClose}
            className="absolute right-10 top-10 text-5xl leading-none text-black"
          >
            ×
          </button>

          <LoginView onGoSignup={goSignup} />
        </div>
      </div>
    </div>
  );
}

function TitleBlock({ title }) {
  return (
    <div className="text-center">
      <h2 className="text-5xl font-extrabold text-[#3b312b]">{title}</h2>
      <p className="mt-4 text-lg text-[#3b312b]/70">AI 패키지 디자인 플랫폼</p>
    </div>
  );
}

function Field({ label, required, type = "text", value, onChange }) {
  return (
    <label className="block">
      <div className="mb-3 text-lg font-semibold text-black">
        {label} {required ? <span className="text-black">*</span> : null}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="h-16 w-full rounded-lg bg-[#E9FBE4] px-6 text-lg outline-none ring-0 focus:ring-2 focus:ring-[#66FF2A]"
      />
    </label>
  );
}

function PrimaryButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "mt-10 h-16 w-full rounded-lg text-2xl font-extrabold text-black",
        disabled
          ? "bg-gray-200 cursor-not-allowed"
          : "bg-[#66FF2A] hover:brightness-95",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LoginView({ onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const onLogin = () => {
    // TODO: 로그인 API 붙일 자리
    // 절대 password를 console.log로 찍지 마라.
  };

  return (
    <div className="mx-auto max-w-3xl">
      <TitleBlock title="로그인" />

      <div className="mt-12 space-y-10">
        <Field
          label="아이디 (이메일)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <PrimaryButton disabled={!canSubmit} onClick={onLogin}>
        로그인
      </PrimaryButton>

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
