import React, { useState } from "react";
import {
  Download,
  FileText,
  DollarSign,
  BarChart3,
  Eye,
  Target,
  TrendingUp,
  MousePointer2,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

// --- 로컬 실행을 위한 완결된 더미 데이터 ---
const lineData = [
  { name: "월", 조회수: 1100, 클릭: 400, 전환: 50 },
  { name: "화", 조회수: 1900, 클릭: 550, 전환: 60 },
  { name: "수", 조회수: 1500, 클릭: 480, 전환: 55 },
  { name: "목", 조회수: 2100, 클릭: 650, 전환: 80 },
  { name: "금", 조회수: 2500, 클릭: 720, 전환: 95 },
  { name: "토", 조회수: 2200, 클릭: 680, 전환: 85 },
  { name: "일", 조회수: 1800, 클릭: 520, 전환: 65 },
];

const barData = [
  { name: "1월", 매출: 4500, 광고비: 2100 },
  { name: "2월", 매출: 5200, 광고비: 2400 },
  { name: "3월", 매출: 6100, 광고비: 2800 },
  { name: "4월", 매출: 5800, 광고비: 2500 },
  { name: "5월", 매출: 6800, 광고비: 2900 },
  { name: "6월", 매출: 7800, 광고비: 3200 },
];

const pieData = [
  { name: "Instagram", value: 35, color: "#E1306C" },
  { name: "Facebook", value: 28, color: "#1877F2" },
  { name: "Twitter", value: 22, color: "#1DA1F2" },
  { name: "YouTube", value: 15, color: "#FF0000" },
];

export default function AnalyticsReportPage() {
  const [activeTab, setActiveTab] = useState("전체 개요");

  const stats = [
    {
      title: "총 매출",
      value: "₩7,500,000",
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "ROI",
      value: "268%",
      trend: "+8.3%",
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      title: "총 조회수",
      value: "13,200",
      trend: "+18.2%",
      icon: Eye,
      color: "text-purple-500",
    },
    {
      title: "전환율",
      value: "4.8%",
      trend: "-0.5%",
      icon: Target,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-full bg-[#F5F7FA] py-12">
      <Container>
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#111827] mb-3">
              분석 & 리포트
            </h1>
            <p className="text-lg text-[#9CA3AF] font-medium">
              광고 성과를 분석하고 리포트를 다운로드하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white border flex gap-2 font-bold px-5 h-12"
            >
              <Download size={18} /> Excel 다운로드
            </Button>
            <button className="bg-[#5BF22F] text-black px-6 h-12 rounded-xl font-black flex gap-2 items-center hover:brightness-95 transition-all shadow-sm">
              <FileText size={18} /> PDF 리포트
            </button>
          </div>
        </div>

        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="flex flex-col justify-between border-gray-200 shadow-sm p-8 h-48"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-[#9CA3AF]">
                  {stat.title}
                </span>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-3xl font-black text-[#111827] mb-2">
                  {stat.value}
                </div>
                <div
                  className={`text-sm font-bold ${stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.trend.startsWith("+") ? "↗" : "↘"} {stat.trend}{" "}
                  <span className="text-[#9CA3AF] ml-1 font-normal">
                    전월 대비
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit font-bold text-sm">
          {["전체 개요", "트렌드 분석", "플랫폼 비교", "제품별 성과"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab
                    ? "bg-white shadow-md text-black"
                    : "text-[#9CA3AF] hover:text-black"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="space-y-8">
          {activeTab === "전체 개요" && (
            <Card className="p-10 border-gray-200 shadow-sm">
              <h3 className="text-2xl font-black mb-2">주간 성과 트렌드</h3>
              <p className="text-[#9CA3AF] font-medium mb-10">
                최근 7일간의 조회수, 클릭, 전환 데이터
              </p>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0F0F0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="조회수"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="클릭"
                      stroke="#5BF22F"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="전환"
                      stroke="#FFBB28"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {activeTab === "트렌드 분석" && (
            <Card className="p-10 border-gray-200 shadow-sm">
              <h3 className="text-2xl font-black mb-2">
                월별 매출 & ROI 트렌드
              </h3>
              <p className="text-[#9CA3AF] font-medium mb-10">
                최근 6개월간의 매출, 광고비 추이
              </p>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0F0F0"
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#F9FAFB" }} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar dataKey="매출" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="광고비"
                      fill="#4B5563"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {activeTab === "플랫폼 비교" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 border-gray-200 shadow-sm">
                <h3 className="text-2xl font-black mb-10 text-center">
                  플랫폼별 참여도
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-10 border-gray-200 shadow-sm space-y-6 flex flex-col justify-center">
                <h3 className="text-2xl font-black mb-4">주요 지표 요약</h3>
                <MetricBar
                  label="평균 체류 시간"
                  value="2분 34초"
                  icon={TrendingUp}
                  color="bg-blue-50 text-blue-500"
                />
                <MetricBar
                  label="클릭률 (CTR)"
                  value="3.2%"
                  icon={MousePointer2}
                  color="bg-green-50 text-green-500"
                />
                <MetricBar
                  label="신규 방문자"
                  value="1,847명"
                  icon={Users}
                  color="bg-purple-50 text-purple-500"
                />
              </Card>
            </div>
          )}

          {activeTab === "제품별 성과" && (
            <Card className="p-10 border-gray-200 shadow-sm">
              <h3 className="text-2xl font-black mb-8">제품별 판매 성과</h3>
              <div className="space-y-8">
                {[
                  {
                    name: "초콜릿",
                    value: 75,
                    change: "+12%",
                    color: "bg-[#5BF22F]",
                  },
                  {
                    name: "쿠키",
                    value: 62,
                    change: "+8%",
                    color: "bg-blue-500",
                  },
                  {
                    name: "캔디",
                    value: 35,
                    change: "-2%",
                    color: "bg-red-500",
                  },
                  {
                    name: "스낵",
                    value: 48,
                    change: "+15%",
                    color: "bg-purple-500",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold mb-3">
                      <span>
                        {item.name}{" "}
                        <span
                          className={`ml-2 text-xs font-black ${item.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                        >
                          {item.change}
                        </span>
                      </span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full transition-all duration-1000`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

// 상세 지표 요약용 서브 컴포넌트
function MetricBar({ label, value, icon: Icon, color }) {
  // color 문자열 분리 시 발생할 수 있는 에러 방어
  const colors = color ? color.split(" ") : ["bg-gray-100", "text-gray-500"];

  return (
    <div
      className={`flex items-center justify-between p-6 rounded-2xl ${colors[0]}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm ${colors[1]}`}>
          {Icon && <Icon size={20} />}
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 mb-1 tracking-tight">
            {label}
          </div>
          <div className="text-xl font-black text-black">{value}</div>
        </div>
      </div>
      <TrendingUp size={24} className="opacity-10" />
    </div>
  );
}
