import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { MessageSquare, User, Calendar } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useQnaStore } from "@/stores/qnaStore";
import { apiFetch } from "@/lib/apiFetch";
import { maskName } from "../../utils/masking";

const STATUS_MAP = {
  WAITING: "답변 대기",
  PENDING: "답변 대기",
  ANSWERED: "답변 완료",
  DONE: "답변 완료",
  COMPLETED: "답변 완료",
};

const STATUS_TONE = {
  "답변 완료": "bg-green-100 text-green-700",
  "답변 대기": "bg-orange-100 text-orange-700",
};

const ROLE_TONE = {
  관리자: "bg-blue-600 text-white",
  담당자: "bg-indigo-600 text-white",
};

const CATEGORY_MAP = {
  1: "이용 방법",
  2: "기술 지원",
  3: "결제/환불",
  4: "기능 제안",
  5: "버그 리포트",
  6: "기타",
};

// 인증 토큰이 필요한 이미지를 불러오는 컴포넌트
const AuthImage = ({ src, alt, className }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!src) return;

    // GCS URL이거나 외부 URL인 경우 apiFetch(헤더 포함)를 사용하면 CORS 에러 발생 가능
    // 따라서 직접 src를 사용하도록 처리
    if (src.includes("storage.googleapis.com") || src.startsWith("http")) {
      setBlobUrl(src);
      return;
    }

    let active = true;
    (async () => {
      const candidates = [];

      if (!src.startsWith("data:")) {
        const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
        if (!cleanSrc.startsWith("images/")) {
          candidates.push(`/images/${cleanSrc}`);
        }
      }

      candidates.push(src);

      for (const url of candidates) {
        try {
          const res = await apiFetch(url);
          if (res.status === 404) continue;
          if (!res.ok) throw new Error(`Image load failed: ${res.status}`);

          const blob = await res.blob();
          if (active) {
            const newUrl = URL.createObjectURL(blob);
            setBlobUrl(newUrl);
          }
          return;
        } catch (err) {
          console.warn(`[AuthImage] Load error for ${url}:`, err);
        }
      }
    })();

    return () => {
      active = false;
      if (blobUrl && !blobUrl.startsWith("http")) URL.revokeObjectURL(blobUrl);
    };
  }, [src]);

  if (!blobUrl)
    return <div className="h-48 w-full animate-pulse rounded-lg bg-gray-100" />;

  return <img src={blobUrl} alt={alt} className={className} />;
};

