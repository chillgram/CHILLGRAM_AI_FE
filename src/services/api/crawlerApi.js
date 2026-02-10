import { apiFetch } from "@/lib/apiFetch";

/**
 * URL 등록 + 비동기 처리 시작
 * POST /register
 * Payload: { coupang_url: string, max_reviews: number }
 */
export async function registerProduct(payload) {
  const res = await apiFetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("제품 등록 및 크롤링 시작 실패");
  return res.json();
}

/**
 * 처리 상태 확인
 * GET /status/{product_id}
 */
export async function getProductStatus(productId) {
  const res = await apiFetch(`/api/status/${productId}`);
  if (!res.ok) throw new Error("상태 확인 실패");
  return res.json();
}

/**
 * 분석 결과 PDF 리턴
 * POST /analyze
 * Payload: { product_id: string }
 * Response: application/pdf (blob) or JSON
 */
export async function analyzeProduct(productId) {
  const res = await apiFetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id: productId }),
  });
  
  if (!res.ok) throw new Error("분석 리포트 생성 실패");
  
  // Content-Type 확인 -> PDF면 blob, 아니면 json
  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/pdf")) {
    return res.blob();
  }
  return res.json();
}

/**
 * 기존 호환 크롤링 (동기 방식 추정)
 * POST /crawl
 * Payload: { product_id: string, max_reviews: number }
 */
export async function crawlProduct(payload) {
  const res = await apiFetch("/api/crawl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("크롤링 실패");
  return res.json();
}
