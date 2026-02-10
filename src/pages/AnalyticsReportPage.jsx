<<<<<<< Updated upstream
import { useState, useEffect } from "react";
=======
import React, { useState, useEffect, useRef } from "react";
>>>>>>> Stashed changes
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
  X,
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
import { apiFetch } from "@/lib/apiFetch";
import { analyzeProduct } from "@/services/api/crawlerApi";

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

// ... (imports)

export default function AnalyticsReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportRef = useRef(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "전체 개요");
  const [selectedProductId, setSelectedProductId] = useState(searchParams.get("productId") || "");
  const [isPdfOpen, setIsPdfOpen] = useState(false); // PDF 팝업 상태
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  // URL 파라미터에서 탭 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    const productId = searchParams.get("productId");
    if (tab) setActiveTab(tab);
    if (productId) {
        setSelectedProductId(productId);
        // 제품 ID가 URL에 있으면 팝업 띄우기 (약간의 지연 후)
        setTimeout(() => setIsPdfOpen(true), 500);
    }
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
    if (!selectedProductId) return;
    try {
      // 백엔드 API를 통해 PDF 생성 및 다운로드
      const blob = await analyzeProduct(selectedProductId);
      
      // Blob을 URL로 변환하여 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Analytics_Report_${selectedProductId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert(`PDF 다운로드 실패: ${error.message}`);
    }
  };
  
  // API 연결 테스트 핸들러 (분석/크롤러 엔드포인트 체크)
  const checkApiStatus = async () => {
    try {
      // 분석 요청 테스트 (잘못된 ID를 보내서 연결 여부만 확인)
      const res = await apiFetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: "test_connection" })
      });
      
      if (res.ok || res.status === 400 || res.status === 404 || res.status === 500) {
        // 400/404/500이 뜬다는 건 서버 엔드포인트에 도달했다는 뜻
        const contentType = res.headers.get("content-type");
        alert(`✅ 분석 서버 연결 확인됨!\n경로: /api/analyze\n응답 코드: ${res.status}\n응답 타입: ${contentType}`);
      } else {
        alert(`⚠️ 서버 연결 불안정\n상태 코드: ${res.status}`);
      }
    } catch (error) {
      alert(`❌ 서버 연결 실패: ${error.message}\n백엔드 주소나 프록시 설정을 확인해주세요.`);
    }
  };


  // 제품 선택 핸들러
  const handleProductSelect = (e) => {
      const pid = e.target.value;
      setSelectedProductId(pid);
      if (pid) {
          setIsPdfOpen(true); // 제품 선택 시 팝업 오픈
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
<<<<<<< Updated upstream
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
=======
          <Button 
            onClick={checkApiStatus}
            className="text-sm font-bold bg-gray-800 hover:bg-gray-700"
          >
            🔌 API 연결 테스트
          </Button>
>>>>>>> Stashed changes
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

        {/* 탭 메뉴 (축소됨) */}
        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1.5 rounded-2xl w-fit font-bold text-sm">
          {["전체 개요", "트렌드 분석", "리뷰 분석"].map(
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black">
                  월별 매출 & ROI 트렌드
                </h3>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={!selectedProductId}
                  className={selectedProductId ? "bg-[#61AFFE] text-white hover:brightness-95" : "bg-gray-200 text-gray-400"}
                  size="sm"
                >
                  <FileText size={16} className="mr-1" /> PDF 다운로드
                </Button>
              </div>
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
          
          {activeTab === "리뷰 분석" && (
            <div className="space-y-6">
              {/* 제품 선택 */}
              <Card className="p-6 border-gray-200 shadow-sm">
                <h3 className="text-xl font-black mb-4">제품별 리뷰 분석</h3>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-600">제품 선택:</label>
                  <select
                    value={selectedProductId}
                    onChange={handleProductSelect}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
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
                  
                  {/* PDF 다운로드 버튼 */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!selectedProductId}
                    className={`px-6 py-2 rounded-xl font-black flex gap-2 items-center transition-all shadow-sm ${
                        selectedProductId
                          ? "bg-[#61AFFE] text-white hover:brightness-95"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <FileText size={18} /> PDF 다운로드
                  </button>
                </div>
              </Card>

              {/* 더미 PDF 팝업 */}
              {isPdfOpen && selectedProductId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] relative shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">PDF 리포트 (미리보기)</h3>
                        <button
                        onClick={() => setIsPdfOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                        <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 overflow-hidden rounded-b-2xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-bold mb-2">분석 리포트가 준비되었습니다</p>
                            <p className="text-sm">이 영역에 실제 PDF 뷰어가 표시될 예정입니다.</p>
                            <p className="text-xs text-gray-400 mt-2">(현재는 더미 화면입니다)</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

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



