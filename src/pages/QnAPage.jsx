import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { QUESTIONS } from "@/data/qnaData";


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
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const pending = QUESTIONS.filter((question) => question.status === "답변 대기")
      .length;
    const done = QUESTIONS.filter((question) => question.status === "답변 완료")
      .length;
    return {
      total: QUESTIONS.length,
      pending,
      done,
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    if (activeFilter === "pending") {
      return QUESTIONS.filter((question) => question.status === "답변 대기");
    }
    if (activeFilter === "done") {
      return QUESTIONS.filter((question) => question.status === "답변 완료");
    }
    return QUESTIONS;
  }, [activeFilter]);

  const statCards = [
    {
      label: "전체 질문",
      value: stats.total,
      tone: "text-blue-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
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
      label: "답변 대기",
      value: stats.pending,
      tone: "text-orange-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
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
          />
        </svg>
      ),
    },
    {
      label: "답변 완료",
      value: stats.done,
      tone: "text-green-500",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
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
      <main className="py-10">
        <Container>
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-green-500">CHILL GRAM</p>
                <h1 className="mt-3 text-2xl font-bold">Q&amp;A 게시판</h1>
                <p className="mt-2 text-sm text-gray-500">
                  궁금한 점을 질문하고 답변을 받아보세요.
                </p>
              </div>
              <Button
                className="h-10 gap-2 bg-green-500 px-5 text-white hover:bg-green-600 focus:ring-green-500"
                onClick={() => {
                  navigate("/qna/new");
                }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
                  +
                </span>
                질문하기
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {statCards.map((stat) => (
                <Card key={stat.label} className="border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">{stat.label}</div>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 ${stat.tone}`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-semibold">{stat.value}</div>
                </Card>
              ))}
            </div>

            <div className="mt-6 space-y-4">
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
                  className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 text-sm text-gray-700 placeholder:text-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="질문을 검색하세요."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => {
                  const isActive = filter.key === activeFilter;
                  const countLabel =
                    filter.key === "all"
                      ? stats.total
                      : filter.key === "pending"
                        ? stats.pending
                        : stats.done;

                  return (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        isActive
                          ? "border border-gray-200 bg-white text-gray-700 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      {filter.label} ({countLabel})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {filteredQuestions.map((question) => (
                <Link
                  key={question.id}
                  to={`/qna/${question.id}`}
                  className="block"
                >
                <Card className="border-gray-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-gray-600">
                      {question.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        STATUS_TONE[question.status]
                      }`}
                    >
                      {question.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-gray-900">
                    {question.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{question.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-gray-100" />
                      {question.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-gray-100" />
                      {question.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-gray-100" />
                      답변 {question.replies}개
                    </span>
                  </div>
                </Card>
              </Link>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-400">
                {FILTER_LABEL_MAP[activeFilter]} 상태의 질문이 없습니다.
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
