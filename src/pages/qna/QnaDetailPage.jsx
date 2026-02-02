import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchQuestion, createAnswer } from "@/services/api/qnaApi";
import { useAuthStore } from "@/stores/authStore";

const STATUS_TONE = {
  "답변 완료": "bg-green-100 text-green-700",
  "답변 대기": "bg-orange-100 text-orange-700",
};

const ROLE_TONE = {
  관리자: "bg-blue-100 text-blue-700",
  담당자: "bg-indigo-100 text-indigo-700",
};

export default function QnaDetailPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState("");
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

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
      setAnswerContent("");
    },
  });

  const handleSubmitAnswer = () => {
    if (!answerContent.trim()) return;
    answerMutation.mutate({ content: answerContent });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="border-b bg-white">
        <Container className="flex h-14 items-center justify-between text-xs text-gray-500">
          <Link
            to="/qna"
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-800"
          >
            <span className="text-base">←</span>
            Q&amp;A로 돌아가기
          </Link>
          <span className="text-base font-semibold text-green-500">
            CHILL GRAM
          </span>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">메뉴</span>
            <Link
              to="/"
              className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600"
            >
              메인으로
            </Link>
          </div>
        </Container>
      </div>

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
                  className="mt-4 h-9 bg-green-500 px-4 text-xs font-semibold text-white hover:bg-green-600 focus:ring-green-500"
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
                  className="mt-4 h-9 bg-green-500 px-4 text-xs font-semibold text-white hover:bg-green-600 focus:ring-green-500"
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
                      {question.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_TONE[question.status]
                        }`}
                    >
                      {question.status}
                    </span>
                  </div>
                  <h1 className="mt-4 text-xl font-semibold text-gray-900">
                    {question.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-gray-100" />
                      {question.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-gray-100" />
                      {question.date}
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    {question.content}
                  </div>
                </Card>

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  답변 {question.answers.length}개
                </div>

                <div className="space-y-4">
                  <ErrorBoundary>
                    {question.answers.map((answer) => (
                      <Card
                        key={answer.id}
                        className="border-l-4 border-l-blue-500 bg-blue-50/40"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span className="rounded-full border border-gray-200 px-2 py-0.5 text-gray-600">
                            {answer.author}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-semibold ${ROLE_TONE[answer.role] ||
                              "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {answer.role}
                          </span>
                          <span>{answer.date}</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          {answer.content}
                        </p>
                      </Card>
                    ))}
                  </ErrorBoundary>

                  {question.answers.length === 0 && (
                    <Card className="border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-400">
                      아직 등록된 답변이 없습니다.
                    </Card>
                  )}
                </div>

                <Card className="border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">
                    답변 작성
                  </h2>
                  <textarea
                    rows={4}
                    className="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
                    placeholder="답변을 작성해주세요..."
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                  />
                  <Button
                    className="mt-4 h-9 w-full bg-green-400 text-xs font-semibold text-white hover:bg-green-500 focus:ring-green-400 disabled:opacity-50"
                    onClick={handleSubmitAnswer}
                    disabled={answerMutation.isPending || !answerContent.trim()}
                  >
                    {answerMutation.isPending ? "등록 중..." : "답변 등록"}
                  </Button>
                  {answerMutation.isError && (
                    <p className="mt-2 text-xs text-red-500">
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
