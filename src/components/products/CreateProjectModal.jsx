export default function CreateProjectModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      name: fd.get("name")?.toString().trim(),
      category: fd.get("category")?.toString().trim(),
      purpose: fd.get("purpose")?.toString().trim(),
    };

    onSubmit?.(payload);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 오버레이 */}
      <button
        type="button"
        aria-label="close overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* 모달 박스 */}
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center px-6">
        <div className="w-full rounded-[64px] bg-white px-16 py-20 shadow-2xl">
          <h2 className="text-center text-4xl font-extrabold text-[#3b312b]">
            새 프로젝트 생성
          </h2>

          <form onSubmit={handleSubmit} className="mt-14 space-y-8">
            <div>
              <label className="block text-sm font-bold text-[#3b312b]">
                프로젝트명
              </label>
              <input
                name="name"
                type="text"
                className="mt-3 h-14 w-full rounded-lg bg-[#E9FFD9] px-5 text-base outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-[#66FF2A]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3b312b]">
                카테고리
              </label>
              <input
                name="category"
                type="text"
                className="mt-3 h-14 w-full rounded-lg bg-[#E9FFD9] px-5 text-base outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-[#66FF2A]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3b312b]">
                프로젝트 목적
              </label>
              <input
                name="purpose"
                type="text"
                className="mt-3 h-14 w-full rounded-lg bg-[#E9FFD9] px-5 text-base outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-[#66FF2A]"
              />
            </div>

            <div className="mt-16 flex items-center justify-between gap-10">
              <button
                type="button"
                onClick={onClose}
                className="h-14 w-full max-w-sm rounded-lg bg-[#D9D9D9] text-lg font-extrabold text-[#6b6b6b] hover:brightness-95"
              >
                취소
              </button>

              <button
                type="submit"
                className="h-14 w-full max-w-sm rounded-lg bg-[#66FF2A] text-lg font-extrabold text-black hover:brightness-95"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
