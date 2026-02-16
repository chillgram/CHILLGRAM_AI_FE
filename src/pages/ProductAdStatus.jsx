import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/services/api/productApi";
import { fetchProjectsByProduct } from "@/services/api/projectApi";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowLeft,
  FileText,
  Eye,
  Sparkles,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

import Container from "@/components/common/Container";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Button from "../components/common/Button";
import Card from "@/components/common/Card";

export default function ProductAdStatusPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  // 제품 상세 조회
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId && bootstrapped,
  });

  // 프로젝트 목록 조회 (Real API)
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useQuery({
    queryKey: ["projects", productId],
    queryFn: () => fetchProjectsByProduct(productId),
    enabled: !!productId && bootstrapped,
  });

  const currentHeader = {
    name: product?.name || "제품",
    sub: product?.description || "제품의 광고 생성 프로젝트 목록",
  };

  // API 응답을 UI 형식으로 매핑 (배열 또는 { projects: [...] } 형태 처리)
  const rawProjects = Array.isArray(projectsData)
    ? projectsData
    : projectsData?.projects || projectsData?.content || [];
  const projects = rawProjects.map((p) => ({
    id: p.projectId || p.project_id || p.id,
    type: p.type === "AD" || p.projectType === "AD" ? "ad" : "design",
    badge:
      p.type === "AD" || p.projectType === "AD" ? "광고 생성" : "도안 생성",
    title: p.title || "제목 없음",
    date: (p.createdAt || p.created_at || "").substring(0, 10),
    contentCount: p.contentCount || p.content_count || 0,
  }));

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "전체") return true;
    if (activeTab === "광고") return p.type === "ad";
    if (activeTab === "도안") return p.type === "design";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <Container>
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/products")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} /> 제품관리
          </button>
        </div>

        {/* 헤더 섹션 */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">
              {currentHeader.name}
            </h1>
            <p
              className="text-gray-500 font-medium text-lg max-w-4xl mt-2 h-14 overflow-hidden leading-7"
              title={currentHeader.sub}
            >
              {currentHeader.sub}
            </p>
          </div>
          <div className="flex gap-3 h-fit items-end shrink-0">
            <Button
              variant="primary"
              sizes="sm"
              onClick={() => navigate("./addAD")}
              className="px-6 py-3 font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Sparkles size={18} fill="currentColor" />
              광고 생성
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("./addPackage")}
              className="rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              <FileText size={18} /> 도안 생성
            </Button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8">
          {["전체", "광고", "도안"].map((tab) => (
            <Button
              key={tab}
              variant="primary"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl transition-all border ${
                activeTab === tab
                  ? "bg-[#60A5FA] border-[#60A5FA] shadow-md"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* 프로젝트 목록 테이블 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <ErrorBoundary>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 w-[12%] whitespace-nowrap">
                      구분
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 w-[43%]">
                      프로젝트명
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 w-[12%] whitespace-nowrap">
                      콘텐츠 수
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 w-[18%] whitespace-nowrap">
                      등록일
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 text-center w-[15%] whitespace-nowrap">
                      상세보기
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isProjectsLoading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-20 text-center text-gray-400 text-sm"
                      >
                        로딩 중...
                      </td>
                    </tr>
                  )}
                  {isProjectsError && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-20 text-center text-red-400 text-sm"
                      >
                        프로젝트 목록을 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {!isProjectsLoading &&
                    !isProjectsError &&
                    filteredProjects.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center text-gray-400 text-sm"
                        >
                          아직 생성된 프로젝트가 없습니다.
                        </td>
                      </tr>
                    )}
                  {!isProjectsLoading &&
                    !isProjectsError &&
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => {
                          const detailPath =
                            project.type === "design"
                              ? `./projectDesignDetail/${project.id}`
                              : `./projectAdDetail/${project.id}`;
                          navigate(detailPath, {
                            state: { projectName: project.title },
                          });
                        }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <td className="py-6 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-black ${
                              project.type === "ad"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {project.badge}
                          </span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="text-base font-bold text-[#111827] group-hover:text-blue-500 transition-colors">
                            {project.title}
                          </div>
                        </td>
                        <td className="py-6 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-bold">
                            <ImageIcon size={14} className="text-gray-400" />
                            {project.contentCount}개
                          </div>
                        </td>
                        <td className="py-6 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <Calendar size={14} /> {project.date}
                          </div>
                        </td>
                        <td className="py-6 px-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 transition-all active:scale-95">
                              <Eye size={14} />
                              상세보기
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ErrorBoundary>
        </div>
      </Container>
    </div>
  );
}
