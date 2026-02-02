import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductDetailStore } from "@/stores/productDetailStore";
import { useProductImageQuery } from "@/services/queries/useProductImageQuery";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [helloLoading, setHelloLoading] = useState(false);
  const [helloResult, setHelloResult] = useState(null);
  const [helloError, setHelloError] = useState(null);

  const actions = useMemo(
    () => [
      { label: "HELLO 테스트", type: "hello" },
      { label: "패키지 디자인", type: "base" },
      { label: "광고 영상", type: "video" },
      { label: "포스터", type: "poster" },
      { label: "목업", type: "mockup" },
      { label: "배너", type: "banner" },
    ],
    [],
  );

  const selectedType = useProductDetailStore((s) => s.selectedType);
  const setSelectedType = useProductDetailStore((s) => s.setSelectedType);

  // hello 호출 일때는 img 쿼리 안 타게
  const isHelloMode = selectedType === "hello";

  const { objectUrl, isLoading, isError, error, refetch } =
    useProductImageQuery({
      productId,
      type: selectedType,
      enabled: !isHelloMode,
    });

  const runHello = async () => {
    setHelloLoading(true);
    setHelloError(null);
    try {
      const res = await fetch("/api/products/hello");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHelloResult(data);
    } catch (e) {
      setHelloError(e);
      setHelloResult(null);
    } finally {
      setHelloLoading(false);
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl bg-[#FBF4EA] p-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#3b312b]">
                  자연주의 스킨케어 패키지
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  상품 · ID: {productId}
                </p>
              </div>
              <span className="rounded-full bg-[#E8F5EE] px-4 py-2 text-sm font-bold text-[#2E7D32]">
                진행 중
              </span>
            </div>

            {/* 5개 버튼 */}
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((a) => {
                const active = selectedType === a.type;
                return (
                  <button
                    key={a.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(a.type);

                      // ✅ hello 버튼 누르면 바로 호출
                      if (a.type === "hello") runHello();
                    }}
                    className={[
                      "h-11 rounded-lg px-5 text-sm font-extrabold",
                      active
                        ? "bg-[#66FF2A] text-black"
                        : "bg-white text-[#3b312b] ring-1 ring-gray-200",
                    ].join(" ")}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-sm font-bold text-[#3b312b]">
                  선택: {selectedType}
                </div>

                {/* 이미지 모드일 때만 다시 시도 */}
                {!isHelloMode && isError && (
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-sm font-bold text-red-600"
                  >
                    다시 시도
                  </button>
                )}

                {/* hello 모드일 때 다시 호출 */}
                {isHelloMode && (
                  <button
                    type="button"
                    onClick={runHello}
                    className="text-sm font-bold text-[#3b312b] underline"
                  >
                    hello 다시 호출
                  </button>
                )}
              </div>

              <div className="flex h-105 items-center justify-center">
                <ErrorBoundary>
                  {/* ✅ HELLO 모드 UI */}
                  {isHelloMode ? (
                    <div className="w-full px-6">
                      {helloLoading && (
                        <div className="text-sm text-gray-600">
                          hello 호출 중...
                        </div>
                      )}

                      {helloError && (
                        <div className="text-sm text-red-600">
                          hello 실패: {helloError.message}
                        </div>
                      )}

                      {!helloLoading && !helloError && helloResult && (
                        <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm">
                          {JSON.stringify(helloResult, null, 2)}
                        </pre>
                      )}

                      {!helloLoading && !helloError && !helloResult && (
                        <div className="text-sm text-gray-600">결과 없음</div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* 기존 이미지 로딩 UI */}
                      {isLoading && (
                        <div className="text-sm text-gray-600">
                          불러오는 중...
                        </div>
                      )}

                      {isError && (
                        <div className="text-sm text-red-600">
                          이미지 로드 실패: {error?.message}
                        </div>
                      )}

                      {!isLoading && !isError && objectUrl && (
                        <img
                          src={objectUrl}
                          alt={selectedType}
                          className="h-full w-full object-contain"
                        />
                      )}
                    </>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
