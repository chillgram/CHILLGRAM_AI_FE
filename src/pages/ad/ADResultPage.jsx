import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  Download,
  FileImage,
  Image as ImageIcon,
  Layers,
  Megaphone,
  PlusCircle,
  Share2,
  Sparkles,
  Video,
  ArrowLeft,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import loadingGif from "@/assets/Loding.gif";

const TYPE_CONFIG = {
  product: { label: "제품 이미지", icon: ImageIcon },
  sns: { label: "SNS 이미지", icon: Share2 },
  shorts: { label: "숏츠", icon: Video },
  banner: { label: "배너", icon: Megaphone },
};

const TYPE_TITLES = {
  product: "제품 이미지 AI",
  sns: "SNS 이미지 AI",
  shorts: "숏츠 AI",
  banner: "배너 이미지 AI",
};

const DUMMY_RESULTS = [
  {
    id: "p-1",
    type: "product",
    title: "프리미엄 초콜릿 제품 이미지",
    description: "고급스러운 촬영 및 제품 소개 사진",
    size: "1080 x 1080",
    format: "PNG",
    date: "2024-01-20",
    status: "활성",
  },
  {
    id: "p-2",
    type: "product",
    title: "제품 클로즈업 샷",
    description: "디테일을 강조한 제품 사진",
    size: "1200 x 900",
    format: "PNG",
    date: "2024-01-20",
    status: "활성",
  },
  {
    id: "sns-1",
    type: "sns",
    title: "인스타그램 #두쫀쿠 이미지",
    description: "감성적인 스타일링 SNS 이미지",
    size: "1080 x 1350",
    format: "PNG",
    date: "2024-01-20",
    status: "활성",
    platform: "Instagram",
    stats: { views: 15200, likes: 856, shares: 234 },
  },
  {
    id: "sns-2",
    type: "sns",
    title: "SNS 피드 이미지 2",
    description: "트렌디한 컬러 포인트",
    size: "1080 x 1350",
    format: "PNG",
    date: "2024-01-18",
    status: "활성",
    platform: "Instagram",
    stats: { views: 8400, likes: 423, shares: 89 },
  },
  {
    id: "shorts-1",
    type: "shorts",
    title: "유튜브 쇼츠 영상",
    description: "30초 감각적인 초콜릿 언박싱 쇼츠",
    size: "1080 x 1920",
    format: "MP4",
    date: "2024-01-18",
    status: "생성중",
    platform: "YouTube",
    stats: { views: 28400, likes: 1523, shares: 445 },
    isGenerating: true, // 영상 생성 중 상태
  },
  {
    id: "banner-1",
    type: "banner",
    title: "배너 이미지",
    description: "광고 배너용 와이드 컷",
    size: "1200 x 628",
    format: "PNG",
    date: "2024-01-15",
    status: "활성",
  },
];

