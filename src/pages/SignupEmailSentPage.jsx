import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import emailImage from "@/assets/image/email.png";

export default function SignupEmailSentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message ?? "인증 메일을 보내드렸어요.";
  const email = location.state?.email ?? "";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#EAF7E6]">
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
        <div className="w-full rounded-[32px] bg-white px-10 py-12 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#111827]">{message}</h1>

          <img
            src={emailImage}
            alt="인증 메일"
            className="mx-auto mt-6 h-48 w-48 object-contain"
          />

          <p className="mt-6 text-sm text-[#6B7280]">
            메일함을 확인해 주세요.
            <br />
            가입하신 이메일을 인증해 주시면
            <br />
            CHILL GRAM 서비스를 바로 이용할 수 있어요.
          </p>

          {email && (
            <p className="mt-4 text-sm font-semibold text-[#111827]">
              인증 메일: {email}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 w-full rounded-xl bg-[#5BF22F] px-6 py-3 text-sm font-black text-black hover:brightness-95"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </section>
    </main>
  );
}
