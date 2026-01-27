import Card from "@/components/common/Card";
import { AD_GOAL_OPTIONS, PRODUCT_OPTIONS } from "@/data/createAdData";

export default function CreateADStep1Page({
  productId,
  adGoal,
  requestText,
  isUploadEnabled,
  uploadFileName,
  onChangeProductId,
  onChangeAdGoal,
  onChangeRequestText,
  onToggleUpload,
  onChangeUploadFile,
}) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-100 bg-white p-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">정보 입력</h2>
          <p className="mt-1 text-xs text-gray-500">제품 및 광고 목적 입력</p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-gray-800">제품 선택</label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
            value={productId}
            onChange={(event) => onChangeProductId(event.target.value)}
          >
            <option value="">제품을 선택하세요</option>
            {PRODUCT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-gray-800">광고 목적</label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
            value={adGoal}
            onChange={(event) => onChangeAdGoal(event.target.value)}
          >
            <option value="">광고 목적을 선택하세요</option>
            {AD_GOAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-gray-800">요청사항</label>
          <textarea
            className="min-h-[96px] w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
            placeholder="광고에 포함하고 싶은 내용을 입력하세요..."
            value={requestText}
            onChange={(event) => onChangeRequestText(event.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={isUploadEnabled}
            onChange={(event) => onToggleUpload(event.target.checked)}
          />
          도면 파일 업로드 (선택사항)
        </label>

        {isUploadEnabled && (
          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              제품 도면이나 디자인 시안을 업로드하면 더 정확한 광고를 생성할 수 있습니다.
            </p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-8 text-xs text-gray-500 hover:border-gray-300">
              <span className="text-xl">?</span>
              <span className="mt-2">클릭하여 파일 선택 (JPG, PNG, PDF)</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(event) => onChangeUploadFile(event.target.files?.[0]?.name ?? "")}
              />
            </label>
            {uploadFileName && (
              <p className="mt-2 text-xs text-gray-600">선택된 파일: {uploadFileName}</p>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
