import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Heart,
  BarChart2,
  Plus,
  X,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";

import Container from "../components/common/Container";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Field } from "../components/common/Field";
import { PrimaryButton } from "../components/common/PrimaryButton";

export default function SnsManagementPage() {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      title: "예약된 게시물",
      value: "1",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "발행된 게시물",
      value: "2",
      icon: TrendingUp,
      color: "text-green-500",
    },
    { title: "총 참여도", value: "315", icon: Heart, color: "text-red-500" },
    {
      title: "평균 참여율",
      value: "158",
      icon: BarChart2,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-full bg-[#F5F7FA] py-12">
      <Container>
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#111827] mb-3">
              SNS 관리
            </h1>
            <p className="text-lg text-[#9CA3AF] font-medium">
              게시물을 예약하고 성과를 분석하세요
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5BF22F] hover:brightness-95 text-black px-6 py-4 rounded-2xl flex items-center gap-2 font-black text-lg shadow-sm transition-all"
          >
            <Plus size={24} strokeWidth={3} /> 게시물 예약
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="flex h-44 flex-col justify-between border-gray-200"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-[#9CA3AF]">
                  {stat.title}
                </span>
                <stat.icon size={22} className={stat.color} strokeWidth={2.5} />
              </div>
              <div className="text-4xl font-black text-[#111827]">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
          {["scheduled", "published", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-white shadow-md text-[#111827]"
                  : "text-[#9CA3AF] hover:text-[#111827]"
              }`}
            >
              {tab === "scheduled"
                ? "예약된 게시물"
                : tab === "published"
                  ? "발행된 게시물"
                  : "성과 분석"}
            </button>
          ))}
        </div>

        <Card className="min-h-125 border-gray-200 p-10">
          {activeTab === "scheduled" && <ScheduledSection />}
          {activeTab === "published" && <PublishedSection />}
          {activeTab === "analytics" && <AnalyticsSection />}
        </Card>
      </Container>

      {isModalOpen && <ScheduleModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function ScheduleModal({ onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-4xl w-full max-w-lg p-10 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-black"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-black text-[#111827] mb-2">게시물 예약</h2>
        <p className="text-[#9CA3AF] font-medium mb-10">
          SNS 게시물을 예약 등록하세요
        </p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-[#111827] mb-4">
              플랫폼
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: "instagram", icon: Instagram },
                { id: "facebook", icon: Facebook },
                { id: "twitter", icon: Twitter },
                { id: "youtube", icon: Youtube },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex justify-center p-4 rounded-2xl border-2 transition-all ${
                    selectedPlatform === p.id
                      ? "border-[#5BF22F] bg-[#5BF22F]/10 text-[#5BF22F]"
                      : "border-gray-100 text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p.icon size={24} strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-lg font-semibold text-black">콘텐츠</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시할 내용을 입력하세요..."
              className="h-40 w-full rounded-lg px-6 py-4 text-lg outline-none ring-0 bg-[#E9FBE4] focus:ring-2 focus:ring-[#66FF2A] transition-all resize-none"
            />
          </div>

          <Field
            label="예약 시간"
            type="datetime-local"
            value={time}
            onChange={setTime}
          />

          <div className="flex gap-4 pt-4">
            <Button
              variant="secondary"
              className="flex-1 h-16! rounded-lg font-bold text-lg"
              onClick={onClose}
            >
              취소
            </Button>
            <PrimaryButton
              className="flex-1 mt-0!"
              onClick={() => {
                alert("게시물이 예약되었습니다!");
                onClose();
              }}
            >
              예약하기
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const ScheduledSection = () => (
  <div>
    <h3 className="text-2xl font-black mb-2">예약된 게시물</h3>
    <p className="text-[#9CA3AF] font-medium mb-8">
      예약 대기 중인 SNS 게시물 목록
    </p>
    <div className="bg-[#F9FAFB] border border-gray-200 rounded-3xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
          <Instagram size={32} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              Instagram
            </span>
            <span className="text-sm font-medium text-[#9CA3AF]">
              2024-01-25 14:00
            </span>
          </div>
          <p className="text-lg font-bold text-[#111827]">
            신제품 초콜릿 출시! 🍫 #프리미엄초콜릿 #신제품
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PublishedSection = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-black mb-2">발행된 게시물</h3>
    <div className="grid gap-4">
      {[
        {
          platform: "Facebook",
          color: "bg-blue-600",
          content: "유기농 쿠키로 건강한 간식 시간을 만들어보세요!",
          likes: 142,
          comments: 23,
        },
        {
          platform: "Twitter",
          color: "bg-sky-400",
          content: "과일 캔디 30% 할인 이벤트 진행 중!",
          likes: 89,
          comments: 12,
        },
      ].map((post, i) => (
        <div
          key={i}
          className="bg-[#F9FAFB] border border-gray-200 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className={`${post.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
            >
              {post.platform}
            </span>
            <span className="text-[#5BF22F] font-black text-sm">
              ● 발행완료
            </span>
          </div>
          <p className="text-lg font-bold mb-6 text-[#111827]">
            {post.content}
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-[#9CA3AF] font-bold">
              ❤️ {post.likes}
            </span>
            <span className="flex items-center gap-2 text-[#9CA3AF] font-bold">
              💬 {post.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div>
      <h3 className="text-2xl font-black mb-8">플랫폼별 참여도</h3>
      <div className="space-y-8">
        {[
          { p: "Instagram", v: 85, color: "bg-pink-500" },
          { p: "Facebook", v: 65, color: "bg-blue-600" },
          { p: "Twitter", v: 40, color: "bg-sky-400" },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between font-bold mb-3">
              <span>{item.p}</span>
              <span className="text-[#9CA3AF]">{item.v}%</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-full`}
                style={{ width: `${item.v}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-black mb-8">주요 성과 수치</h3>
      <div className="space-y-8">
        {[
          { l: "좋아요 합계", v: "1,231", p: 90 },
          { l: "공유 횟수", v: "342", p: 60 },
          { l: "댓글 참여", v: "158", p: 45 },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between font-bold mb-3">
              <span>{item.l}</span>
              <span className="text-[#111827]">{item.v}</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
              <div
                className="bg-[#5BF22F] h-full"
                style={{ width: `${item.p}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
