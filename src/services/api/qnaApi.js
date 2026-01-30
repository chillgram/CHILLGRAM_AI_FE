import { apiFetch } from "@/lib/apiFetch";

const BASE_URL = "/api/qs/questions";

/**
 * 질문 목록 조회
 */
export async function fetchQuestions() {
    const res = await apiFetch(BASE_URL);
    if (!res.ok) throw new Error("질문 목록을 불러오지 못했습니다.");
    const json = await res.json();
    // API 응답이 배열이면 그대로, 객체면 data 또는 questions 속성 추출
    if (Array.isArray(json)) return json;
    return json.data || json.questions || json.content || [];
}

/**
 * 질문 상세 조회
 */
export async function fetchQuestion(id) {
    const res = await apiFetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("질문을 불러오지 못했습니다.");
    const json = await res.json();
    // API 응답이 객체로 감싸져 있으면 추출
    return json.data || json;
}

/**
 * 질문 등록 (multipart/form-data)
 * 필수: title, content, categoryId, companyId, createdBy
 * 선택: file (이미지)
 */
export async function createQuestion(payload) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    formData.append("category", payload.categoryId); // 백엔드는 "category" 필드명 사용
    formData.append("companyId", payload.companyId);
    formData.append("createdBy", payload.createdBy);
    if (payload.file) {
        formData.append("file", payload.file);
    }

    const res = await apiFetch(BASE_URL, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("질문 등록에 실패했습니다.");
    return res.json();
}

/**
 * 답변 등록
 */
export async function createAnswer(questionId, payload) {
    const res = await apiFetch(`${BASE_URL}/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("답변 등록에 실패했습니다.");
    return res.json();
}
