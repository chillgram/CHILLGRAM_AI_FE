import { apiFetch } from "@/lib/apiFetch";

/**
 * 질문 목록 조회
 */
/**
 * 질문 목록 조회
 */
export async function fetchQuestions({ page = 0, size = 10 } = {}) {
    const params = new URLSearchParams({ page, size });
    const res = await apiFetch(`/api/qs/questions?${params.toString()}`);
    if (!res.ok) throw new Error("질문 목록을 불러오지 못했습니다.");
    const json = await res.json();
    return json; // 백엔드 응답: { content: [], number: 0, totalPages: N, ... }
}

/**
 * 질문 상세 조회
 */
export async function fetchQuestion(id) {
    const res = await apiFetch(`/api/qs/questions/${id}`);
    if (!res.ok) throw new Error("질문을 불러오지 못했습니다.");
    const json = await res.json();
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
    formData.append("body", payload.content); // 백엔드 통일: content -> body
    formData.append("category", payload.categoryId); // 백엔드는 "category" 필드명 사용
    formData.append("companyId", payload.companyId);
    formData.append("createdBy", payload.createdBy);
    if (payload.file) {
        formData.append("file", payload.file);
    }

    const res = await apiFetch("/api/qs/questions", {
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
    const res = await apiFetch(`/api/qs/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("답변 등록에 실패했습니다.");
    return res.json();
}

/**
 * 답변 수정
 */
export async function updateAnswer(questionId, answerId, payload) {
    const res = await apiFetch(`/api/qs/questions/${questionId}/answers/${answerId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("답변 수정에 실패했습니다.");
    return res.json();
}

/**
 * 답변 삭제
 */
export async function deleteAnswer(questionId, answerId) {
    let res = await apiFetch(`/api/qs/questions/${questionId}/answers/${answerId}`, {
        method: "DELETE",
    });

    // 404이면 평탄화된 URL(/api/qs/answers/{id})로 재시도 (백엔드 구조 불확실 대응)
    if (res.status === 404) {
        console.warn("[deleteAnswer] Nested path 404, trying flat path...");
        res = await apiFetch(`/api/qs/answers/${answerId}`, {
            method: "DELETE",
        });
    }

    if (!res.ok) throw new Error("답변 삭제에 실패했습니다.");
    return res;
}

/**
 * 질문 삭제
 */
export async function deleteQuestion(questionId) {
    const res = await apiFetch(`/api/qs/questions/${questionId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("질문 삭제에 실패했습니다.");
    return res;
}

/**
 * 질문 수정
 */
export async function updateQuestion(questionId, payload) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("body", payload.content || payload.body); // content or body
    formData.append("category", payload.categoryId);

    // 상태 변경 지원 (Soft Delete 등)
    if (payload.status) {
        formData.append("status", payload.status);
    }

    if (payload.file) {
        formData.append("file", payload.file);
    }

    const res = await apiFetch(`/api/qs/questions/${questionId}`, {
        method: "PUT",
        body: formData,
    });
    if (!res.ok) {
        throw new Error("질문 수정에 실패했습니다.");
    }
    const json = await res.json();
    return json;
}
