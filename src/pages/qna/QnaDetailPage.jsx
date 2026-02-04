import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { MessageSquare, User, Calendar } from "lucide-react";
import { fetchQuestion, createAnswer, deleteQuestion, updateAnswer, deleteAnswer, updateQuestion } from "@/services/api/qnaApi";
import { useAuthStore } from "@/stores/authStore";

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
import { apiFetch } from "@/lib/apiFetch"; // apiFetch 임포트



// 인증 토큰이 필요한 이미지를 불러오는 컴포넌트
const AuthImage = ({ src, alt, className }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!src) return;

    let active = true;
    (async () => {
      // 1. 첫 번째 시도: 원본 URL 그대로
      const candidates = [src];

      // URL 보정 후보 추가 (백엔드가 경로를 잘못 줄 경우 대비)
      try {
        const urlObj = new URL(src);
        // 만약 /qna/... 로 시작하면 -> /api/qna/..., /api/uploads/qna/... 시도
        if (urlObj.pathname.startsWith("/qna/")) {
          candidates.push(src.replace("/qna/", "/api/qna/"));
          candidates.push(src.replace("/qna/", "/api/uploads/qna/"));
        }
      } catch (e) {
        // 상대 경로 등 에러 무시
      }

      for (const url of candidates) {
        try {
          console.log(`[AuthImage] Trying: ${url}`);
          const res = await apiFetch(url);
          if (res.status === 404) continue; // 404면 다음 후보 시도
          if (!res.ok) throw new Error(`Image load failed: ${res.status}`);

          const blob = await res.blob();
          if (active) {
            const newUrl = URL.createObjectURL(blob);
            setBlobUrl(newUrl);
          }
          return; // 성공하면 종료
        } catch (err) {
          console.warn(`[AuthImage] Load error for ${url}:`, err);
        }
      }
      console.error("[AuthImage] All candidates failed");
    })();

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src]);

  if (!blobUrl) return <div className="h-48 w-full animate-pulse rounded-lg bg-gray-100" />;

  return <img src={blobUrl} alt={alt} className={className} />;
};

