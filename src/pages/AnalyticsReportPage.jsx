import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchProducts } from "@/services/api/productApi";
import { useAuthStore } from "@/stores/authStore";

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

// ... (imports)
import { useRef } from "react";
// ... (other code)
export default function AnalyticsReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportRef = useRef(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "전체 개요");
  const [selectedProductId, setSelectedProductId] = useState(searchParams.get("productId") || "");
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  // URL 파라미터에서 탭 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    const productId = searchParams.get("productId");
    if (tab) setActiveTab(tab);
    if (productId) setSelectedProductId(productId);
  }, [searchParams]);

  // 제품 목록 조회 (리뷰 분석용)
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ page: 0, size: 100 }),
    enabled: bootstrapped,
  });
  const products = productsData?.content || [];

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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Analytics_Report.pdf");
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-full bg-[#F5F7FA] py-8">
      <Container>
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#111827] mb-3">
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
            <Button
              onClick={handleDownloadPDF}
              variant="primary"
              className="px-6 h-12 rounded-xl font-black flex gap-2 items-center hover:brightness-95 transition-all shadow-sm"
            >
              <FileText size={18} /> PDF 리포트
            </Button>
          </div>
        </div>

        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="flex flex-col justify-between border-gray-200 shadow-sm p-4 h-32"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#9CA3AF]">
                  {stat.title}
                </span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-black text-[#111827] mb-1">
                  {stat.value}
                </div>
                <div
                  className={`text-xs font-bold ${stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.trend.startsWith("+") ? "↗" : "↘"} {stat.trend}{" "}
                  <span className="text-[#9CA3AF] ml-0.5 font-normal text-[10px]">
                    전월 대비
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit font-bold text-sm">
          {["전체 개요", "트렌드 분석", "플랫폼 비교", "제품별 성과", "리뷰 분석"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl transition-all ${activeTab === tab
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
        <div ref={reportRef} className="space-y-8 p-4 bg-white rounded-xl">
          {activeTab === "전체 개요" && (
            <Card className="p-6 border-gray-200 shadow-sm">
              <h3 className="text-xl font-black mb-2">주간 성과 트렌드</h3>
              <p className="text-[#9CA3AF] font-medium mb-10">
                최근 7일간의 조회수, 클릭, 전환 데이터
              </p>
              <ErrorBoundary>
                <div className="h-[320px] w-full">
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
              </ErrorBoundary>
            </Card>
          )}

          {activeTab === "트렌드 분석" && (
            <Card className="p-6 border-gray-200 shadow-sm">
              <h3 className="text-xl font-black mb-2">
                월별 매출 & ROI 트렌드
              </h3>
              <p className="text-[#9CA3AF] font-medium mb-10">
                최근 6개월간의 매출, 광고비 추이
              </p>
              <ErrorBoundary>
                <div className="h-[320px] w-full">
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
                      <Bar
                        dataKey="매출"
                        fill="#9CA3AF"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="광고비"
                        fill="#4B5563"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ErrorBoundary>
            </Card>
          )}

          {activeTab === "플랫폼 비교" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-gray-200 shadow-sm">
                <h3 className="text-xl font-black mb-8 text-center">
                  플랫폼별 참여도
                </h3>
                <ErrorBoundary>
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
                </ErrorBoundary>
              </Card>
              <Card className="p-6 border-gray-200 shadow-sm space-y-6 flex flex-col justify-center">
                <h3 className="text-xl font-black mb-4">주요 지표 요약</h3>
                <ErrorBoundary>
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
                </ErrorBoundary>
              </Card>
            </div>
          )}

          {activeTab === "제품별 성과" && (
            <Card className="p-6 border-gray-200 shadow-sm">
              <h3 className="text-xl font-black mb-6">제품별 판매 성과</h3>
              <ErrorBoundary>
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
              </ErrorBoundary>
            </Card>
          )}

          {activeTab === "리뷰 분석" && (
            <div className="space-y-6">
              {/* 제품 선택 */}
              <Card className="p-6 border-gray-200 shadow-sm">
                <h3 className="text-xl font-black mb-4">제품별 리뷰 분석</h3>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-600">제품 선택:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">제품을 선택하세요</option>
                    {products.filter(p => p.reviewUrl).map((product) => {
                      const pid = product.productId || product.product_id || product.id;
                      return (
                        <option key={pid} value={pid}>
                          {product.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Card>

              {selectedProductId ? (
                <>
                  {/* 감성 분석 요약 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-gray-200 shadow-sm text-center">
                      <div className="text-4xl mb-2">😊</div>
                      <div className="text-3xl font-black text-green-500 mb-1">72%</div>
                      <div className="text-sm font-bold text-gray-500">긍정 리뷰</div>
                    </Card>
                    <Card className="p-6 border-gray-200 shadow-sm text-center">
                      <div className="text-4xl mb-2">😐</div>
                      <div className="text-3xl font-black text-yellow-500 mb-1">18%</div>
                      <div className="text-sm font-bold text-gray-500">중립 리뷰</div>
                    </Card>
                    <Card className="p-6 border-gray-200 shadow-sm text-center">
                      <div className="text-4xl mb-2">😞</div>
                      <div className="text-3xl font-black text-red-500 mb-1">10%</div>
                      <div className="text-sm font-bold text-gray-500">부정 리뷰</div>
                    </Card>
                  </div>

                  {/* 키워드 분석 */}
                  <Card className="p-6 border-gray-200 shadow-sm">
                    <h3 className="text-xl font-black mb-6">주요 키워드</h3>
                    <ErrorBoundary>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { word: "맛있어요", count: 156, type: "positive" },
                          { word: "가성비", count: 98, type: "positive" },
                          { word: "재구매", count: 87, type: "positive" },
                          { word: "선물용", count: 76, type: "neutral" },
                          { word: "포장", count: 65, type: "neutral" },
                          { word: "달달해요", count: 54, type: "positive" },
                          { word: "배송빠름", count: 43, type: "positive" },
                          { word: "양이적어요", count: 32, type: "negative" },
                          { word: "비싸요", count: 21, type: "negative" },
                        ].map((keyword, i) => (
                          <span
                            key={i}
                            className={`px-4 py-2 rounded-full text-sm font-bold ${keyword.type === "positive"
                              ? "bg-green-50 text-green-600"
                              : keyword.type === "negative"
                                ? "bg-red-50 text-red-600"
                                : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {keyword.word} ({keyword.count})
                          </span>
                        ))}
                      </div>
                    </ErrorBoundary>
                  </Card>

                  {/* 리뷰 요약 */}
                  <Card className="p-6 border-gray-200 shadow-sm">
                    <h3 className="text-xl font-black mb-4">AI 리뷰 요약</h3>
                    <ErrorBoundary>
                      <div className="bg-blue-50 rounded-2xl p-6 text-sm leading-relaxed text-gray-700">
                        <p className="mb-4">
                          <strong className="text-blue-600">✨ 전체 요약:</strong> 대부분의 고객들이 제품의 맛과 품질에 높은 만족도를 보이고 있습니다.
                          특히 "맛있어요", "가성비", "재구매" 등의 키워드가 자주 언급되며, 선물용으로도 인기가 높습니다.
                        </p>
                        <p className="mb-4">
                          <strong className="text-green-600">👍 긍정 포인트:</strong> 달콤한 맛, 고급스러운 포장, 빠른 배송이 주요 장점으로 꼽힙니다.
                        </p>
                        <p>
                          <strong className="text-red-600">👎 개선 포인트:</strong> 일부 고객들은 양이 적다는 의견과 가격이 다소 높다는 피드백을 주었습니다.
                        </p>
                      </div>
                    </ErrorBoundary>
                  </Card>
                </>
              ) : (
                <Card className="p-12 border-gray-200 shadow-sm text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-black text-gray-400 mb-2">제품을 선택하세요</h3>
                  <p className="text-sm text-gray-400">리뷰 URL이 등록된 제품의 분석 결과를 확인할 수 있습니다</p>
                </Card>
              )}
            </div>
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
