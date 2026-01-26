import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/common/StepProgress";

export default function createADPage() {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");
  const [file, setFile] = useState(null);

  const isNextDisabled = !productId || !adGoal;

  const handleNext = () => {
    const payload = {
      productId,
      adGoal,
      requestText,
      file,
    };

    navigate("./step2");
  };

  return (
    <div className="max-w-300 ml-auto mr-auto py-10">
      <StepProgress currentStep={1} />

      {/* Card */}
      <div className="rounded-xl shadow-sm p-8">
        <h2 className="text-lg font-semibold mb-6">정보 입력</h2>

        {/* 제품 선택 */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            제품 선택 <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">제품을 선택하세요</option>
            <option value="1">제품 A</option>
            <option value="2">제품 B</option>
          </select>
        </div>

        {/* 광고 목적 */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            광고 목적 <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            value={adGoal}
            onChange={(e) => setAdGoal(e.target.value)}
          >
            <option value="">광고 목적을 선택하세요</option>
            <option value="brand">브랜드 인지도 향상</option>
            <option value="sales">제품 판매 촉진</option>
            <option value="event">이벤트 홍보</option>
          </select>
        </div>

        {/* 요청사항 */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">요청사항</label>
          <textarea
            className="w-full rounded-lg border px-4 py-2 min-h-25 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="광고에 포함되었으면 하는 내용을 입력하세요"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
          />
        </div>

        <hr className="m-5 mr-0 ml-0 bg-gray-400"/>
        {/* 파일 업로드 */}
        <div>
          <label className="inline-block text-sm font-medium mb-2">
            도면 파일 업로드 (선택)
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="inline-block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-gray-100 file:text-gray-700
              hover:file:bg-gray-200"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          이전
        </button>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`px-6 py-2 rounded-lg font-medium
            ${
              isNextDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-black"
            }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
