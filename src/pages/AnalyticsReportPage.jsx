import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
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
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchProducts } from "@/services/api/productApi";
import { useAuthStore } from "@/stores/authStore";
import { apiFetch } from "@/lib/apiFetch";
import {
  analyzeProduct,
  registerProduct,
  getProductStatus,
  reanalyzeProduct,
} from "@/services/api/crawlerApi";
import PdfViewer from "@/components/common/PdfViewer";

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

export default function AnalyticsReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportRef = useRef(null);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "전체 개요",
  );
  const [selectedProductId, setSelectedProductId] = useState(
    searchParams.get("productId") || "",
  );

  // PDF 관련 상태
  const [pdfUrl, setPdfUrl] = useState("");
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("idle"); // idle, requesting, processing, completed, failed
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  // URL 파라미터에서 탭 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    const productId = searchParams.get("productId");
    if (tab) setActiveTab(tab);
    if (productId) {
      setSelectedProductId(productId);
    }
  }, [searchParams]);

  // 제품 변경 시 PDF 가져오기
  useEffect(() => {
    if (selectedProductId) {
      fetchPdfPreview(selectedProductId);
    } else {
      setPdfUrl("");
      setPdfError("");
    }

    // Cleanup function to revoke object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [selectedProductId]);

  // 폴링 및 자동 로드 로직
  useEffect(() => {
    let intervalId = null;

    if (analysisStatus === "processing" && selectedProductId) {
      intervalId = setInterval(async () => {
        try {
          console.log(`[Polling] Checking status for: ${selectedProductId}`);
          const statusRes = await getProductStatus(selectedProductId);
          console.log("[Polling] Response:", statusRes);
          setLastCheckTime(new Date());

          // 서버 응답의 status 필드 확인 (finished 또는 completed)
          const currentStatus = statusRes.status?.toLowerCase() || "";
          const msg = statusRes.message || statusRes.detail || "";

          if (msg) setStatusMessage(msg);
          else if (currentStatus)
            setStatusMessage(`현재 단계: ${currentStatus}`);

          if (
            currentStatus === "finished" ||
            currentStatus === "completed" ||
            currentStatus === "success" ||
            currentStatus === "done"
          ) {
            setAnalysisStatus("completed");
            // PDF 준비를 위해 아주 약간의 지연 후 호출하거나, fetchPdfPreview 내부에서 재시도하도록 유도
            setTimeout(() => {
              fetchPdfPreview(selectedProductId);
            }, 1500);
            clearInterval(intervalId);
          } else if (currentStatus === "failed" || currentStatus === "error") {
            setAnalysisStatus("failed");
            setPdfError(msg || "분석 중 오류가 발생했습니다.");
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Polling status failed:", error);
          // 네트워크 에러 등은 일시적일 수 있으므로 계속 진행하거나 횟수 제한을 둘 수 있음
        }
      }, 5000); // 5초마다 확인
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [analysisStatus, selectedProductId]);

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

  // PDF 미리보기 가져오기
  const fetchPdfPreview = async (productId) => {
    if (!productId) return;

    setIsLoadingPdf(true);
    setPdfError("");

    // 기존 URL 정리
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }

    try {
      const response = await analyzeProduct(productId);

      if (!(response instanceof Blob)) {
        const msg =
          response?.detail || response?.message || JSON.stringify(response);
        throw new Error(msg);
      }

      const url = window.URL.createObjectURL(response);
      setPdfUrl(url);
      setAnalysisStatus("completed");
    } catch (error) {
      console.error("PDF preview failed:", error);
      const rawMsg = error.message || "";
      let displayMsg = "리포트를 불러오는데 실패했습니다.";

      if (
        rawMsg.includes("찾을 수 없습니다") ||
        rawMsg.includes("not found") ||
        rawMsg.includes("처리 중") ||
        rawMsg.includes("analyzing") ||
        rawMsg.includes("processing")
      ) {
        // 리포트가 없는 경우나 처리 중인 경우, 분석 상태를 확인하여 지속성 유지
        try {
          console.log(
            `[Persistence] Status signal detected in error, checking: ${productId}`,
          );
          const statusRes = await getProductStatus(productId);
          if (
            statusRes.status === "processing" ||
            statusRes.status === "running" ||
            statusRes.status === "analyzing"
          ) {
            console.log(
              "[Persistence] Analysis found in progress, resuming polling.",
            );
            setAnalysisStatus("processing");
            setPdfError("");
            setLastCheckTime(new Date());
            return;
          }
        } catch (statusError) {
          console.error("Checking status for persistence failed:", statusError);
        }

        displayMsg = "분석 리포트가 아직 생성되지 않았습니다.";
      } else if (rawMsg) {
        displayMsg = rawMsg;
      }

      setPdfError(displayMsg);
      setAnalysisStatus("failed");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedProductId) return;

    // 이미 불러온 PDF가 있으면 바로 다운로드
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `Analytics_Report_${selectedProductId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    try {
      // 백엔드 API를 통해 PDF 생성 및 다운로드 (fallback)
      const response = await analyzeProduct(selectedProductId);

      if (!(response instanceof Blob)) {
        console.error("PDF download failed, response is not a blob:", response);
        const msg =
          response?.detail || response?.message || JSON.stringify(response);
        throw new Error(msg);
      }

      const url = window.URL.createObjectURL(response);
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

  // 분석 시작 요청 핸들러
  const handleStartAnalysis = async (isForce = false) => {
    const product = products.find((p) => {
      const urlIdMatch = p.reviewUrl?.match(/\/products\/(\d+)/);
      const extractedId = urlIdMatch
        ? urlIdMatch[1]
        : p.productId || p.product_id || p.id;
      return String(extractedId) === String(selectedProductId);
    });

    if (!product || !product.reviewUrl) {
      alert("제품의 리뷰 URL을 찾을 수 없습니다.");
      return;
    }

    setIsStartingAnalysis(true);
    setAnalysisStatus("requesting");
    console.log(
      `[Analysis] Starting for product ID: ${selectedProductId}, URL: ${product.reviewUrl}`,
    );

    try {
      let res;
      if (isForce) {
        console.log("[Analysis] Force re-requesting using reanalyzeProduct...");
        res = await reanalyzeProduct(selectedProductId);
      } else {
        res = await registerProduct({
          coupang_url: product.reviewUrl,
          max_reviews: 100,
        });
      }
      console.log("[Analysis] Request successful:", res);
      setAnalysisStatus("processing");
      setStatusMessage(res.message || res.status || "분석을 시작합니다.");
      setLastCheckTime(new Date());
      setPdfError(""); // 기존 에러 메시지 제거
    } catch (error) {
      console.error("Start analysis failed:", error);

      // 이미 진행 중인 경우(already_exists) 에러로 처리하지 않고 진행 상태로 진입
      // 단, 사용자가 명시적으로 '강제 재요청'한 경우에는 이를 무시하고 계속 시도하는 것이 서버 설정에 따라 다를 수 있음
      if (
        !isForce &&
        (error.message?.includes("already_exists") ||
          error.message?.includes("이미"))
      ) {
        console.log("[Analysis] Already in progress, switching to polling.");
        setAnalysisStatus("processing");
        setLastCheckTime(new Date());
        setPdfError("");
        return;
      }

      setAnalysisStatus("failed");
      alert(`분석 시작 실패: ${error.message}`);
    } finally {
      setIsStartingAnalysis(false);
    }
  };

  // 분석 취소 핸들러
  const handleCancelAnalysis = () => {
    setAnalysisStatus("failed"); // failed나 idle로 설정하여 버튼이 보이게 함
    setPdfError("분석 리포트가 아직 생성되지 않았습니다.");
    setStatusMessage("");
    if (isStartingAnalysis) setIsStartingAnalysis(false);
    console.log("[Analysis] Cancelled by user and reverted to request state");
  };

  // 제품 선택 핸들러
  const handleProductSelect = (e) => {
    const pid = e.target.value;
    setSelectedProductId(pid);
    // useEffect에서 fetchPdfPreview 호출됨
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
          {["전체 개요", "트렌드 분석", "리뷰 분석"].map((tab) => (
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
          ))}
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
                <h3 className="text-xl font-black">월별 매출 & ROI 트렌드</h3>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-[#FFBB28] text-white hover:brightness-95 shadow-sm"
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
                  <label className="text-sm font-bold text-gray-600">
                    제품 선택:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={handleProductSelect}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                  >
                    <option value="">제품을 선택하세요</option>
                    {products
                      .filter((p) => {
                        // 0으로 바꾼 거 안나오게
                        const name = p.name?.trim();
                        return (
                          p.reviewUrl &&
                          name !== "0" &&
                          name !== "" &&
                          p.status !== 0 &&
                          p.status !== "0"
                        );
                      })
                      .map((product) => {
                        // 쿠팡 URL에서 실제 상품 ID 추출 (예: .../products/6062866109 -> 6062866109)
                        const urlIdMatch =
                          product.reviewUrl?.match(/\/products\/(\d+)/);
                        const extractedId = urlIdMatch
                          ? urlIdMatch[1]
                          : product.productId ||
                            product.product_id ||
                            product.id;
                        const uniqueKey =
                          product.productId || product.product_id || product.id;
                        return (
                          <option key={uniqueKey} value={extractedId}>
                            {product.name}
                          </option>
                        );
                      })}
                  </select>

                  {/* PDF 다운로드 버튼 */}
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={!selectedProductId}
                    className="px-6 py-2 rounded-xl font-black flex gap-2 items-center transition-all shadow-sm bg-[#FFBB28] text-white hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText size={18} /> PDF 다운로드
                  </Button>
                </div>
              </Card>

              {/* PDF 미리보기 뷰어 (Inline) */}
              {selectedProductId && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <FileText className="text-red-500" /> 분석 리포트 미리보기
                  </h3>

                  <Card className="p-0 border-gray-200 shadow-sm overflow-hidden min-h-[500px] bg-gray-100 flex flex-col items-center justify-center relative">
                    {(isLoadingPdf ||
                      analysisStatus === "processing" ||
                      analysisStatus === "requesting") && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 w-full h-full p-8 text-center">
                        <div className="relative mb-6">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-blue-600"></div>
                          <Sparkles
                            className="absolute inset-0 m-auto text-blue-400 animate-pulse"
                            size={24}
                          />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {analysisStatus === "processing"
                            ? "리포트를 분석하고 있습니다"
                            : "리포트를 불러오는 중"}
                        </h4>

                        <p className="text-gray-500 font-medium max-w-xs mx-auto text-sm mb-8 mt-4">
                          AI가 리뷰 데이터를 꼼꼼히 분석하고 있습니다. <br />
                          완료되면 자동으로 화면에 표시됩니다.
                        </p>

                        {lastCheckTime && (
                          <p className="text-[10px] text-gray-400 mb-6">
                            최근 확인 시간: {lastCheckTime.toLocaleTimeString()}
                          </p>
                        )}

                        <div className="flex flex-col gap-2 w-full max-w-[200px]">
                          <Button
                            onClick={handleCancelAnalysis}
                            variant="ghost"
                            className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 underline py-1"
                          >
                            분석 취소
                          </Button>
                        </div>

                        <div className="mt-8 flex gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    )}

                    {!isLoadingPdf &&
                      analysisStatus !== "processing" &&
                      analysisStatus !== "requesting" &&
                      (pdfError || (analysisStatus === "idle" && !pdfUrl)) && (
                        <div className="text-center p-8 w-full max-w-md mx-auto">
                          <div className="mb-4 text-amber-500">
                            <FileText
                              size={48}
                              className="mx-auto opacity-20"
                            />
                          </div>
                          <p className="text-gray-800 font-bold text-lg mb-2">
                            {pdfError ||
                              "아직 분석 리포트를 생성하지 않았습니다"}
                          </p>

                          <div className="flex flex-col gap-3 w-full">
                            <Button
                              onClick={() => handleStartAnalysis(false)}
                              isLoading={isStartingAnalysis}
                              className="bg-blue-600 text-white hover:bg-blue-700 w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                            >
                              <Sparkles size={18} /> 분석 리포트 생성 요청하기
                            </Button>
                          </div>
                        </div>
                      )}

                    {!isLoadingPdf &&
                      analysisStatus !== "processing" &&
                      analysisStatus !== "requesting" &&
                      !pdfError &&
                      pdfUrl && (
                        <div className="w-full bg-gray-200 p-8 flex justify-center min-h-[600px]">
                          <PdfViewer pdfUrl={pdfUrl} />
                        </div>
                      )}

                    {!isLoadingPdf &&
                      analysisStatus !== "processing" &&
                      analysisStatus !== "requesting" &&
                      !pdfError &&
                      !pdfUrl && (
                        <div className="text-gray-400 font-medium p-10">
                          PDF를 불러올 수 없습니다.
                        </div>
                      )}
                  </Card>
                </div>
              )}

              {!selectedProductId && (
                <Card className="p-12 border-gray-200 shadow-sm text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-black text-gray-400 mb-2">
                    제품을 선택하세요
                  </h3>
                  <p className="text-sm text-gray-400">
                    상단에서 제품을 선택하면 상세 분석 리포트가 표시됩니다
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
