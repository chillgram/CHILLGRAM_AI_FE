import { Link } from "react-router-dom";
import leftArrow from "@/assets/image/left-arrow.png"
import Container from "../common/Container";

export function CreateADHeader() {
  return (
    <>
      <header className="w-full bg-white border-b grayscale-25">
        <Container className="flex h-14 items-center justify-between text-xs">
          <Link
            to={"./dashboard"}
            className="w-20 flex items-center gap-2 font-bold text-gray-600 hover:text-gray-800"
          >
            <img src={leftArrow} className="h-3 opacity-30"></img>대시보드
          </Link>
          <div className="mr-200">
            <h1 className="font-bold text-xl">AI 광고 생성</h1>
          </div>
          <Link
            to={".."}
            className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600"
          >
            메인
          </Link>
        </Container>
      </header>
    </>
  );
}