export default function QnaDetailPage() {
  const { questionId } = useParams();
  console.log("[QnaDetailPage] URL에서 받은 questionId:", questionId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState("");

  // 답변 수정 상태 관리
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  // 권한 체크: 로그인하지 않은 경우 목록으로 튕겨내고 로그인 모달 표시
  useEffect(() => {
    if (bootstrapped && !isAuthenticated) {
      // 현재 상세 페이지 경로를 저장하여 로그인 후 돌아오게 함
      openAuthModal(`/qna/${questionId}`);
      navigate("/qna");
    }
  }, [bootstrapped, isAuthenticated, navigate, openAuthModal, questionId]);

  const {
    data: question,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestion(questionId),
    enabled: bootstrapped, // 토큰 복원 완료 후에만 API 호출
  });

  const answerMutation = useMutation({
    mutationFn: (payload) => createAnswer(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      queryClient.invalidateQueries({ queryKey: ["allQuestions"] }); // 목록 캐시도 무효화
      setAnswerContent("");
    },
  });



  // Soft Delete Mutation (상태 변경)
  const softDeleteMutation = useMutation({
    mutationFn: () => updateQuestion(questionId, {
      title: question.title,
      content: question.content || question.body,
      categoryId: question.categoryId || question.category_id || 1, // ID 없으면 기본값
      status: "CLOSED", // Soft Delete 상태
    }),
    onSuccess: (data) => {
      console.log("[softDeleteMutation] Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      navigate("/qna");
    },
    onError: (error) => {
      alert("질문 삭제(상태 변경) 실패: " + error.message);
    }
  });

  // 답변 수정 Mutation
  const updateAnswerMutation = useMutation({
    mutationFn: ({ answerId, body }) => updateAnswer(questionId, answerId, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      queryClient.invalidateQueries({ queryKey: ["allQuestions"] }); // 목록 캐시도 무효화
      setEditingAnswerId(null);
      setEditContent("");
    },
    onError: (error) => {
      alert("답변 수정 실패: " + error.message);
    }
  });

  // 답변 삭제 Mutation (Workaround: 내용 변경으로 Soft Delete 처리)
  const softDeleteAnswerMutation = useMutation({
    mutationFn: (answerId) => updateAnswer(questionId, answerId, { body: "[DELETED]" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      queryClient.invalidateQueries({ queryKey: ["allQuestions"] }); // 목록 캐시도 무효화
      if (editingAnswerId) {
        setEditingAnswerId(null);
        setEditContent("");
      }
    },
    onError: (error) => {
      alert("답변 삭제 실패: " + error.message);
    }
  });

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return;
    console.log("[QnaDetailPage] 보내는 데이터:", { body: answerContent });
    answerMutation.mutate({ body: answerContent });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      // Soft Delete 실행
      softDeleteMutation.mutate();
    }
  };

  // 답변 수정 시작 핸들러
  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer.answerId || answer.id);
    setEditContent(answer.content || answer.body || "");
  };

  // 답변 수정 취소 핸들러
  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  // 답변 수정 저장 핸들러
  const saveEditAnswer = (answerId) => {
    if (!editContent.trim()) return;
    updateAnswerMutation.mutate({ answerId, body: editContent });
  };

  // 답변 삭제 핸들러
  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      try {
        // 1. 답변 소프트 삭제 수행 (내용을 [DELETED]로 변경)
        await softDeleteAnswerMutation.mutateAsync(answerId);

        // 2. 만약 이것이 마지막 유효 답변이었다면 질문 상태를 'WAITING'으로 되돌림
        // validAnswers는 useMemo로 관리되므로 현재 스냅샷 기준으로 체크
        if (validAnswers.length === 1 && (validAnswers[0].answerId === answerId || validAnswers[0].id === answerId)) {
          console.log("[QnaDetailPage] 마지막 답변 삭제 감지. 상태를 WAITING으로 변경합니다.");
          await updateQuestion(questionId, {
            title: question.title,
            body: question.body || question.content,
            categoryId: question.categoryId || question.category || question.category_id,
            status: "WAITING"
          });
          // 상태 변경 후 다시 무효화
          queryClient.invalidateQueries({ queryKey: ["question", questionId] });
          queryClient.invalidateQueries({ queryKey: ["allQuestions"] });
        }
      } catch (error) {
        console.error("[QnaDetailPage] 삭제 중 오류 발생:", error);
      }
    }
  };

  // 현재 로그인 사용자가 질문 작성자인지 확인
  const isAuthor = user && question && (
    user.id === question.createdBy ||
    user.userId === question.createdBy ||
    user.user_id === question.createdBy ||
    user.id === question.created_by ||
    user.userId === question.created_by ||
    user.user_id === question.created_by
  );

  // 답변 작성자 확인
  const isAnswerAuthor = (answer) => {
    return user && (
      user.id === answer.createdBy ||
      user.userId === answer.createdBy ||
      user.id === answer.created_by ||
      user.userId === answer.created_by ||
      (answer.author && user.nickname === answer.author)
    );
  };

  // [DELETED] 상태가 아닌 실제 유효한 답변만 필터링
  const validAnswers = useMemo(() => {
    if (!question || !question.answers) return [];
    return question.answers.filter(
      (a) => a.body !== "[DELETED]" && a.content !== "[DELETED]"
    );
  }, [question]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">


      <main className="py-10">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {isLoading && (
              <Card className="border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  질문을 불러오는 중...
                </p>
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
                        const catId = question.category || question.categoryId || question.category_id;
                        return CATEGORY_MAP[catId] || CATEGORY_MAP[String(catId)] || "기타";
                      })()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_TONE[STATUS_MAP[question.status] || question.status] || "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {STATUS_MAP[question.status] || question.status || "답변 대기"}
                    </span>
                  </div>
                  <h1 className="mt-4 text-xl font-semibold text-gray-900">
                    {question.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-300" />
                      {/* 백엔드에서 제공하는 createdByName 사용 */}
                      {question.createdByName || question.author || "익명"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-300" />
                      {question.date || question.created_at?.substring(0, 10) || question.createdAt?.substring(0, 10)}
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    {question.content || question.body}
                  </div>

                  {/* 첨부 이미지 표시 */}
                  {/* 1. 단일 필드로 오는 경우 */}
                  {(question.imageUrl || question.fileUrl) && (
                    <div className="mt-4">
                      <AuthImage
                        src={question.imageUrl || question.fileUrl}
                        alt="첨부 이미지"
                        className="max-h-96 max-w-full rounded-lg object-contain border border-gray-200"
                      />
                    </div>
                  )}

                  {/* 2. attachments 배열로 오는 경우 */}
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
                        disabled={softDeleteMutation.isPending}
                      >
                        {softDeleteMutation.isPending ? "삭제 중..." : "삭제"}
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
                                {answer.answeredByName || answer.author || answer.name || "익명"}
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
                                {answer.date || answer.createdAt?.substring(0, 10) || answer.created_at?.substring(0, 10)}
                              </span>
                            </div>

                            {/* 답변 작성자 본인일 경우 수정/삭제 버튼 표시 (수정 모드 아닐 때) */}
                            {isAnswerAuthor(answer) && editingAnswerId !== answerId && (
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

                          {/* 수정 모드일 때 */}
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

                <Card className="border-gray-100 p-6">
                  <h2 className="text-sm font-bold text-gray-800">
                    답변 작성
                  </h2>
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
                    disabled={answerMutation.isPending || !answerContent.trim()}
                  >
                    {answerMutation.isPending ? "등록 중..." : "답변 등록"}
                  </Button>
                  {answerMutation.isError && (
                    <p className="mt-2 text-[11px] text-red-500 font-medium">
                      {answerMutation.error?.message || "답변 등록에 실패했습니다."}
                    </p>
                  )}
                </Card>
              </>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
