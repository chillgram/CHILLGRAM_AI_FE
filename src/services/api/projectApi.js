import { apiFetch } from "@/lib/apiFetch";

/**
 * 특정 제품의 프로젝트 목록 조회
 * GET /api/products/{id}/projects
 */
export async function fetchProjectsByProduct(productId) {
  const res = await apiFetch(`/api/products/${productId}/projects`);
  if (!res.ok) throw new Error("프로젝트 목록을 불러오지 못했습니다.");
  return res.json();
}

/**
 * 프로젝트 생성
 * POST /api/products/{id}/projects
 */
export async function createProject(productId, payload) {
  const res = await apiFetch(`/api/projects?productId=${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("프로젝트 생성에 실패했습니다.");
  return res.json();
}

/**
 * 프로젝트 콘텐츠 조회 (생성된 이미지 등)
 * GET /api/projects/{projectId}/contents
 */
export async function fetchProjectContents(projectId) {
  const res = await apiFetch(`/api/projects/${projectId}/contents`);
  if (!res.ok) throw new Error("프로젝트 콘텐츠를 불러오지 못했습니다.");
  return res.json();
}
