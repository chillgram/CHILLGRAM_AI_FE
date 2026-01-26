import { Link } from "react-router-dom";

export function CreateADHeader() {

  return (
    <>
      <header className="w-full bg-white">
        <div className="mr-auto ml-auto flex h-16 max-w-7xl px-6 items-center justify-center">
          <Link to={"./dashboard"}>대시보드로</Link>
          <div className="m-8 mr-220">
            <h1 className="text-2xl font-bold">AI 광고 생성</h1>
            <p className="text-sm text-gray-500 mt-1">Step 1 / 5 · 정보 입력</p>
          </div>
          <Link to={".."}>메인으로</Link>
        </div>
      </header>
    </>
  );
}
