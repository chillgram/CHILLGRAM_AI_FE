import { apiFetch } from "@/lib/apiFetch";

/**
 * 제품 목록 조회
 * GET /api/products
 */
export async function fetchProducts({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams({ page, size });
  const res = await apiFetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("제품 목록을 불러오지 못했습니다.");
  return res.json();
}

/**
 * 제품 상세 조회
 * GET /api/products/{id}
 */
export async function fetchProduct(id) {
  const res = await apiFetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("제품 정보를 불러오지 못했습니다.");
  return res.json();
}

/**
 * 제품 등록
 * POST /api/products
 * Payload: { name, category, description, isActive }
 */
export async function createProduct(payload) {
  // JSON 방식으로 전송 (400 에러 해결 시도)
  const bodyData = {
    name: payload.name,
    category: payload.category,
    description: payload.description || payload.desc || "",
    isActive: payload.isActive,
  };
  // reviewUrl이 있을 때만 포함 (snake_case + camelCase 호환)
  if (payload.reviewUrl && payload.reviewUrl.trim() !== "") {
    bodyData.review_url = payload.reviewUrl.trim();
    bodyData.reviewUrl = payload.reviewUrl.trim();
  }

  const res = await apiFetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) throw new Error("제품 등록에 실패했습니다.");
  return res.json();
}

/**
 * 제품 수정
 * PUT /api/products/{id}
 */
export async function updateProduct(id, payload) {
  const bodyData = {
    name: payload.name,
    category: payload.category,
    description: payload.description || payload.desc || "",
    name: payload.name,
    category: payload.category,
    description: payload.description || payload.desc || "",
    isActive: payload.isActive,
  };
  // reviewUrl이 있을 때만 포함 (snake_case + camelCase 호환)
  if (payload.reviewUrl && payload.reviewUrl.trim() !== "") {
    bodyData.review_url = payload.reviewUrl.trim();
    bodyData.reviewUrl = payload.reviewUrl.trim();
  }

  const res = await apiFetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) throw new Error("제품 수정에 실패했습니다.");
  return res.json();
}

/**
 * 제품 삭제 (Aggressive Soft Delete)
 * PUT /api/products/{id}
 * Payload: 모든 주요 필드를 "0"으로 설정
 */
export async function deleteProduct(id) {
  const bodyData = {
    name: "0",
    category: "0",
    description: "0",
    isActive: false,
    status: 0,
  };

  const res = await apiFetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) throw new Error("제품 삭제에 실패했습니다.");
  return res;
}

/**
 * 제품 통계 조회
 * GET /api/products/stats
 */
export async function fetchProductStats() {
  const res = await apiFetch("/api/products/stats");
  if (!res.ok) throw new Error("제품 통계를 불러오지 못했습니다.");
  return res.json();
}
