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

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const currentHeader = {
    name: product?.name || "제품",
    sub: product?.description || "제품의 광고 생성 프로젝트 목록",
  };

  // API 응답을 UI 형식으로 매핑 (배열 또는 { projects: [...] } 형태 처리)
  const rawProjects = Array.isArray(projectsData)
    ? projectsData
    : projectsData?.projects || projectsData?.content || [];

  // Sort by createdAt descending (newest first)
  const sortedProjects = [...rawProjects].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);
    return dateB - dateA;
  });

  const projects = sortedProjects.map((p) => ({
    id: p.projectId || p.project_id || p.id,
    type: p.type === "AD" || p.projectType === "AD" ? "ad" : "design",
    badge:
      p.type === "AD" || p.projectType === "AD" ? "광고 생성" : "도안 생성",
    title: p.title || "제목 없음",
    date: (p.createdAt || p.created_at || "").substring(0, 10),
    contentCount: p.contentCount || p.content_count || 0,
  }));

  const filteredProjectsBase = projects;

  // 페이지네이션 적용
  const totalPages = Math.ceil(filteredProjectsBase.length / pageSize) || 1;
  const filteredProjects = filteredProjectsBase.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );

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

        {/* 프로젝트 목록 테이블 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
          <ErrorBoundary>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 w-[55%]">
                      프로젝트명
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 text-center w-[12%] whitespace-nowrap">
                      콘텐츠 수
                    </th>
                    <th className="py-5 font-bold text-gray-400 text-xs px-4 text-center w-[18%] whitespace-nowrap">
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
                        colSpan="4"
                        className="py-20 text-center text-gray-400 text-sm"
                      >
                        로딩 중...
                      </td>
                    </tr>
                  )}
                  {isProjectsError && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-20 text-center text-red-400 text-sm"
                      >
                        프로젝트 목록을 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {!isProjectsLoading &&
                    !isProjectsError &&
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => {
                          const detailPath = `./projectAdDetail/${project.id}`;
                          navigate(detailPath, {
                            state: {
                              projectName: project.title,
                              projectType: project.type
                            },
                          });
                        }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group h-[81px]"
                      >
                        <td className="py-6 px-4">
                          <div className="text-base font-bold text-[#111827] group-hover:text-blue-500 transition-colors">
                            {project.title}
                          </div>
                        </td>
                        <td className="py-6 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-bold">
                            <ImageIcon size={14} className="text-gray-400" />
                            {project.contentCount}개
                          </div>
                        </td>
                        <td className="py-6 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
                            <Calendar size={14} /> {project.date}
                          </div>
                        </td>
                        <td className="py-6 px-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 transition-all active:scale-95">
                              <Eye size={14} />
                              상세보기
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {/* 빈 행 채우기 */}
                  {!isProjectsLoading && !isProjectsError &&
                    Array.from({ length: Math.max(0, pageSize - filteredProjects.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-gray-50 h-[81px]">
                        <td colSpan="4" className="py-6 px-4 text-center text-gray-300 text-xs">
                          {filteredProjectsBase.length === 0 && i === 4 ? "아직 생성된 프로젝트가 없습니다." : ""}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 UI */}
            {!isProjectsLoading && !isProjectsError && filteredProjectsBase.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center transition-colors"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`h-8 w-8 rounded-lg text-sm font-bold transition-all ${i === page
                      ? "bg-[#60A5FA] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 flex items-center justify-center transition-colors"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  &gt;
                </button>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </Container>
    </div>
  );
}
