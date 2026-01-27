import { Link } from "react-router-dom";
import leftArrow from "@/assets/image/left-arrow.png";
import Container from "../common/Container";

export function CreateADHeader() {
  return (
    <header className="w-full border-b bg-white">
      <Container className="flex h-14 items-center justify-between text-xs">
        <Link
          to="/dashboard"
          className="flex w-24 items-center gap-2 font-semibold text-gray-600 hover:text-gray-800"
        >
          <img src={leftArrow} alt="뒤로" className="h-3 opacity-70" />
          대시보드로
        </Link>
        <h1 className="text-base font-bold text-gray-900">AI 광고 생성</h1>
        <Link
          to="/"
          className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600"
        >
          메인으로
        </Link>
      </Container>
    </header>
  );
}
