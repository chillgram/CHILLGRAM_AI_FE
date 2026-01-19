import { useEffect, useState } from "react";

export function AuthModal({ open, onClose, defaultView = "login" }) {
  const [view, setView] = useState(defaultView); // "login" | "signup"

  // 모달 열릴 때 기본 화면 세팅
  useEffect(() => {
    if (open) setView(defaultView);
  }, [open, defaultView]);

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

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-5xl rounded-[48px] bg-white px-12 py-16 shadow-xl">
          {/* close */}
          <button
            type="button"
            aria-label="close"
            onClick={onClose}
            className="absolute right-10 top-10 text-5xl leading-none text-black"
          >
            ×
          </button>

          {/* content */}
          {view === "login" ? (
            <LoginView onSwitch={() => setView("signup")} />
          ) : (
            <SignupView onSwitch={() => setView("login")} />
          )}
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

function Field({ label, required, type = "text" }) {
  return (
    <label className="block">
      <div className="mb-3 text-lg font-semibold text-black">
        {label} {required ? <span className="text-black">*</span> : null}
      </div>
      <input
        type={type}
        className="h-16 w-full rounded-lg bg-[#E9FBE4] px-6 text-lg outline-none ring-0 focus:ring-2 focus:ring-[#66FF2A]"
      />
    </label>
  );
}

function PrimaryButton({ children }) {
  return (
    <button
      type="button"
      className="mt-10 h-16 w-full rounded-lg bg-[#66FF2A] text-2xl font-extrabold text-black hover:brightness-95"
    >
      {children}
    </button>
  );
}

function LoginView({ onSwitch }) {
  return (
    <div className="mx-auto max-w-3xl">
      <TitleBlock title="로그인" />

      <div className="mt-12 space-y-10">
        <Field label="아이디 (이메일)" />
        <Field label="비밀번호" type="password" />
      </div>

      <PrimaryButton>로그인</PrimaryButton>

      <div className="mt-10 text-center text-lg text-black/70">
        아직 계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-black underline underline-offset-4"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}

function SignupView({ onSwitch }) {
  return (
    <div className="mx-auto max-w-3xl">
      <TitleBlock title="회원가입" />

      <div className="mt-12 space-y-10">
        <Field label="이메일" required />
        <Field label="이름" required />
        <Field label="비밀번호" required type="password" />
        <Field label="비밀번호 확인" required type="password" />
      </div>

      <PrimaryButton>회원가입</PrimaryButton>

      <div className="mt-10 text-center text-lg text-black/70">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-black underline underline-offset-4"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
