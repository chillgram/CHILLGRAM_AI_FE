import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ImageIcon,
  FileUp,
  Sparkles,
  CheckCircle2,
  Box,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import { fetchProduct } from "@/services/api/productApi";
import {
  fetchProjectsByProduct,
  fetchProjectContents,
  createProject,
} from "@/services/api/projectApi";
import { createBasicImageJob } from "@/services/api/ad";
import Button from "../components/common/Button";

// Dummy data removed. Fetching actual images from ad projects.

export default function DesignPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);
  const devBaseInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null); // { url, candidateId, projectId }
  const [dielineFile, setDielineFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 제품 상세 조회
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  // 해당 제품의 프로젝트 목록 조회 -> AD 타입만 필터링
  const { data: adProjects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["ad-projects", productId],
    queryFn: async () => {
      const projects = await fetchProjectsByProduct(productId);
      return (projects.projects || projects.content || projects).filter(
        (p) => (p.type || p.projectType) === "AD",
      );
    },
    enabled: !!productId,
  });

  // 필터링된 AD 프로젝트들의 모든 이미지 콘텐츠를 평탄화하여 가져오기
  const { data: baseImages, isLoading: isImagesLoading } = useQuery({
    queryKey: ["ad-images", adProjects?.map((p) => p.projectId || p.id)],
    queryFn: async () => {
      if (!adProjects || adProjects.length === 0) return [];
      const allContents = await Promise.all(
        adProjects.map(async (p) => {
          const contents = await fetchProjectContents(p.projectId || p.id);
          return (contents.contents || contents).map((c) => ({
            ...c,
            projectId: p.projectId || p.id,
            projectTitle: p.title,
          }));
        }),
      );
      return allContents
        .flat()
        .filter((c) => c.role === "CANDIDATE" || c.type === "IMAGE");
    },
    enabled: !!adProjects && adProjects.length > 0,
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDielineFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !dielineFile) return;

    try {
      setIsUploading(true);
      // 1) 신규 프로젝트 생성 (도안 생성 용)
      const projectData = {
        title: `${product?.name || "제품"} 도안 생성 프로젝트_${new Date().toLocaleDateString()}`,
        projectType: "DESIGN",
        description: `Base image: ${selectedImage.projectTitle || "Manual Upload"}`,
      };
      const newProject = await createProject(productId, projectData);
      const newProjectId = newProject.projectId || newProject.id;

      // 2) 잡 생성 (Subtype: DIELINE)
      const payload = {
        subType: "DIELINE",
        productId: productId,
        projectId: newProjectId,
        conceptUrl: selectedImage.isDev ? null : selectedImage.url,
        prompt: `${product?.name || "제품"}의 도안 생성`,
      };

      const response = await createBasicImageJob({
        payload,
        file: dielineFile,
        baseFile: selectedImage.isDev ? selectedImage.file : null,
      });
      const jobId = response.jobId;

      // 3) 로컬 스토리지에 jobId 저장 (나중에 상세 페이지에서 불러오기 위함)
      // cg_jobs_{newProjectId} 키에 배열로 저장
      const storageKey = `cg_jobs_${newProjectId}`;
      const existingJobs = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!existingJobs.includes(jobId)) {
        localStorage.setItem(
          storageKey,
          JSON.stringify([...existingJobs, jobId]),
        );
      }

      // 4) 상세 페이지로 이동
      navigate(
        `/dashboard/products/${productId}/projectDesignDetail/${newProjectId}`,
        {
          state: { jobId },
        },
      );
    } catch (e) {
      console.error("도안 생성 실패:", e);
      alert("도안 생성 요청 중 오류가 발생했습니다: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container className="relative py-8">
      {/* 상단 네비게이션 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} /> 프로잭트 목록
        </button>
      </div>
      {/* 헤더 섹션 */}
      <div className="space-y-10 pb-24 border border-gray-200 bg-white rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-xl">도안 생성</h3>
        <p className="-mt-8 text-sm text-gray-400">
          제품을 선택하고 도면을 업로드하여 AI 목업을 생성하세요.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* 1. 제품 이미지 선택 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#F9F5FF] rounded-xl text-[#7F56D9]">
                <ImageIcon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  제품 이미지 선택
                </h3>
                <p className="text-sm text-[#667085]">
                  광고 생성에서 만든 제품 이미지를 선택하세요
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {isImagesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 size={32} className="animate-spin text-gray-300" />
                </div>
              ) : baseImages && baseImages.length > 0 ? (
                <div className="relative">
                  <select
                    className="w-full p-4 rounded-2xl border-2 border-[#F2F4F7] bg-white text-[#101828] font-bold appearance-none cursor-pointer focus:border-[#7F56D9] outline-none transition-all shadow-sm"
                    onChange={(e) => {
                      if (e.target.value === "dev-temp-base") {
                        // 개발용 이미지는 이미 selectedImage에 들어있으므로 건드리지 않거나,
                        // 필요시 여기서 다시 세팅 로직을 탈 수도 있음.
                        return;
                      }
                      const img = baseImages.find(
                        (i) => String(i.id) === e.target.value,
                      );
                      setSelectedImage(img);
                    }}
                    value={selectedImage?.id || ""}
                  >
                    <option value="" disabled>
                      이미지를 선택하세요
                    </option>
                    {baseImages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.projectTitle} - {item.label || item.id}
                      </option>
                    ))}
                    {selectedImage?.id === "dev-temp-base" && (
                      <option value="dev-temp-base">
                        개발용 이미지 (직접 업로드)
                      </option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Box size={20} className="text-[#D0D5DD]" />
                  </div>

                  {selectedImage && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 aspect-video flex items-center justify-center relative group">
                      <img
                        src={selectedImage.url}
                        alt="Selected Concept"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {selectedImage.projectTitle}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50">
                  {selectedImage?.id === "dev-temp-base" ? (
                    <div className="space-y-4">
                      <p className="text-gray-400 text-sm font-medium">
                        개발용 이미지가 업로드되었습니다.
                      </p>
                      <div className="relative">
                        <select
                          className="w-full p-4 rounded-2xl border-2 border-[#F2F4F7] bg-white text-[#101828] font-bold appearance-none cursor-pointer focus:border-[#7F56D9] outline-none transition-all shadow-sm"
                          value="dev-temp-base"
                          readOnly
                        >
                          <option value="dev-temp-base">
                            개발용 이미지 (직접 업로드)
                          </option>
                        </select>
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 aspect-video flex items-center justify-center relative">
                          <img
                            src={selectedImage.url}
                            alt="Dev Base"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 text-gray-500 font-bold"
                          onClick={() => devBaseInputRef.current?.click()}
                        >
                          이미지 다시 삽입
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-sm font-medium">
                        광고 생성에서 생성된 이미지가 없습니다.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary font-bold bg-white border border-gray-100 shadow-sm"
                          onClick={() =>
                            navigate(`/dashboard/products/${productId}/addAD`)
                          }
                        >
                          광고 생성하러 가기
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 font-bold bg-white border border-gray-100 shadow-sm"
                          onClick={() => devBaseInputRef.current?.click()}
                        >
                          이미지 삽입(개발용)
                        </Button>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    ref={devBaseInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setSelectedImage({
                          id: "dev-temp-base",
                          url: url,
                          label: "개발용 이미지",
                          projectTitle: "매뉴얼 업로드",
                          candidateId: "dev-temp-candidate",
                          isDev: true,
                          file: file,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* 2. 패키지 도면 업로드 카드 */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#EFF8FF] rounded-xl text-[#60A5FA]">
                <FileUp size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#101828]">
                  패키지 도면 업로드
                </h3>
                <p className="text-sm text-[#667085]">
                  제품 패키지 도면 파일을 업로드하세요 (PNG, JPG)
                </p>
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-3xl p-14 flex flex-col items-center justify-center transition-all cursor-pointer ${
                dielineFile
                  ? "border-[#60A5FA] bg-[#edf5ff]"
                  : "border-[#EAECF0] hover:bg-[#F9FAFB] hover:border-[#D0D5DD]"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  dielineFile
                    ? "bg-[#edf5ff] text-[#60A5FA]"
                    : "bg-[#F2F4F7] text-[#667085]"
                }`}
              >
                {dielineFile ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <FileUp size={28} />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-[#101828]">
                  {dielineFile
                    ? dielineFile.name
                    : "클릭하여 업로드 또는 드래그 앤 드롭"}
                </p>
                <p className="text-sm text-[#98A2B3] mt-1 font-medium">
                  PNG, JPG (최대 10MB)
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* 하단 플로팅 액션바 스타일 버튼 */}
        <div className="mt-12 flex flex-col items-center">
          <Button
            variant="secondary"
            onClick={handleGenerate}
            disabled={!selectedImage || !dielineFile || isUploading}
            className={`flex items-center gap-3 rounded-lg text-sm px-4 py-2 font-bold shadow-sm transition-all active:scale-95 ${
              selectedImage && dielineFile && !isUploading
                ? "bg-primary hover:bg-yellow-500 shadow-yellow-100"
                : "bg-[#F3F3F3] text-[#98A2B3] cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Sparkles size={22} />
            )}
            {isUploading ? "생성 요청 중..." : "목업 생성하기"}
          </Button>
          {(!selectedImage || !dielineFile) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#F04438] font-medium">
              <AlertCircle size={16} />
              <span>
                이미지 선택과 파일 업로드가 완료되어야 생성이 가능합니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
