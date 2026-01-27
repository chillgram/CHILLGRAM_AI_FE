import Card from "@/components/common/Card";
import {
  Clapperboard,
  Image,
  ImageUp,
  Lightbulb,
  Package,
  Smartphone,
  Sparkles,
} from "lucide-react";

const CONTENT_TYPE_OPTIONS = [
  { title: "제품 이미지 AI", description: "제품 사진을 AI로 생성", icon: Image },
  { title: "패키지 시안 AI", description: "패키지 디자인 시안", icon: Package },
  { title: "SNS 이미지 AI", description: "소셜미디어용 이미지", icon: Smartphone },
  { title: "숏츠 AI", description: "짧은 영상 콘텐츠", icon: Clapperboard },
  { title: "배너 이미지 AI", description: "광고 배너 이미지", icon: ImageUp },
];

const CONTENT_TIP =
  "여러 타입을 선택하여 다양한 채널에 맞는 광고를 한 번에 생성할 수 있습니다.";

export default function CreateADStep5Page({ selectedTypes, onToggleType }) {
  return (
    <section>
      <Card className="rounded-2xl border border-gray-100 bg-white p-8">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900">콘텐츠 생성</h2>
          <p className="mt-1 text-xs text-gray-500">최종 광고 콘텐츠 생성</p>
        </div>

        <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4 text-green-700">
          <Sparkles className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">광고 콘텐츠 생성 준비 완료</p>
            <p className="mt-1">선택한 옵션으로 다양한 형태의 광고 콘텐츠를 생성합니다.</p>
          </div>
        </div>

        <p className="mb-3 font-semibold">생성할 콘텐츠 타입 선택 (복수 선택 가능)</p>
        <div className="grid grid-cols-2 gap-3">
          {CONTENT_TYPE_OPTIONS.map((type) => {
            const isSelected = selectedTypes.includes(type.title);
            const Icon = type.icon;
            return (
              <button
                key={type.title}
                type="button"
                onClick={() => onToggleType(type.title)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  isSelected ? "border-green-300 bg-green-50" : "border-gray-100"
                }`}
              >
                <Icon className="mb-2 h-5 w-5 text-gray-700" />
                <p className="text-sm font-medium text-gray-900">{type.title}</p>
                <p className="mt-1 text-xs text-gray-500">{type.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-yellow-50 p-4 text-xs text-yellow-700">
          <Lightbulb className="mt-0.5 h-4 w-4" />
          <span>Tip: {CONTENT_TIP}</span>
        </div>
      </Card>
    </section>
  );
}
