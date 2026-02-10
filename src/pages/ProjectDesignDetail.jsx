import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Eye,
    Download,
    Image as ImageIcon,
    Calendar,
    LayoutGrid,
    CheckCircle2,
} from "lucide-react";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function ProjectDesignDetail() {

    const navigate = useNavigate();

    // 더미 데이터
    const designInfo = {
        title: "패키지 목업 제작",
        desc: "프로젝트에서 생성된 모든 패키지 도안",
    };

    const stats = [
        {
            label: "총 도안",
            value: "8",
            icon: LayoutGrid,
            color: "text-blue-500",
        },
        {
            label: "활성 도안",
            value: "7",
            icon: CheckCircle2,
            color: "text-green-500",
        },
        {
            label: "최근 생성일",
            value: "2024-01-15",
            icon: Calendar,
            color: "text-purple-500",
        },
    ];

    const designs = [
        {
            id: 1,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 1",
            date: "2024-01-15",
            color: "bg-[#3E2723]",
        },
        {
            id: 2,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 2",
            date: "2024-01-15",
            color: "bg-[#1A237E]",
        },
        {
            id: 3,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 3",
            date: "2024-01-15",
            color: "bg-[#4E342E]",
        },
        {
            id: 4,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 4",
            date: "2024-01-15",
            color: "bg-[#5D4037]",
        },
        {
            id: 5,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 5",
            date: "2024-01-15",
            color: "bg-[#3E2723]",
        },
        {
            id: 6,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 6",
            date: "2024-01-14",
            color: "bg-[#1A237E]",
        },
        {
            id: 7,
            status: "활성",
            title: "프리미엄 초콜릿 패키지 도안 7",
            date: "2024-01-14",
            color: "bg-[#4E342E]",
        },
        {
            id: 8,
            status: "임시저장",
            title: "프리미엄 초콜릿 패키지 도안 8",
            date: "2024-01-14",
            color: "bg-[#5D4037]",
        },
    ];

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "활성":
                return "bg-green-100 text-green-600";
            case "임시저장":
                return "bg-yellow-100 text-yellow-600";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-12">
            <Container>
                {/* 상단 네비게이션 */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold px-0 hover:bg-transparent"
                    >
                        <ArrowLeft size={20} /> 프로젝트관리
                    </Button>
                </div>

                {/* 헤더 타이틀 */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-[#111827] mb-2 tracking-tight">
                        {designInfo.title}
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        {designInfo.desc}
                    </p>
                </div>

                {/* 상단 통계 카드 (3개) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <Card
                            key={idx}
                            className="p-6 flex flex-col justify-between h-32 border-gray-100 shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-gray-400">
                                    {stat.label}
                                </span>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <div className="text-3xl font-black text-[#111827]">
                                {stat.value}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 도안 카드 그리드 */}
                <ErrorBoundary>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {designs.map((design) => (
                            <Card
                                key={design.id}
                                className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                {/* 카드 상단 이미지 영역 */}
                                <div className={`h-48 w-full ${design.color} relative overflow-hidden flex items-center justify-center`}>
                                    <ImageIcon size={48} className="text-white/30" />
                                </div>

                                {/* 카드 본문 */}
                                <div className="p-6">
                                    {/* 상태 뱃지 */}
                                    <div className="mb-4">
                                        <span
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusBadgeStyle(
                                                design.status
                                            )}`}
                                        >
                                            {design.status}
                                        </span>
                                    </div>

                                    {/* 타이틀 & 날짜 */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-black text-[#111827] mb-2 group-hover:text-blue-600 transition-colors">
                                            {design.title}
                                        </h3>
                                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                            <Calendar size={12} />
                                            {design.date}
                                        </div>
                                    </div>

                                    {/* 하단 버튼 */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                                        >
                                            <Eye size={14} /> 상세
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                                        >
                                            <Download size={14} /> 다운로드
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ErrorBoundary>
            </Container>
        </div>
    );
}
