import { apiFetch } from "@/lib/apiFetch";
import { httpForm, httpJson } from "./http";

/**
 * 특정 제품의 프로젝트 목록 조회
 * GET /api/products/{id}/projects
 */
export async function fetchProjectsByProduct(productId) {
  const res = await httpJson(`/api/products/${productId}/projects`, {
    method: "GET",
  });
  console.log("fetchProjectsByProduct", res);
  // httpJson throws on error
  return res;
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

/**
 * 프로젝트 상세 조회
 * GET /api/projects/{projectId}
 */
export async function fetchProject(projectId) {
  const res = await apiFetch(`/api/projects/${projectId}`);
  if (!res.ok) throw new Error("프로젝트 정보를 불러오지 못했습니다.");
  return res.json();
}

/**
 * 제품의 베이스 이미지 목록 조회 (SNS, BANNER, VIDEO 등)
 * GET /api/products/{productId}/base-images
 */
export async function fetchProductBaseImages(productId) {
  const res = await apiFetch(`/api/products/${productId}/base-images`);
  if (!res.ok) throw new Error("베이스 이미지 목록을 불러오지 못했습니다.");
  return res.json();
}

/**
 * 패키지 목업 생성 요청
 * POST /api/products/{productId}/add_package
 * Content-Type: multipart/form-data
 */
export async function createPackageMockup({
  productId,
  projectId,
  baseImageUrl,
  file,
  baseFile, // manual upload support
}) {
  const formData = new FormData();
  // projectId와 baseImageUrl은 쿼리 파라미터로 이동

  formData.append("file", file); // dieline
  // projectId와 baseImageUrl도 FormData에 추가 (워커 호환성)
  formData.append("projectId", projectId);

  if (baseFile) {
    // ad.js 패턴에 따라 base_file 키를 주력으로 사용
    formData.append("base_file", baseFile);
  }

  // 백엔드 명세: baseImageUrl 필수 파라미터.
  // placehold.co 같은 서비스는 워커 환경에서 차단될 수 있으므로 고품질 Unsplash 이미지를 사용합니다.
  const placeholderUrl = `https://images.unsplash.com/photo-1599305090598-fe179d501c27?q=80&w=800&t=${Date.now()}`;

  const finalBaseImageUrl =
    baseImageUrl && !baseImageUrl.startsWith("blob:")
      ? baseImageUrl
      : baseFile
        ? placeholderUrl
        : "";

  formData.append("baseImageUrl", finalBaseImageUrl);

  const params = new URLSearchParams({
    projectId: projectId,
    baseImageUrl: finalBaseImageUrl,
  });

  const url = `/api/products/${productId}/add_package?${params.toString()}`;
  console.log("[createPackageMockup] Final URL:", url);

  return httpForm(url, {
    method: "POST",
    formData: formData,
  });
}

/**
 * 콘텐츠 결과 조회 (폴링용)
 * GET /api/contents/{contentId}
 */
export async function getContentStatus(contentId) {
  const res = await apiFetch(`/api/contents/${contentId}`);
  if (!res.ok) throw new Error("콘텐츠 상태 조회 실패");
  return res.json();
}
