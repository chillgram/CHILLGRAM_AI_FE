import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { Field } from "@/components/common/Field";
import { SelectField } from "@/components/common/SelectField";
import { createQuestion } from "@/services/api/qnaApi";
import { useAuthStore } from "@/stores/authStore";

const CATEGORY_OPTIONS = [
  { value: "1", label: "이용 방법" },
  { value: "2", label: "기술 지원" },
  { value: "3", label: "결제/환불" },
  { value: "4", label: "기능 제안" },
  { value: "5", label: "버그 리포트" },
  { value: "6", label: "기타" },
];

export default function QnaWritePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null); // 파일 상태 추가
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      navigate("/qna");
    },
  });

  const handleSubmit = () => {
    if (!category || !title.trim() || !content.trim()) return;
    mutation.mutate({
      title,
      content,
      categoryId: Number(category), // 숫자로 변환
      companyId: user?.companyId || 1, // 사용자 회사 ID
      createdBy: user?.id || user?.userId || user?.user_id || 1, // 작성자 ID
      file, // 첨부 파일 (선택)
    });
  };

  const isFormValid = category && title.trim() && content.trim();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="py-10">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold">질문 작성</h1>
              <p className="mt-2 text-sm text-gray-500">
                궁금한 내용을 자세히 작성해주시면 빠르게 답변해드릴게요.
              </p>
            </div>

            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-800">
                    질문 정보
                  </p>

                  <div className="space-y-5">
                    <SelectField
                      label="카테고리"
                      required
                      placeholder="카테고리를 선택하세요."
                      value={category}
                      onChange={setCategory}
                      options={CATEGORY_OPTIONS}
                    />

                    <Field
                      label="제목"
                      required
                      placeholder="질문 제목을 입력하세요."
                      value={title}
                      onChange={(val) => setTitle(val.slice(0, 100))}
                    />
                    <div className="text-right text-xs text-gray-400">
                      {title.length} / 100
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-semibold text-black">
                        내용 <span className="text-black">*</span>
                      </label>
                      <textarea
                        rows={6}
                        className="w-full resize-none rounded-lg border border-gray-200 bg-primary/5 px-6 py-4 text-sm text-gray-700 outline-none ring-0 focus:ring-2 focus:ring-primary"
                        placeholder="질문 내용을 자세히 입력해주세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, 2000))}
                        maxLength={2000}
                      />
                      <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                        <p className="font-semibold text-gray-600">예시:</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          <li>어떤 상황에서 문제가 발생하나요?</li>
                          <li>어떤 결과를 기대하고 있나요?</li>
                          <li>
                            스크린샷이나 에러 메시지가 있다면 첨부해주세요.
                          </li>
                        </ul>
                      </div>
                      <div className="mt-1 text-right text-xs text-gray-400">
                        {content.length} / 2000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-600">
                  <p className="font-semibold">작성 팁</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>구체적인 상황과 문제를 설명해주세요.</li>
                    <li>에러 메시지가 있다면 함께 작성해주세요.</li>
                    <li>스크린샷이 있으면 빠른 답변에 도움이 됩니다.</li>
                    <li>개인정보나 비밀번호는 제외해주세요.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-600">
                    이미지 첨부 (선택)
                  </p>
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-primary/50 transition-colors">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12 16V8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="m8.5 11.5 3.5-3.5 3.5 3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          rx="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      이미지를 드래그하거나 클릭하여 업로드
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, GIF 형식 지원, 파일당 최대 5MB
                    </p>
                    <label className="mt-4 inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:text-primary hover:border-primary/50 transition-colors">
                      <span className="text-sm">+</span>
                      파일 선택
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setFileName(file ? file.name : "");
                          setFile(file); // 파일 상태 업데이트 추가
                        }}
                      />
                    </label>
                    <p className="mt-3 text-xs text-gray-500">
                      {fileName
                        ? `선택된 파일: ${fileName}`
                        : "선택된 파일 없음"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/qna"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-4 text-xs font-semibold text-gray-600"
                  >
                    취소
                  </Link>
                  <Button
                    className="h-9 bg-primary px-5 text-xs font-semibold text-white hover:bg-primary/90 focus:ring-primary disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={mutation.isPending || !isFormValid}
                  >
                    {mutation.isPending ? "등록 중..." : "질문 등록"}
                  </Button>
                </div>
                {mutation.isError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {mutation.error?.message || "질문 등록에 실패했습니다."}
                  </div>
                )}

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-700">
                  답변 예상 시간: 영업일 기준 1-2일 이내 답변드립니다. 긴급한
                  문의는 고객센터(1234-5678)로 연락해주세요.
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
