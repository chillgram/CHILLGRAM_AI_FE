import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share2,
  Download,
  Image as ImageIcon,
  Video,
  FileText,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function ProjectAdDetail() {
  const { productId, projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");

  // 더미 데이터
  const campaignInfo = {
    title: "발렌타인데이 캠페인",
    desc: "프로젝트에서 생성된 모든 광고 콘텐츠",
  };

  const stats = [
    {
      label: "총 콘텐츠",
      value: "5",
      icon: LayoutGrid,
      color: "text-blue-500",
    },
    { label: "총 조회수", value: "98,000", icon: Eye, color: "text-green-500" },
    {
      label: "총 좋아요",
      value: "5,523",
      icon: ThumbsUp,
      color: "text-purple-500",
    },
    {
      label: "총 공유",
      value: "1,569",
      icon: Share2,
      color: "text-orange-500",
    },
  ];

  const contents = [
    {
      id: 1,
      type: "image",
      platform: "Instagram",
      status: "활성",
      title: "발렌타인 특별 프로모션",
      date: "2024-01-20",
      desc: "사랑하는 사람에게 프리미엄 초콜릿으로 특별한 마음을 전하세요 💝 벨기에산 카카오 70% 함유로 진한 풍미를 느껴보세요!",
      trend: "발렌타인데이",
      stats: { view: "15,200", like: "856", share: "234" },
      color: "bg-[#3E2723]", // 나중에는 url
    },
    {
      id: 2,
      type: "video",
      platform: "Facebook",
      status: "활성",
      title: "건강한 디저트 트렌드",
      date: "2024-01-18",
      desc: "죄책감 없는 달콤함! 🍫 카카오 70% 고함량으로 건강까지 챙기는 프리미엄 초콜릿",
      trend: "건강한 간식",
      stats: { view: "28,400", like: "1,523", share: "445" },
      color: "bg-[#1A237E]",
    },
    {
      id: 3,
      type: "image",
      platform: "Instagram",
      status: "임시저장",
      title: "럭셔리 선물 추천",
      date: "2024-01-15",
      desc: "특별한 날, 특별한 선물 🎁 벨기에 정통 초콜릿으로 고급스러운 순간을 선사하세요",
      trend: "프리미엄 선물",
      stats: { view: "9,800", like: "567", share: "123" },
      color: "bg-[#4E342E]",
    },
    {
      id: 4,
      type: "image",
      platform: "Instagram",
      status: "활성",
      title: "SNS 인기 급상승",
      date: "2024-01-12",
      desc: "요즘 핫한 프리미엄 초콜릿 🔥 인스타그램에서 화제의 그 초콜릿!",
      trend: "SNS 트렌드",
      stats: { view: "32,100", like: "2,145", share: "678" },
      color: "bg-[#5D4037]",
    },
    {
      id: 5,
      type: "text",
      platform: "Facebook",
      status: "보관됨",
      title: "카카오의 깊은 맛",
      date: "2024-01-10",
      desc: "진짜 초콜릿의 맛을 찾으시나요? 벨기에 장인이 만든 프리미엄 초콜릿으로 특별한 경험을 해보세요.",
      trend: "프리미엄 식품",
      stats: { view: "12,500", like: "432", share: "89" },
      color: "bg-[#F3E5F5]",
    },
  ];

  // 탭 필터링
  const filteredContents = contents.filter((item) => {
    if (activeTab === "전체") return true;
    return item.status === activeTab;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "활성":
        return "bg-green-100 text-green-600";
      case "임시저장":
        return "bg-yellow-100 text-yellow-600";
      case "보관됨":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getPlatformBadgeStyle = (platform) => {
    return platform === "Instagram"
      ? "bg-pink-50 text-pink-600"
      : "bg-blue-50 text-blue-600";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon size={14} />;
      case "video":
        return <Video size={14} />;
      case "text":
        return <FileText size={14} />;
      default:
        return <ImageIcon size={14} />;
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
            <ArrowLeft size={20} /> 프로젝트 목록으로
          </Button>
        </div>

        {/* 헤더 타이틀 */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#111827] mb-2 tracking-tight">
            {campaignInfo.title}
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            {campaignInfo.desc}
          </p>
        </div>

        {/* 상단 통계 카드 (4개) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8">
          {["전체 (5)", "활성 (3)", "임시저장 (1)", "보관됨 (1)"].map((tab) => {
            const tabName = tab.split(" ")[0];
            const isActive = activeTab === tabName;

            return (
              <Button
                key={tab}
                variant={isActive ? "primary" : "ghost"}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  isActive
                    ? "bg-[#111827] border-[#111827] text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        {/* 콘텐츠 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContents.map((content) => (
            <Card
              key={content.id}
              className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* 카드 상단 이미지 영역 */}
              <div
                className={`h-48 w-full ${content.color} relative flex items-center justify-center`}
              >
                {content.type === "video" && (
                  <Video size={48} className="text-white/50" />
                )}
                {content.type === "image" && (
                  <ImageIcon size={48} className="text-white/30" />
                )}
                {content.type === "text" && (
                  <FileText size={48} className="text-gray-400/50" />
                )}
              </div>

              {/* 카드 본문 */}
              <div className="p-6">
                {/* 뱃지 영역 */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {getTypeIcon(content.type)} {content.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${getPlatformBadgeStyle(content.platform)}`}
                    >
                      {content.platform}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusBadgeStyle(content.status)}`}
                  >
                    {content.status}
                  </span>
                </div>

                {/* 타이틀 & 날짜 */}
                <div className="mb-4">
                  <h3 className="text-lg font-black text-[#111827] mb-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {content.title}
                  </h3>
                  <div className="text-xs text-gray-400 font-medium">
                    <Calendar size={12} className="inline mr-1" />
                    {content.date}
                  </div>
                </div>

                {/* 설명글 */}
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 min-h-[60px]">
                  {content.desc}
                </p>

                {/* 트렌드 태그 */}
                <div className="text-xs font-bold text-orange-500 mb-6 flex items-center gap-1">
                  <span className="text-[10px]">↗</span> {content.trend}
                </div>

                {/* 통계 수치 */}
                <div className="flex justify-between items-center py-4 border-t border-b border-gray-50 mb-4">
                  <div className="text-center w-1/3 border-r border-gray-50 last:border-0">
                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center gap-1">
                      <Eye size={10} /> 조회
                    </div>
                    <div className="font-bold text-sm text-[#111827]">
                      {content.stats.view}
                    </div>
                  </div>
                  <div className="text-center w-1/3 border-r border-gray-50 last:border-0">
                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center gap-1">
                      <ThumbsUp size={10} /> 좋아요
                    </div>
                    <div className="font-bold text-sm text-[#111827]">
                      {content.stats.like}
                    </div>
                  </div>
                  <div className="text-center w-1/3">
                    <div className="text-[10px] text-gray-400 mb-1 flex justify-center items-center gap-1">
                      <Share2 size={10} /> 공유
                    </div>
                    <div className="font-bold text-sm text-[#111827]">
                      {content.stats.share}
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Eye size={14} /> 상세
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Download size={14} /> 다운로드
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
