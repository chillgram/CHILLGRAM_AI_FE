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
  const { data: projectsData, isLoading: isProjectsLoading, isError: isProjectsError } = useQuery({
    queryKey: ["projects", productId],
    queryFn: () => fetchProjectsByProduct(productId),
    enabled: !!productId && bootstrapped,
  });

  const currentHeader = {
    name: product?.name || "제품",
    sub: product?.description || "제품의 광고 생성 프로젝트 목록",
  };

  // API 응답을 UI 형식으로 매핑 (배열 또는 { projects: [...] } 형태 처리)
  const rawProjects = Array.isArray(projectsData) ? projectsData : (projectsData?.projects || projectsData?.content || []);
  const projects = rawProjects.map((p) => ({
    id: p.projectId || p.project_id || p.id,
    type: p.type === "AD" || p.projectType === "AD" ? "ad" : "design",
    badge: p.type === "AD" || p.projectType === "AD" ? "광고 생성" : "도안 생성",
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
            <p className="text-gray-500 font-medium text-lg">
              {currentHeader.sub}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("./addAD")}
              className="bg-[#60A5FA] hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
            >
              <Sparkles
                size={18}
                fill="currentColor"
                className="text-white/20"
              />{" "}
              광고 생성
            </button>
            <button
              onClick={() => navigate("./addPackage")}
              className="bg-white hover:bg-gray-50 text-[#111827] border border-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 text-sm"
            >
              <FileText size={18} /> 도안 생성
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8">
          {["전체", "광고", "도안"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeTab === tab
                ? "bg-[#60A5FA] border-[#60A5FA] text-white shadow-md"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ErrorBoundary>
            {isProjectsLoading && (
              <div className="col-span-full py-20 text-center text-gray-400 text-sm">
                로딩 중...
              </div>
            )}
            {isProjectsError && (
              <div className="col-span-full py-20 text-center text-red-400 text-sm">
                프로젝트 목록을 불러오지 못했습니다.
              </div>
            )}
            {!isProjectsLoading && !isProjectsError && filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 text-sm">
                아직 생성된 프로젝트가 없습니다.
              </div>
            )}
            {!isProjectsLoading && !isProjectsError && filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  const detailPath =
                    project.type === "design"
                      ? `./projectDesignDetail/${project.id}`
                      : `./projectAdDetail/${project.id}`;
                  navigate(detailPath, { state: { projectName: project.title } });
                }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="mb-8">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black mb-4 ${project.type === "ad"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-blue-50 text-blue-600"
                      }`}
                  >
                    {project.badge}
                  </span>
                  <h3 className="text-xl font-black text-[#111827] mb-2 group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                    <Calendar size={14} /> {project.date}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                    <ImageIcon size={14} />
                    {project.contentCount}개 콘텐츠
                  </div>
                </div>
              </div>
            ))}
          </ErrorBoundary>
        </div>
      </Container>
    </div>
  );
}
