import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  ArrowLeft,
  Eye,
  Download,
  Image as ImageIcon,
  Calendar,
  LayoutGrid,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchProjectContents } from "@/services/api/projectApi";
import { fetchProduct } from "@/services/api/productApi";
import { fetchJob } from "@/services/api/ad";

export default function ProjectDesignDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, projectId } = useParams();

  // 제품 정보 조회
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  // 로컬 스토리지에서 이 프로젝트와 관련된 모든 jobId 가져오기
  const storageKey = `cg_jobs_${projectId}`;
  const jobIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

  // 여러 개의 잡 상태를 동시에 폴링
  const jobQueries = useQueries({
    queries: jobIds.map((id) => ({
      queryKey: ["job", id],
      queryFn: () => fetchJob(id),
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === "SUCCEEDED" || status === "FAILED") return false;
        return 3000;
      },
    })),
  });

  // 프로젝트 콘텐츠 조회 (DB에 저장된 것들)
  const {
    data: savedContents = [],
    isLoading,
    refetch: refetchContents,
  } = useQuery({
    queryKey: ["project-contents", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await fetchProjectContents(projectId);
      const contents = Array.isArray(res) ? res : res.contents || [];

      return contents.map((c) => ({
        id: c.id || c.contentId,
        status: "활성",
        title: c.title || `${product?.name || "제품"} 패키지 도안`,
        date: (c.createdAt || "").substring(0, 10),
        url: c.url || c.fileUrl,
      }));
    },
    enabled: !!projectId && !!product,
  });

  // 폴링 결과와 기존 DB 데이터를 합치기
  const projectContents = [...savedContents];

  // 각 잡의 결과를 리스트에 동적으로 추가
  jobQueries.forEach((q) => {
    const job = q.data;
    if (!job) return;

    if (job.status === "SUCCEEDED" && job.outputUri) {
      // 이미 DB에 있는 URL인지 체크 (중복 방지)
      const exists = savedContents.some((c) => c.url === job.outputUri);
      if (!exists) {
        projectContents.unshift({
          id: `job-${job.jobId}`,
          status: "활성",
          title: `${product?.name || "제품"} 패키지 도안 (방금 생성됨)`,
          date: new Date().toISOString().substring(0, 10),
          url: job.outputUri,
          isNew: true,
        });
      }
    } else if (job.status === "REQUESTED" || job.status === "RUNNING") {
      projectContents.unshift({
        id: `job-${job.jobId}`,
        status: "생성중",
        title: "도안 생성 중...",
        date: "-",
        url: null,
        isGenerating: true,
      });
    } else if (job.status === "FAILED") {
      projectContents.unshift({
        id: `job-${job.jobId}`,
        status: "실패",
        title: "생성 실패",
        date: "-",
        url: null,
        isFailed: true,
        errorMessage: job.errorMessage,
      });
    }
  });

  const designInfo = {
    title: product ? `${product.name} 패키지 도안` : "패키지 목업 제작",
    desc: "프로젝트에서 생성된 모든 패키지 도안",
  };

  const stats = [
    {
      label: "총 도안",
      value: projectContents.length.toString(),
      icon: LayoutGrid,
      color: "text-blue-500",
    },
    {
      label: "활성 도안",
      value: projectContents.length.toString(),
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "최근 생성일",
      value: projectContents[0]?.date || "-",
      icon: Calendar,
      color: "text-purple-500",
    },
  ];

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "활성":
        return "bg-green-100 text-green-600";
      case "임시저장":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <Container>
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold px-0 hover:bg-transparent"
          >
            <ArrowLeft size={20} /> 프로젝트관리
          </Button>
        </div>

        {/* 헤더 타이틀 */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#111827] mb-2 tracking-tight">
            {designInfo.title}
          </h1>
          <p className="text-gray-500 text-lg font-medium">{designInfo.desc}</p>
        </div>

        {/* 상단 통계 카드 (3개) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="p-6 flex flex-col justify-between h-32 border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-gray-400">
                  {stat.label}
                </span>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-3xl font-black text-[#111827]">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {/* 도안 카드 그리드 */}
        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-gray-400">
                로딩 중...
              </div>
            ) : projectContents.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400">
                생성된 도안이 없습니다.
              </div>
            ) : (
              projectContents.map((design) => (
                <Card
                  key={design.id}
                  className={`overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow group ${
                    design.isGenerating ? "opacity-90" : ""
                  }`}
                >
                  {/* 카드 상단 이미지 영역 */}
                  <div className="h-48 w-full bg-gray-50 relative overflow-hidden flex items-center justify-center">
                    {design.isGenerating ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          className="animate-spin text-blue-500"
                          size={40}
                        />
                        <p className="text-xs font-bold text-blue-500 animate-pulse">
                          AI 도안 생성 중...
                        </p>
                      </div>
                    ) : design.isFailed ? (
                      <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <AlertCircle className="text-red-400" size={40} />
                        <p className="text-xs font-bold text-red-400">
                          생성 실패
                        </p>
                        <p className="text-[10px] text-gray-400 line-clamp-2">
                          {design.errorMessage}
                        </p>
                      </div>
                    ) : design.url ? (
                      <img
                        src={design.url}
                        alt={design.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-gray-200" />
                    )}

                    {design.isNew && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* 카드 본문 */}
                  <div className="p-6">
                    {/* 상태 뱃지 */}
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          design.isGenerating
                            ? "bg-blue-50 text-blue-500"
                            : design.isFailed
                              ? "bg-red-50 text-red-500"
                              : getStatusBadgeStyle(design.status)
                        }`}
                      >
                        {design.status}
                      </span>
                    </div>

                    {/* 타이틀 & 날짜 */}
                    <div className="mb-4">
                      <h3 className="text-lg font-black text-[#111827] mb-2 group-hover:text-blue-600 transition-colors">
                        {design.title}
                      </h3>
                      <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Calendar size={12} />
                        {design.date}
                      </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        disabled={!design.url}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap disabled:opacity-30"
                        onClick={() => window.open(design.url, "_blank")}
                      >
                        <Eye size={14} /> 상세
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!design.url}
                        className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap disabled:opacity-30"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = design.url;
                          link.download = `${design.title}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download size={14} /> 다운로드
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ErrorBoundary>
      </Container>
    </div>
  );
}
