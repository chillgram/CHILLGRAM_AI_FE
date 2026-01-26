import { Link, useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#EAF7E6]">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[48px] bg-white px-12 py-16 shadow-xl">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-[#3b312b]">회원가입</h1>
            <p className="mt-4 text-lg text-[#3b312b]/70">AI 패키지 디자인 플랫폼</p>
          </div>

          <SignupForm onSuccess={() => navigate("/")} />

          <div className="mt-10 text-center text-lg text-black/70">
            이미 계정이 있으신가요?{" "}
            <Link to="/" className="font-semibold text-black underline underline-offset-4">
              로그인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