export default function ADResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, productId } = useParams();

  // location.state에서 프로젝트 이름 가져오기 (광고 생성 플로우에서 전달)
  const projectName = location.state?.projectName || location.state?.title || null;
  const selectedTypes = location.state?.selectedTypes ?? [];
  const [activeFilter, setActiveFilter] = useState("all");

  // 프로젝트 상세 모드인지 확인 (projectId가 있으면 상세 모드)
  const isProjectDetailMode = !!projectId;

  // 헤더 제목 결정
  const headerTitle = projectName || (isProjectDetailMode ? "프로젝트 상세" : "광고 콘텐츠 생성 결과");
  const headerDesc = isProjectDetailMode
    ? "프로젝트에서 생성된 모든 광고 콘텐츠"
    : "AI가 생성한 다양한 광고 콘텐츠를 확인하세요.";

  const filteredResults = useMemo(() => {
    const base = selectedTypes.length
      ? DUMMY_RESULTS.filter((item) => selectedTypes.includes(TYPE_TITLES[item.type]))
      : DUMMY_RESULTS;

    if (activeFilter === "all") return base;
    return base.filter((item) => item.type === activeFilter);
  }, [activeFilter, selectedTypes]);

  const stats = useMemo(() => {
    const base = selectedTypes.length
      ? DUMMY_RESULTS.filter((item) => selectedTypes.includes(TYPE_TITLES[item.type]))
      : DUMMY_RESULTS;

    return Object.keys(TYPE_CONFIG).reduce(
      (acc, key) => {
        acc[key] = base.filter((item) => item.type === key).length;
        return acc;
      },
      { total: base.length },
    );
  }, [selectedTypes]);

  return (
    <div className="min-h-full bg-[#F9FAFB] py-12">
      <Container>
        {/* 뒤로가기 버튼 (프로젝트 상세 모드일 때만) */}
        {isProjectDetailMode && (
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold px-0 hover:bg-transparent transition-colors"
            >
              <ArrowLeft size={20} /> 프로젝트 목록으로
            </button>
          </div>
        )}

        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">{headerTitle}</h1>
            <p className="mt-2 text-sm font-medium text-[#9CA3AF]">
              {headerDesc}
            </p>
          </div>
          {/* 새 광고 생성 버튼 */}
          <button
            onClick={() =>
              navigate(
                isProjectDetailMode
                  ? `/dashboard/products/${productId}/addAD`
                  : "./../"
              )
            }
            className="bg-[#60A5FA] hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
          >
            <PlusCircle className="h-4 w-4 text-white" />{" "}
            {isProjectDetailMode ? "광고 생성" : "새 광고 생성"}
          </button>
        </div>

        {/* 광고 생성 완료 배너 (프로젝트 상세에서는 숨김) */}
        {!isProjectDetailMode && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            <BadgeCheck className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-bold">광고 생성 완료!</p>
              <p className="mt-1 text-xs text-green-700/80">
                총 {stats.total}개의 콘텐츠가 생성되었습니다. 1개씩 확인해보세요.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="전체" value={stats.total} icon={Sparkles} />
          <StatCard label="제품 이미지" value={stats.product} icon={ImageIcon} />
          <StatCard label="SNS 이미지" value={stats.sns} icon={Share2} />
          <StatCard label="숏츠" value={stats.shorts} icon={Video} />
          <StatCard label="배너" value={stats.banner} icon={Megaphone} />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            label={`전체 (${stats.total})`}
          />
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <FilterChip
              key={key}
              active={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              label={`${config.label} (${stats[key]})`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
          {filteredResults.map((item) => {
            const Icon = TYPE_CONFIG[item.type].icon;
            const isSnsOrShorts = item.type === "sns" || item.type === "shorts";
            const isVideo = item.type === "shorts";

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full flex flex-col"
              >
                {/* 이미지/영상 영역 */}
                <div
                  className={`aspect-[4/3] w-full flex items-center justify-center ${isVideo
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]"
                    }`}
                >
                  {item.isGenerating ? (
                    // 생성 중일 때 로딩 GIF 표시
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={loadingGif}
                        alt="생성 중..."
                        className="w-24 h-24 animate-spin"
                        style={{ mixBlendMode: "screen" }}
                      />
                      <p className="mt-2 text-sm font-bold text-gray-400">영상 생성 중...</p>
                      <p className="text-xs text-gray-500">(최대 10분)</p>
                    </div>
                  ) : isVideo ? (
                    <Video className="h-12 w-12 text-gray-400" />
                  ) : (
                    <FileImage className="h-10 w-10 text-gray-300" />
                  )}
                </div>

                {/* 컨텐츠 영역 */}
                <div className="p-5 flex-grow flex flex-col">
                  {/* 배지 행 */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-[#6B7280]">
                      <Icon className="h-3 w-3" /> {TYPE_CONFIG[item.type].label}
                    </span>
                    {item.platform && (
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${item.platform === "Instagram"
                          ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {item.platform === "Instagram" ? "📷" : "▶️"} {item.platform}
                      </span>
                    )}
                    <span className="ml-auto rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-600">
                      {item.status}
                    </span>
                  </div>

                  {/* 타이틀 */}
                  <h3 className="text-lg font-black text-[#111827]">{item.title}</h3>

                  {/* 날짜 */}
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                    📅 {item.date}
                  </p>

                  {/* 설명 */}
                  <p className="mt-2 text-sm text-teal-600">{item.description}</p>

                  {/* SNS/Shorts 통계 */}
                  {isSnsOrShorts && item.stats && (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-800">
                          {item.stats.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">조회</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-800">
                          {item.stats.likes.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">좋아요</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-800">
                          {item.stats.shares.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">공유</p>
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
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                        >
                          업로드
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                          <Download className="h-4 w-4" /> 다운로드
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                          상세
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                          <Download className="h-4 w-4" /> 다운로드
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <div className="flex h-24 flex-col items-center justify-center gap-2 px-3 py-3 text-center">
        <div className="flex items-center gap-2 text-base font-bold text-[#9CA3AF]">
          {Icon && <Icon className="h-5 w-5 text-[#9CA3AF]" />}
          <span className="whitespace-nowrap">{label}</span>
        </div>
        <p className="text-4xl font-black text-[#111827]">{value}</p>
      </div>
    </Card>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${active
        ? "bg-white text-[#111827] shadow-md"
        : "bg-gray-100 text-[#9CA3AF] hover:text-[#111827]"
        }`}
    >
      {label}
    </button>
  );
}

