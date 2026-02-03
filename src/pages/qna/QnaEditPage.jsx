import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { fetchQuestion, updateQuestion } from "@/services/api/qnaApi";
import { useAuthStore } from "@/stores/authStore";

const CATEGORIES = [
    { id: 1, name: "일반 문의" },
    { id: 2, name: "기술 지원" },
    { id: 3, name: "결제/환불" },
    { id: 4, name: "계정 문의" },
    { id: 5, name: "서비스 개선" },
    { id: 6, name: "기타" },
];

export default function QnaEditPage() {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const bootstrapped = useAuthStore((s) => s.bootstrapped);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState(1);
    const [file, setFile] = useState(null);

    const {
        data: question,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["question", questionId],
        queryFn: () => fetchQuestion(questionId),
        enabled: bootstrapped,
    });

    // 질문 데이터 로드 후 폼에 채우기
    useEffect(() => {
        if (question) {
            setTitle(question.title || "");
            setContent(question.content || question.body || "");
            setCategoryId(question.categoryId || question.category_id || 1);
        }
    }, [question]);

    const updateMutation = useMutation({
        mutationFn: (payload) => updateQuestion(questionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["question", questionId] });
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            navigate(`/qna/${questionId}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        updateMutation.mutate({
            title,
            content,
            categoryId,
            file,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="border-b bg-white">
                <Container className="flex h-14 items-center justify-between text-xs text-gray-500">
                    <Link
                        to={`/qna/${questionId}`}
                        className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-800"
                    >
                        <span className="text-base">←</span>
                        취소
                    </Link>
                    <span className="text-base font-semibold text-green-500">
                        CHILL GRAM
                    </span>
                    <div className="w-16" />
                </Container>
            </div>

            <main className="py-10">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <Card className="border-gray-100">
                            <h1 className="text-xl font-semibold text-gray-900">
                                질문 수정
                            </h1>

                            {isLoading && (
                                <p className="mt-4 text-sm text-gray-500">
                                    질문을 불러오는 중...
                                </p>
                            )}

                            {isError && (
                                <p className="mt-4 text-sm text-red-500">
                                    질문을 불러오지 못했습니다.
                                </p>
                            )}

                            {question && (
                                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                    {/* 카테고리 선택 */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            카테고리
                                        </label>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 제목 입력 */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            제목
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="질문 제목을 입력하세요"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* 내용 입력 */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            내용
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="질문 내용을 입력하세요"
                                            rows={8}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* 파일 첨부 */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            파일 첨부 (선택)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                                        />
                                    </div>

                                    {/* 버튼 */}
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="h-10 border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            onClick={() => navigate(`/qna/${questionId}`)}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="h-10 bg-green-500 px-6 text-sm font-semibold text-white hover:bg-green-600"
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? "수정 중..." : "수정 완료"}
                                        </Button>
                                    </div>

                                    {updateMutation.isError && (
                                        <p className="text-sm text-red-500">
                                            질문 수정에 실패했습니다.
                                        </p>
                                    )}
                                </form>
                            )}
                        </Card>
                    </div>
                </Container>
            </main>
        </div>
    );
}
