import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchProjectContentsWithAssets } from "@/services/api/contentApi";
import { fetchJob } from "@/services/api/ad";
import {
  BadgeCheck,
  Download,
  FileImage,
  Image as ImageIcon,
  Megaphone,
  PlusCircle,
  Share2,
  Sparkles,
  Video,
  ArrowLeft,
  LayoutGrid,
  AlertCircle,
  Loader2,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import loadingGif from "@/assets/Loding.gif";
import Button from "../../components/common/Button";

const TYPE_CONFIG = {
  design: { label: "도안", icon: LayoutGrid },
  product: { label: "제품 이미지", icon: ImageIcon },
  sns: { label: "SNS 이미지", icon: Share2 },
  shorts: { label: "숏츠", icon: Video },
  banner: { label: "배너", icon: Megaphone },
};

const TYPE_TITLES = {
  design: "패키지 도안 AI",
  product: "제품 이미지 AI",
  sns: "SNS 이미지 AI",
  shorts: "숏츠 AI",
  banner: "배너 이미지 AI",
};

export default function ADResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, productId } = useParams();

  const [page, setPage] = useState(0);
  const pageSize = 10;

  // 도안 생성을 위한 잡(Job) 추적 로직 (ProjectDesignDetail에서 가져옴)
  const storageKey = `cg_jobs_${projectId}`;
  const jobIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  }, [storageKey]);

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

  // location.state에서 프로젝트 이름 가져오기 (광고 생성 플로우에서 전달)
  const projectName =
    location.state?.projectName || location.state?.title || null;
  const selectedTypes = location.state?.selectedTypes ?? [];
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(0);
  };

  // 프로젝트 상세 모드인지 확인 (projectId가 있으면 상세 모드)
  const isProjectDetailMode = !!projectId;

  // 헤더 제목 결정
  const headerTitle =
    projectName ||
    (isProjectDetailMode ? "프로젝트 상세" : "광고 및 도안 생성 결과");
  const headerDesc = isProjectDetailMode
    ? "프로젝트에서 생성된 모든 광고 및 도안 콘텐츠"
    : "AI가 생성한 다양한 광고 및 도안 콘텐츠를 확인하세요.";

  // 1. 실제 데이터 조회
  const {
    data: realResults = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projectContents", projectId],
    queryFn: () => fetchProjectContentsWithAssets(projectId),
    enabled: !!projectId,
  });

  // 데이터 매핑 (백엔드 -> 프론트엔드 UI 형식)
  const mappedResults = useMemo(() => {
    // 0. 방금 생성된 결과 (location.state)
    const tempResults = [];
    if (location.state?.selectedCopy && location.state?.selectedProductImage) {
      const sc = location.state.selectedCopy;
      const si = location.state.selectedProductImage;
      // 기본적으로 'product' 타입으로 간주 (또는 bannerSize 있으면 banner 등 로직 추가 가능)
      // 여기서는 심플하게 P-Shot 결과로 가정
      tempResults.push({
        id: "temp-new",
        type: "product",
        title: sc.concept || sc.title || "새 광고",
        description: sc.finalCopy || sc.body || "방금 생성된 광고입니다.",
        date: new Date().toISOString().split("T")[0],
        status: "활성", // 이미 생성 완료된 것으로 간주
        platform: "Instagram", // or derived from state
        imageUrl: si.url,
        isNew: true,
        stats: { views: 0, likes: 0, shares: 0 },
      });
    }

    // 1. DB에서 가져온 실제 결과 매핑
    const dbResults = realResults.map((item) => {
      const assets = item.assets || [];
      const primaryAsset =
        assets.find((a) => a.assetType === "PRIMARY") || assets[0] || {};

      const imageUrl =
        primaryAsset.fileUrl || primaryAsset.file_url || primaryAsset.url;
      const thumbUrl = primaryAsset.thumbUrl || primaryAsset.thumb_url;

      let type = "product";
      const contentType = (
        item.contentType ||
        item.content_type ||
        ""
      ).toUpperCase();

      if (contentType === "VIDEO") type = "shorts";
      else if (contentType === "BANNER") type = "banner";
      else if (contentType === "DESIGN") type = "design";
      else if (contentType === "SNS" || item.platform === "Instagram")
        type = "sns";

      return {
        id: item.contentId || item.id,
        type: type,
        title: item.title,
        description: item.body || item.description,
        date: (item.createdAt || item.created_at || "").split("T")[0] || "-",
        status: item.status || "활성",
        platform: item.platform,
        stats: {
          views: item.viewCount ?? item.view_count ?? 0,
          likes: item.likeCount ?? item.like_count ?? 0,
          shares: item.shareCount ?? item.share_count ?? 0,
        },
        imageUrl,
        thumbUrl,
        isGenerating:
          item.status === "GENERATING" ||
          item.status === "DRAFT" ||
          (!imageUrl && item.status !== "ACTIVE"),
      };
    });

    // 2. 현재 폴링 중인 잡(Job) 결과 합치기 (도안 전용)
    const pollingResults = [];
    jobQueries.forEach((q) => {
      const job = q.data;
      if (!job) return;

      // 이미 DB 결과에 포함된 것이라면 패스 (outputUri 등으로 체크 가능하지만 여기선 jobId로 간단히)
      const exists = dbResults.some((c) =>
        String(c.id).includes(String(job.jobId)),
      );
      if (exists) return;

      if (job.status === "SUCCEEDED" && job.outputUri) {
        pollingResults.push({
          id: `job-${job.jobId}`,
          type: "design",
          title: "새로운 패키지 도안",
          description: "방금 생성된 패키지 도안입니다.",
          date: new Date().toISOString().substring(0, 10),
          status: "활성",
          imageUrl: job.outputUri,
          isNew: true,
        });
      } else if (job.status === "REQUESTED" || job.status === "RUNNING") {
        pollingResults.push({
          id: `job-${job.jobId}`,
          type: "design",
          title: "도안 생성 중...",
          description: "AI가 도안을 생성하고 있습니다.",
          date: "-",
          status: "생성중",
          isGenerating: true,
        });
      } else if (job.status === "FAILED") {
        pollingResults.push({
          id: `job-${job.jobId}`,
          type: "design",
          title: "도안 생성 실패",
          description: job.errorMessage || "알 수 없는 오류가 발생했습니다.",
          date: "-",
          status: "실패",
          isFailed: true,
        });
      }
    });

    return [...pollingResults, ...dbResults];
  }, [realResults, jobQueries]);

  const filteredResultsBase = useMemo(() => {
    const base = selectedTypes.length
      ? mappedResults.filter((item) =>
          selectedTypes.includes(TYPE_TITLES[item.type]),
        )
      : mappedResults;

    if (activeFilter === "all") return base;
    return base.filter((item) => item.type === activeFilter);
  }, [activeFilter, selectedTypes, mappedResults]);

  // 페이지네이션 적용
  const totalPages = Math.ceil(filteredResultsBase.length / pageSize) || 1;
  const filteredResults = filteredResultsBase.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );

  const stats = useMemo(() => {
    const base = selectedTypes.length
      ? mappedResults.filter((item) =>
          selectedTypes.includes(TYPE_TITLES[item.type]),
        )
      : mappedResults;

    return Object.keys(TYPE_CONFIG).reduce(
      (acc, key) => {
        acc[key] = base.filter((item) => item.type === key).length;
        return acc;
      },
      { total: base.length },
    );
  }, [selectedTypes, mappedResults]);

  return (
    <div className="min-h-full bg-[#F9FAFB] py-12">
      <Container className="max-w-6xl">
        {/* 뒤로가기 버튼 (프로젝트 상세 모드일 때만) */}
        {isProjectDetailMode && (
          <div className="mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <ArrowLeft size={20} /> 프로젝트 목록
            </Button>
          </div>
        )}

        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">
              {headerTitle}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#9CA3AF]">
              {headerDesc}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/products/${productId}/addPackage?projectId=${projectId}`,
                )
              }
              variant="secondary"
              className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all active:scale-95 text-sm"
            >
              <LayoutGrid className="h-4 w-4" /> 도안 생성
            </Button>
            {/* 새 광고 생성 버튼 */}
            <Button
              onClick={() =>
                navigate(
                  isProjectDetailMode
                    ? `/dashboard/products/${productId}/addAD`
                    : "./../",
                )
              }
              variant="primary"
              className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
            >
              <PlusCircle className="h-4 w-4" />{" "}
              {isProjectDetailMode ? "광고 생성" : "새 광고 생성"}
            </Button>
          </div>
        </div>

        {/* 광고 생성 완료 배너 (프로젝트 상세에서는 숨김) */}
        {!isProjectDetailMode && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            <BadgeCheck className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-bold">광고 생성 완료!</p>
              <p className="mt-1 text-xs text-green-700/80">
                총 {stats.total}개의 콘텐츠가 생성되었습니다. 1개씩
                확인해보세요.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="전체" value={stats.total} icon={Sparkles} />
          <StatCard label="도안" value={stats.design} icon={LayoutGrid} />
          <StatCard
            label="제품 이미지"
            value={stats.product}
            icon={ImageIcon}
          />
          <StatCard label="SNS 이미지" value={stats.sns} icon={Share2} />
          <StatCard label="숏츠" value={stats.shorts} icon={Video} />
          <StatCard label="배너" value={stats.banner} icon={Megaphone} />
        </div>

        {/* 결과 섹션 (탭 + 그리드) */}
        <div className="bg-white rounded-3xl border border-gray-300 shadow-sm p-8">
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterChip
              active={activeFilter === "all"}
              onClick={() => handleFilterChange("all")}
              label={`전체 (${stats.total})`}
            />
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <FilterChip
                key={key}
                active={activeFilter === key}
                onClick={() => handleFilterChange(key)}
                label={`${config.label} (${stats[key]})`}
              />
            ))}
          </div>

          {/* 데이터 매핑 (백엔드 -> 프론트엔드 UI 형식) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
            {filteredResults.map((item) => {
              const Icon = TYPE_CONFIG[item.type].icon;
              const isSnsOrShorts =
                item.type === "sns" || item.type === "shorts";
              const isVideo = item.type === "shorts";

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full flex flex-col"
                >
                  {/* 이미지/영상 영역 */}
                  <div
                    className={`aspect-4/3 w-full flex items-center justify-center relative overflow-hidden ${
                      isVideo
                        ? "bg-gray-800"
                        : "bg-linear-to-br from-[#F9FAFB] to-[#E5E7EB]"
                    }`}
                  >
                    {item.isGenerating ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="mt-2 text-sm font-bold text-blue-500 animate-pulse">
                          {item.type === "design"
                            ? "AI 도안 생성 중..."
                            : "AI 콘텐츠 생성 중..."}
                        </p>
                        {!isVideo && (
                          <p className="mt-1 text-[10px] text-gray-400">
                            잠시만 기다려 주세요.
                          </p>
                        )}
                        {isVideo && (
                          <p className="text-[10px] text-gray-500">
                            (최대 10분)
                          </p>
                        )}
                      </div>
                    ) : item.isFailed ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="h-10 w-10 text-red-400" />
                        <p className="mt-2 text-sm font-bold text-red-400">
                          생성 실패
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    ) : item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : isVideo ? (
                      <Video className="h-12 w-12 text-gray-400" />
                    ) : (
                      <FileImage className="h-10 w-10 text-gray-300" />
                    )}

                    {item.isNew && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* 컨텐츠 영역 */}
                  <div className="p-5 grow flex flex-col">
                    {/* 배지 행 */}
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-[#6B7280]">
                        <Icon className="h-3 w-3" />{" "}
                        {TYPE_CONFIG[item.type].label}
                      </span>
                      {item.platform && (
                        <span
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                            item.platform === "Instagram"
                              ? "bg-linear-to-r from-pink-100 to-purple-100 text-pink-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.platform === "Instagram" ? "📷" : "▶️"}{" "}
                          {item.platform}
                        </span>
                      )}
                      <span className="ml-auto rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-600">
                        {item.status}
                      </span>
                    </div>

                    {/* 타이틀 */}
                    <h3 className="text-lg font-black text-[#111827]">
                      {item.title}
                    </h3>

                    {/* 날짜 */}
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                      📅 {item.date}
                    </p>

                    {/* 설명 */}
                    <p className="mt-2 text-sm text-teal-600">
                      {item.description}
                    </p>

                    {/* SNS/Shorts 통계 */}
                    {isSnsOrShorts && item.stats && (
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
                        <div className="text-center">
                          <p className="text-base font-black text-gray-800">
                            {item.stats.views.toLocaleString()}
                          </p>
                          <p className="text-gray-400">조회</p>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-black text-gray-800">
                            {item.stats.likes.toLocaleString()}
                          </p>
                          <p className="text-gray-400">좋아요</p>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-black text-gray-800">
                            {item.stats.shares.toLocaleString()}
                          </p>
                          <p className="text-gray-400">공유</p>
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="mt-auto pt-4 flex items-center gap-2">
                      {isSnsOrShorts ? (
                        <>
                          <button
                            onClick={() =>
                              navigate("/dashboard/sns", {
                                state: { uploadContent: item },
                              })
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                          >
                            업로드
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = item.imageUrl;
                              link.download = `${item.title}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                            disabled={!item.imageUrl}
                          >
                            <Download className="h-4 w-4" /> 다운로드
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              if (item.imageUrl)
                                window.open(item.imageUrl, "_blank");
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                            disabled={!item.imageUrl}
                          >
                            상세
                          </button>
                          <button
                            onClick={() => {
                              if (item.imageUrl) {
                                const link = document.createElement("a");
                                link.href = item.imageUrl;
                                link.download = `${item.title}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                            disabled={!item.imageUrl}
                          >
                            <Download className="h-4 w-4" /> 다운로드
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 빈 슬롯 채우기 (항상 10개 카드 높이 유지) */}
            {!isLoading &&
              !isError &&
              Array.from({
                length: Math.max(0, pageSize - filteredResults.length),
              }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 h-[500px] flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-gray-300 text-sm font-bold">
                      {filteredResultsBase.length === 0 && i === 4
                        ? "생성된 콘텐츠가 없습니다."
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* 페이지네이션 UI */}
          {!isLoading && !isError && filteredResultsBase.length > 0 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    i === page
                      ? "bg-[#60A5FA] text-white shadow-blue-500/20"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card className="relative bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 h-24 p-4 flex flex-col justify-end overflow-hidden group">
      {Icon && (
        <div className="absolute top-3 right-3 p-1.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
          <Icon size={16} className="text-blue-400" strokeWidth={2.5} />
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-[12px] font-bold text-gray-400 mb-0.5 leading-tight tracking-tight whitespace-nowrap">
          {label}
        </span>
        <p className="text-2xl font-black text-[#111827] tabular-nums leading-none">
          {value}
        </p>
      </div>
    </Card>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? "bg-white text-[#111827] shadow-md"
          : "bg-gray-100 text-[#9CA3AF] hover:text-[#111827]"
      }`}
    >
      {label}
    </button>
  );
}
