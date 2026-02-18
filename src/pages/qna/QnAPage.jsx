import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, MessageCircle } from "lucide-react";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useAuthStore } from "@/stores/authStore";
import { useQnaStore } from "@/stores/qnaStore";

const CATEGORY_MAP = {
  1: "이용 방법",
  2: "기술 지원",
  3: "결제/환불",
  4: "기능 제안",
  5: "버그 리포트",
  6: "기타",
};

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

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "pending", label: "답변 대기" },
  { key: "done", label: "답변 완료" },
];

const FILTER_LABEL_MAP = {
  all: "전체",
  pending: "답변 대기",
  done: "답변 완료",
};

export default function QnAPage() {
  // Zustand Store
  const {
    questions,
    isLoading,
    error: isError,
    fetchQuestions,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useQnaStore();

  const [page, setPage] = useState(0); // 현재 페이지 (0-indexed) - UI 상태는 로컬 유지
  const navigate = useNavigate();
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const handleAskQuestion = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      openAuthModal("/qna/new");
      return;
    }
    navigate("/qna/new");
  };

  // 초기 데이터 로드 (mount)
  useEffect(() => {
    if (bootstrapped) {
      fetchQuestions();
    }
  }, [bootstrapped, fetchQuestions]);

  // 1. 유효한 질문만 필터링 (CLOSED 제외)
  const activeQuestions = useMemo(() => {
    const allItems = questions || [];
    return allItems.filter((q) => q.status !== "CLOSED");
  }, [questions]);

  // 2. 전체 통계 계산 (상단 카드용)
  const stats = useMemo(() => {
    const pendingCount = activeQuestions.filter((q) => {
      const label = STATUS_MAP[q.status] || q.status || "답변 대기";
      return label === "답변 대기";
    }).length;

    const doneCount = activeQuestions.filter((q) => {
      const label = STATUS_MAP[q.status] || q.status || "답변 완료";
      return label === "답변 완료";
    }).length;

    return {
      total: activeQuestions.length,
      pending: pendingCount,
      done: doneCount,
    };
  }, [activeQuestions]);

  // 3. 현재 탭(Filter) 및 검색어(searchQuery)에 따른 전체 필터링 결과 계산
  const filteredAllQuestions = useMemo(() => {
    let results = activeQuestions;

    // 탭 필터 적용
    if (filterStatus === "pending") {
      results = results.filter(
        (q) => (STATUS_MAP[q.status] || q.status) === "답변 대기"
      );
    } else if (filterStatus === "done") {
      results = results.filter(
        (q) => (STATUS_MAP[q.status] || q.status) === "답변 완료"
      );
    }

    // 검색어 필터 적용
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((item) =>
        (item.title || "").toLowerCase().includes(q)
      );
    }

    return results;
  }, [activeQuestions, filterStatus, searchQuery]);

  // 4. 필터링된 결과로 페이징 계산
  const totalPages = Math.ceil(filteredAllQuestions.length / 10) || 1;
  const pagedQuestions = useMemo(() => {
    const start = page * 10;
    return filteredAllQuestions.slice(start, start + 10);
  }, [filteredAllQuestions, page]);

  // 5. 데이터 가공 및 매핑
  const mappedQuestions = useMemo(() => {
    return pagedQuestions.map((q) => {
      const catId = q.categoryId || q.category_id || q.category;
      const categoryLabel =
        CATEGORY_MAP[catId] || CATEGORY_MAP[String(catId)] || "기타";

      const rawName =
        q.createdByName || q.name || q.created_by || q.createdBy || "익명";
      const authorLabel =
        rawName.length > 1
          ? rawName[0] + "*".repeat(rawName.length - 1)
          : rawName;

      const statusLabel = STATUS_MAP[q.status] || q.status || "답변 대기";

      return {
        ...q,
        statusLabel,
        categoryLabel,
        dateLabel: (q.created_at || q.createdAt || "").substring(0, 10),
        authorLabel,
        excerpt:
          (q.body || q.content || "").substring(0, 100) +
          (q.body?.length > 100 ? "..." : ""),
      };
    });
  }, [pagedQuestions, user]);

  const statCards = [
    {
      key: "all",
      label: "전체 질문",
      value: stats.total,
      tone: "text-blue-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path
            d="M21 12a8.5 8.5 0 1 1-4.9-7.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M22 4v6h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "pending",
      label: "답변 대기",
      value: stats.pending,
      tone: "text-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 7v5l3 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "done",
      label: "답변 완료",
      value: stats.done,
      tone: "text-green-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="m8.5 12.5 2.5 2.5 4.5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <main className="py-6">
        <Container>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-start md:justify-between">
              <div cl>
                <h1 className="mt-2 text-3xl font-bold">Q&amp;A 게시판</h1>
                <p className="mt-1 text-sm text-gray-500">
                  궁금한 점을 질문하고 답변을 받아보세요.
                </p>
              </div>
              <Button
                className="h-10 gap-2 bg-primary px-5 text-white hover:bg-primary/90 focus:ring-primary"
                onClick={handleAskQuestion}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
                  +
                </span>
                질문하기
              </Button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ErrorBoundary>
                {statCards.map((stat) => (
                  <Card key={stat.label} className="border-gray-100 border-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-gray-500">
                        {stat.label}
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ${stat.tone}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-4 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </Card>
                ))}
              </ErrorBoundary>
            </div>

            <div className="mt-6 mb-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m16.5 16.5 4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  placeholder="질문을 검색하세요."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                />
              </div>

              {/* 탭 필터 복구 (Segmented Control 스타일) */}
              <div className="flex mt-4">
                <div className="inline-flex bg-gray-100/80 p-1 rounded-xl gap-1">
                  {FILTERS.map((filter) => {
                    const isActive = filter.key === filterStatus;
                    const countLabel =
                      filter.key === "all"
                        ? stats.total
                        : filter.key === "pending"
                          ? stats.pending
                          : stats.done;
                    return (
                      <button
                        key={filter.key}
                        onClick={() => {
                          setFilterStatus(filter.key);
                          setPage(0);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isActive
                          ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                          }`}
                      >
                        {filter.label} ({countLabel})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {isLoading && (
                <div className="py-10 text-center text-sm text-gray-400">
                  질문 목록을 불러오는 중...
                </div>
              )}
              {isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-sm text-red-500">
                  질문 목록을 불러오지 못했습니다.
                </div>
              )}
              <ErrorBoundary>
                {!isLoading &&
                  !isError &&
                  mappedQuestions.map((question) => (
                    <Link
                      key={question.questionId || question.id}
                      to={`/qna/${question.questionId || question.id}`}
                      className="block group"
                    >
                      <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600 font-medium">
                            {question.categoryLabel}
                          </span>
                          <span
                            className={`rounded-lg px-2.5 py-1 font-bold ${STATUS_TONE[question.statusLabel]}`}
                          >
                            {question.statusLabel}
                          </span>
                        </div>
                        <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {question.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {question.excerpt}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-end gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <User size={16} className="text-gray-300" />
                            {question.authorLabel}
                          </span>
                          <span className="h-3 w-px bg-gray-200"></span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-gray-300" />
                            {question.dateLabel}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </ErrorBoundary>

              {!isLoading && !isError && totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    className="h-8 w-8 p-0 border border-gray-200 bg-white disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    &lt;
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={i === page ? "primary" : "secondary"}
                      className={`h-8 w-8 p-0 ${i === page ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    className="h-8 w-8 p-0 border border-gray-200 bg-white disabled:opacity-50"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page === totalPages - 1}
                  >
                    &gt;
                  </Button>
                </div>
              )}
            </div>

            {!isLoading && !isError && mappedQuestions.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-400">
                {FILTER_LABEL_MAP[filterStatus] === "전체"
                  ? "등록된 질문이 없습니다."
                  : `${FILTER_LABEL_MAP[filterStatus]} 상태의 질문이 없습니다.`}
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
