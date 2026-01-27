import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Eye,
  Heart,
  Share2,
  Calendar,
  Download,
  Video,
  Instagram,
} from "lucide-react";

import Container from "../components/common/Container";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function ProductAdStatusPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");

  const productHeaders = {
    1: { name: "프리미엄 초콜릿", sub: "초콜릿 • 생성된 광고 콘텐츠" },
    2: { name: "유기농 쿠키", sub: "베이커리 • 생성된 광고 콘텐츠" },
    3: { name: "과일 캔디", sub: "디저트 • 생성된 광고 콘텐츠" },
  };

  const currentHeader = productHeaders[productId] || productHeaders["1"];

  const stats = [
    {
      title: "전체 광고",
      value: "3",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "총 조회수",
      value: "53,400",
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "총 좋아요",
      value: "2,921",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "총 공유수",
      value: "846",
      icon: Share2,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  const adCards = [
    {
      id: 1,
      tag: "발렌타인데이",
      status: "게시 중",
      title: "발렌타인 특별 프로모션",
      desc: "사랑하는 사람에게 프리미엄 초콜릿으로 특별한 마음을 전하세요 벨기에 카카오 70% 함유로 진한 풍미를 느껴보세요.",
      date: "2024-01-20",
      views: "15,200",
      likes: "856",
      shares: "234",
      platform: "Instagram",
      image:
        "https://images.unsplash.com/photo-1549007994-cb92ca71450a?q=80&w=800",
    },
    {
      id: 2,
      tag: "건강한 간식",
      status: "게시 중",
      title: "건강한 디저트 트렌드",
      desc: "죄책감 없는 달콤함! 카카오 70% 고함량으로 건강까지 챙기는 프리미엄 초콜릿",
      date: "2024-01-18",
      views: "28,400",
      likes: "1,523",
      shares: "445",
      platform: "Video",
      isVideo: true,
    },
    {
      id: 3,
      tag: "프리미엄 선물",
      status: "임시저장",
      title: "럭셔리 선물 추천",
      desc: "특별한 날, 특별한 선물 벨기에 정통 초콜릿으로 고급스러운 순간을 선사하세요.",
      date: "2024-01-15",
      views: "9,800",
      likes: "542",
      shares: "167",
      platform: "Instagram",
      image:
        "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <Container>
        <div className="flex justify-between items-end mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-4 transition-colors"
            >
              <ArrowLeft size={18} /> 이전으로
            </button>

            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {currentHeader.name}
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              {currentHeader.sub}
            </p>
          </div>
          <button className="bg-[#5BF22F] text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
            새 광고 만들기
          </button>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-gray-500 font-bold text-sm tracking-tight">
                  {stat.title}
                </span>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-8">
          {["전체 (3)", "게시 중 (2)", "임시저장 (1)", "보관됨 (0)"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.split(" ")[0])}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  tab.includes(activeTab)
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* 광고 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adCards.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
            >
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {ad.isVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Video size={48} className="text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black text-gray-800 flex items-center gap-1 shadow-sm">
                  {ad.platform === "Video" ? (
                    <Video size={12} />
                  ) : (
                    <Instagram size={12} />
                  )}
                  {ad.platform}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-gray-50 text-gray-400 text-[10px] font-black px-2 py-1 rounded border border-gray-100">
                    {ad.tag}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded ${
                      ad.status === "게시 중"
                        ? "bg-green-50 text-green-500"
                        : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    {ad.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {ad.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {ad.desc}
                </p>

                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-6">
                  <Calendar size={14} /> {ad.date}
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-6 mb-6">
                  <MetricItem label="조회수" value={ad.views} icon={Eye} />
                  <MetricItem label="좋아요" value={ad.likes} icon={Heart} />
                  <MetricItem label="공유" value={ad.shares} icon={Share2} />
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl text-xs font-black text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <Eye size={14} /> 상세보기
                  </button>
                  <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all border border-gray-100">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function MetricItem({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm font-black text-gray-900">{value}</div>
      <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 text-center">
        {Icon && <Icon size={10} />} {label}
      </div>
    </div>
  );
}
