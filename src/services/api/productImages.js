export async function fetchProductImageBlob({ productId, type }) {
  const base = import.meta.env.VITE_API_BASE_URL ?? ""; // 예: http://localhost:8080
  const res = await fetch(`${base}/api/products/${productId}/images/${type}`, {
    method: "GET",
    // credentials 필요하면 주석 해제
    // credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`이미지 요청 실패: ${res.status}`);
  }

  // Spring이 image/png, image/jpeg로 내려줘야 함
  return await res.blob();
}
