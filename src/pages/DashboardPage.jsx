import {
  LayoutGrid,
  Image as ImageIcon,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Package,
  Share2,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const navigator = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activities = [
    { title: "초콜릿 신제품 광고", desc: "광고 생성", time: "2시간 전" },
    { title: "인스타그램 캠페인", desc: "SNS 게시", time: "5시간 전" },
    { title: "유기농 과자 시리즈", desc: "제품 추가", time: "1일 전" },
  ];

  return (
    <div className="min-h-full bg-[#F9FAFB] py-12">
      <Container>
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-5xl font-black text-[#3b312b]">대시보드</h1>

          </div>
          <p className="text-lg text-gray-500 font-medium">
            환영합니다, {user?.name ?? "사용자"}님!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatItem
            title="진행 중 프로젝트"
            value="3"
            icon={LayoutGrid}
            color="text-blue-500"
          />
          <StatItem
            title="생성된 광고"
            value="12"
            icon={ImageIcon}
            color="text-green-500"
          />
          <StatItem
            title="SNS 게시 수"
            value="24"
            icon={TrendingUp}
            color="text-purple-500"
          />

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                최근 활동
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                최근에 수행한 작업들입니다
              </p>
              <div className="space-y-4">
                {activities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-6 bg-[#F9FAFB] rounded-3xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {item.desc}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{item.time}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="h-full border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                바로 시작하기
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                빠른 작업을 시작하세요
              </p>
              <div className="flex flex-col gap-4">
                <QuickButton
                  icon={Package}
                  label="제품 관리"
                  onClick={() => navigator("/dashboard/products")}
                />
                <QuickButton
                  icon={Share2}
                  label="SNS 관리"
                  onClick={() => navigator("/dashboard/sns")}
                />
                <QuickButton
                  icon={FileText}
                  label="분석 & 리포트"
                  onClick={() => navigator("/dashboard/analytics")}
                />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

function StatItem({ title, value, icon: Icon, color }) {
  return (
    <Card className="flex h-44 flex-col justify-between border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-sm font-bold tracking-tight text-gray-400">
          {title}
        </span>
        {Icon && <Icon size={22} className={color} strokeWidth={2.5} />}
      </div>
      <div className="text-4xl font-black text-gray-900">{value}</div>
    </Card>
  );
}

function QuickButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-5 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm"
    >
      {Icon && <Icon size={20} className="text-gray-400" />}
      {label}
    </button>
  );
}
