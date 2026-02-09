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
    const res = await apiFetch(`/api/products/${productId}/projects`, {
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
 * 프로젝트 이미지 업로드
 * POST /api/projects/{id}/images
 */
export async function uploadProjectImages(projectId, files) {
    const formData = new FormData();

    // 단일 파일 또는 여러 파일 처리
    if (Array.isArray(files)) {
        files.forEach((file) => formData.append("images", file));
    } else {
        formData.append("images", files);
    }

    const res = await apiFetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("이미지 업로드에 실패했습니다.");
    return res.json();
}
