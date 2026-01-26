import { Link } from "react-router-dom";

export function ConsentSection({ value, onChange }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-5 w-5 accent-[#66FF2A]"
        />
        <span className="text-base text-black">
          <span className="font-semibold">[필수]</span> 개인정보 수집·이용에 동의합니다.{" "}
          <Link
            to="/privacy"
            className="font-semibold underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            개인정보처리방침
          </Link>
          {" · "}
          <Link
            to="/privacy/consent"
            className="font-semibold underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            수집·이용 동의 내용
          </Link>
        </span>
      </label>
    </div>
  );
}
