import { Link } from "react-router-dom";
import leftArrow from "@/assets/image/left-arrow.png";
import Container from "../common/Container";

export function ADHeader() {
  return (
    <header className="w-full border-b bg-white">
      <Container className="flex h-16 items-center justify-between text-sm">
        <Link
          to="/dashboard"
          className="flex w-28 items-center gap-2 font-bold text-[#111827] hover:text-[#3b312b]"
        >
          <img src={leftArrow} alt="뒤로" className="h-3 opacity-70" />
          대시보드로
        </Link>
        <h1 className="text-xl font-black text-[#3b312b]">AI 광고 생성</h1>
        <Link
          to="/"
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#6B7280] hover:bg-gray-50"
        >
          메인으로
        </Link>
      </Container>
    </header>
  );
}
