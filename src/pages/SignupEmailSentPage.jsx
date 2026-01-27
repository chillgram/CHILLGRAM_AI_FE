import { useLocation, useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/components/common/PrimaryButton";

export default function SignupEmailSentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message ?? "인증 메일을 보내드렸어요.";

  return (
    <section className="min-h-[calc(100vh-80px)] w-full bg-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-[#1f2937]">{message}</h1>

        <div className="mt-10">
          {/* 이미지: 너가 가진 에셋으로 교체 */}
          <img
            src="/images/mail-sent.png"
            alt="메일 전송"
            className="mx-auto h-40 w-40"
          />
        </div>

        <p className="mt-10 text-lg text-gray-700">
          메일함을 확인해 주세요.
          <br />
          가입하신 이메일을 인증해 주시면,
          <br />
          서비스를 마음껏 이용하실 수 있어요.
        </p>

        <div className="mt-12 w-full max-w-sm">
          <PrimaryButton type="button" onClick={() => navigate(-1)}>
            이전 페이지로 돌아가기
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