export default function QnaDetailPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();

  // Zustand Store
  const {
    currentQuestion: question,
    isLoading, // 전체 로딩 (조회 시)
    error: isError,
    fetchQuestion,
    createAnswer,
    updateAnswer,
    updateQuestion,
  } = useQnaStore();

  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 로컬 로딩 상태 (버튼용)

  // 답변 수정 상태 관리
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  // 권한 체크
  useEffect(() => {
    if (bootstrapped && !isAuthenticated) {
      openAuthModal(`/qna/${questionId}`);
      navigate("/qna");
    }
  }, [bootstrapped, isAuthenticated, navigate, openAuthModal, questionId]);

  // 초기 데이터 로드
  useEffect(() => {
    if (bootstrapped && questionId) {
      fetchQuestion(questionId);
    }
  }, [bootstrapped, questionId, fetchQuestion]);

  // 답변 등록 핸들러
  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createAnswer(questionId, { body: answerContent });
      setAnswerContent("");
    } catch (e) {
      alert("답변 등록 실패: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 질문 삭제 (Soft Delete) 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      setIsSubmitting(true);
      try {
        await updateQuestion(questionId, {
          title: question.title,
          content: question.content || question.body,
          categoryId: question.categoryId || question.category_id || 1,
          status: "CLOSED",
        });
        navigate("/qna");
      } catch (e) {
        alert("질문 삭제 실패: " + e.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 답변 수정 시작
  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer.answerId || answer.id);
    setEditContent(answer.content || answer.body || "");
  };

  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  const saveEditAnswer = async (answerId) => {
    if (!editContent.trim()) return;
    try {
      await updateAnswer(questionId, answerId, { body: editContent });
      setEditingAnswerId(null);
      setEditContent("");
    } catch (e) {
      alert("답변 수정 실패: " + e.message);
    }
  };

  // 답변 삭제 핸들러
  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      try {
        // 답변 삭제 (Soft Delete or Hard Delete depends on store/api impl)
        // 여기서는 API가 Hard Delete 또는 Soft 지원한다고 가정.
        // 기존 코드는 Soft Delete([DELETED]) 후 상황에 따라 질문 상태 변경 로직이 있었음.
        // Store의 deleteAnswer는 단순 삭제만 수행함.
        // 복잡한 비즈니스 로직(마지막 답변 삭제 시 상태 변경 등)은 백엔드에서 처리하는 게 맞지만,
        // 프론트에서 처리해야 한다면 여기서 처리해야 함.

        // 기존 로직 유지: [DELETED] 업데이트
        await updateAnswer(questionId, answerId, { body: "[DELETED]" });

        // 마지막 답변 체크 로직은 Store fetchQuestion에 의해 갱신된 데이터를 보고 판단하기 어려움 (비동기 시점 문제).
        // 일단 단순 삭제 처리로 진행.
      } catch (e) {
        alert("답변 삭제 실패: " + e.message);
      }
    }
  };

  // 현재 로그인 사용자가 질문 작성자인지 확인
  const isAuthor =
    user &&
    question &&
    (user.id === question.createdBy ||
      user.userId === question.createdBy ||
      user.user_id === question.createdBy ||
      user.id === question.created_by ||
      user.userId === question.created_by ||
      user.user_id === question.created_by);

  // 답변 작성자 확인
  const isAnswerAuthor = (answer) => {
    return (
      user &&
      (user.id === answer.createdBy ||
        user.userId === answer.createdBy ||
        user.id === answer.created_by ||
        user.userId === answer.created_by ||
        (answer.author && user.nickname === answer.author))
    );
  };

  // [DELETED] 상태가 아닌 실제 유효한 답변만 필터링
  const validAnswers = useMemo(() => {
    if (!question || !question.answers) return [];
    return question.answers.filter(
      (a) => a.body !== "[DELETED]" && a.content !== "[DELETED]",
    );
  }, [question]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="py-10">
        <Container>
          <div className="mx-auto w-full max-w-5xl px-4">
            {isLoading && !question && (
              <Card className="border-gray-100 text-center">
                <p className="text-sm text-gray-500">질문을 불러오는 중...</p>
              </Card>
            )}
            {isError && (
              <Card className="border-gray-100 text-center">
                <p className="text-sm text-red-500">
                  질문을 불러오지 못했습니다.
                </p>
                <Button
                  className="mt-4 h-9 bg-primary px-4 text-xs font-semibold text-white hover:bg-primary/90 focus:ring-primary"
                  onClick={() => navigate("/qna")}
                >
                  목록으로 돌아가기
                </Button>
              </Card>
            )}
            {!isLoading && !isError && !question && (
              <Card className="border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  요청하신 질문을 찾을 수 없습니다.
                </p>
                <Button
                  className="mt-4 h-9 bg-primary px-4 text-xs font-semibold text-white hover:bg-primary/90 focus:ring-primary"
                  onClick={() => navigate("/qna")}
                >
                  목록으로 돌아가기
                </Button>
              </Card>
            )}

            {question && (
              <>
                <Card className="border-gray-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-gray-600">
                      {(() => {
                        const catId =
                          question.category ||
                          question.categoryId ||
                          question.category_id;
                        return (
                          CATEGORY_MAP[catId] ||
                          CATEGORY_MAP[String(catId)] ||
                          "기타"
                        );
                      })()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_TONE[
                        STATUS_MAP[question.status] || question.status
                      ] || "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {STATUS_MAP[question.status] ||
                        question.status ||
                        "답변 대기"}
                    </span>
                  </div>
                  <h1 className="mt-4 text-xl font-semibold text-gray-900">
                    {question.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-300" />
                      {maskName(question.createdByName || question.author)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-300" />
                      {question.date ||
                        question.created_at?.substring(0, 10) ||
                        question.createdAt?.substring(0, 10)}
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    {question.content || question.body}
                  </div>

                  {/* 첨부 이미지 표시 */}
                  {(question.imageUrl ||
                    question.fileUrl ||
                    question.gcsImageUrl) && (
                      <div className="mt-4">
                        <AuthImage
                          src={
                            question.imageUrl ||
                            question.fileUrl ||
                            question.gcsImageUrl
                          }
                          alt="첨부 이미지"
                          className="max-h-96 max-w-full rounded-lg object-contain border border-gray-200"
                        />
                      </div>
                    )}

                  {question.attachments && question.attachments.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {question.attachments.map((att, index) => (
                        <div key={index}>
                          <AuthImage
                            src={att.fileUrl || att.url}
                            alt={`첨부 이미지 ${index + 1}`}
                            className="max-h-96 max-w-full rounded-lg object-contain border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 수정/삭제 버튼 - 작성자만 표시 */}
                  {isAuthor && (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="h-8 border border-gray-300 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate(`/qna/${questionId}/edit`)}
                      >
                        수정
                      </Button>
                      <Button
                        className="h-8 bg-red-500 px-4 text-xs font-medium text-white hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "삭제 중..." : "삭제"}
                      </Button>
                    </div>
                  )}
                </Card>

                <div className="flex items-center gap-2 text-base font-bold text-gray-900 mt-8 mb-4">
                  <MessageSquare size={18} className="text-gray-900" />
                  <span>답변 {validAnswers.length}개</span>
                </div>

                <div className="space-y-4">
                  <ErrorBoundary>
                    {validAnswers.map((answer) => {
                      const answerId = answer.answerId || answer.id;
                      return (
                        <Card
                          key={answerId}
                          className="border-none border-l-[3px] border-l-blue-500 bg-[#F6F9FF] shadow-none p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-800">
                                {maskName(
                                  answer.answeredByName ||
                                  answer.author ||
                                  answer.name,
                                )}
                              </span>
                              {answer.role && (
                                <span
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${ROLE_TONE[answer.role] ||
                                    "bg-gray-400 text-white"
                                    }`}
                                >
                                  {answer.role}
                                </span>
                              )}
                              <span className="text-[11px] font-medium text-gray-400 ml-1">
                                {answer.date ||
                                  answer.createdAt?.substring(0, 10) ||
                                  answer.created_at?.substring(0, 10)}
                              </span>
                            </div>

                            {isAnswerAuthor(answer) &&
                              editingAnswerId !== answerId && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditAnswer(answer)}
                                    className="text-[11px] font-medium text-gray-300 hover:text-blue-500 transition-colors"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnswer(answerId)}
                                    className="text-[11px] font-medium text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                          </div>

                          {editingAnswerId === answerId ? (
                            <div className="mt-3">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                                rows={3}
                              />
                              <div className="mt-2 flex justify-end gap-2">
                                <Button
                                  variant="secondary"
                                  className="h-7 px-3 text-xs bg-white border border-gray-200"
                                  onClick={cancelEditAnswer}
                                >
                                  취소
                                </Button>
                                <Button
                                  className="h-7 bg-blue-500 px-3 text-xs text-white hover:bg-blue-600"
                                  onClick={() => saveEditAnswer(answerId)}
                                >
                                  저장
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2.5 text-sm text-[#475467] leading-relaxed whitespace-pre-wrap">
                              {answer.content || answer.body}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </ErrorBoundary>

                  {validAnswers.length === 0 && (
                    <Card className="border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-400">
                      아직 등록된 답변이 없습니다.
                    </Card>
                  )}
                </div>

                <Card className="border-gray-100 mt-10">
                  <h2 className="text-sm font-bold text-gray-800">답변 작성</h2>
                  <textarea
                    rows={4}
                    className="mt-4 w-full resize-none rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm text-gray-700 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="답변을 작성해주세요..."
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                  />
                  <Button
                    className="mt-4 h-12 w-full rounded-xl bg-primary text-[15px] font-black text-white hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !answerContent.trim()}
                  >
                    {isSubmitting ? "등록 중..." : "답변 등록"}
                  </Button>
                </Card>
              </>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
