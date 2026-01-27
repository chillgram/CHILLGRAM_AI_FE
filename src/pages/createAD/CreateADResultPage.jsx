import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Download,
  FileImage,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Plus,
  Share2,
  Sparkles,
  Video,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

const TYPE_CONFIG = {
  product: { label: "제품 이미지", icon: ImageIcon },
  package: { label: "패키지 시안", icon: Layers },
  sns: { label: "SNS 이미지", icon: Share2 },
  shorts: { label: "숏츠", icon: Video },
  banner: { label: "배너", icon: Megaphone },
};

const TYPE_TITLES = {
  product: "제품 이미지 AI",
  package: "패키지 시안 AI",
  sns: "SNS 이미지 AI",
  shorts: "숏츠 AI",
  banner: "배너 이미지 AI",
};

const DUMMY_RESULTS = [
  {
    id: "p-1",
    type: "product",
    title: "프리미엄 초콜릿 제품 이미지",
    description: "고급스러운 분위기의 제품 사진",
    size: "1080 x 1080",
    format: "PNG",
  },
  {
    id: "p-2",
    type: "product",
    title: "제품 클로즈업 샷",
    description: "디테일을 강조한 제품 사진",
    size: "1200 x 900",
    format: "PNG",
  },
  {
    id: "pkg-1",
    type: "package",
    title: "패키지 시안 A",
    description: "미니멀 톤 패키지 디자인",
    size: "1200 x 900",
    format: "JPG",
  },
  {
    id: "sns-1",
    type: "sns",
    title: "SNS 피드 이미지 1",
    description: "시선을 끄는 문구 강조",
    size: "1080 x 1350",
    format: "PNG",
  },
  {
    id: "sns-2",
    type: "sns",
    title: "SNS 피드 이미지 2",
    description: "트렌디한 컬러 포인트",
    size: "1080 x 1350",
    format: "PNG",
  },
  {
    id: "shorts-1",
    type: "shorts",
    title: "숏츠 컷 1",
    description: "인트로 텍스트 장면",
    size: "1080 x 1920",
    format: "MP4",
  },
  {
    id: "banner-1",
    type: "banner",
    title: "배너 이미지",
    description: "광고 배너용 와이드 컷",
    size: "1200 x 628",
    format: "PNG",
  },
];

export default function CreateADResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTypes = location.state?.selectedTypes ?? [];
  const [activeFilter, setActiveFilter] = useState("all");

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
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#3b312b]">광고 콘텐츠 생성 결과</h1>
            <p className="mt-2 text-sm font-medium text-[#9CA3AF]">
              AI가 생성한 다양한 광고 콘텐츠를 확인하세요.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/createAD")}
            className="flex items-center gap-2 rounded-2xl bg-[#5BF22F] px-5 py-3 text-sm font-black text-black shadow-sm hover:brightness-95"
          >
            <Plus className="h-4 w-4" /> 새 광고 생성
          </button>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
          <BadgeCheck className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-bold">광고 생성 완료!</p>
            <p className="mt-1 text-xs text-green-700/80">
              총 {stats.total}개의 콘텐츠가 생성되었습니다. 1개씩 확인해보세요.
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-6">
          <StatCard label="전체" value={stats.total} icon={Sparkles} />
          <StatCard label="제품 이미지" value={stats.product} icon={ImageIcon} />
          <StatCard label="패키지 시안" value={stats.package} icon={Layers} />
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredResults.map((item) => {
            const Icon = TYPE_CONFIG[item.type].icon;
            return (
              <Card key={item.id} className="overflow-hidden border-gray-200 shadow-sm">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] flex items-center justify-center">
                  <FileImage className="h-10 w-10 text-gray-300" />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between text-xs text-[#9CA3AF]">
                    <span className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-[#6B7280]">
                      <Icon className="h-3 w-3" /> {TYPE_CONFIG[item.type].label}
                    </span>
                    <span className="font-semibold">{item.format}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111827]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#9CA3AF]">
                    <span>{item.size}</span>
                    <span>2024-01-25 14:30</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-[#6B7280] hover:bg-gray-50">
                      <Download className="h-4 w-4" /> 다운로드
                    </button>
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-[#6B7280] hover:bg-gray-50">
                      <Share2 className="h-4 w-4" /> 공유
                    </button>
                    <button className="ml-auto flex items-center gap-2 rounded-xl bg-[#5BF22F] px-3 py-2 text-xs font-black text-black hover:brightness-95">
                      <Sparkles className="h-4 w-4" /> 다운로드
                    </button>
                  </div>
                </div>
              </Card>
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

