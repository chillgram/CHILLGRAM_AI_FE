// 제목에서 create 제거
import { Clapperboard, ImageUp, Package, Smartphone } from "lucide-react";

// PRODUCT_OPTIONS는 PRODUCTS로 대체
// - label >> name으로 대체
// - value >> value로 대체

// STEP_LABELS >> ad.js로 분리
export const STEP_LABELS = [
  "정보 입력",
  "가이드 선택",
  "광고 문구 선택",
  "콘텐츠 생성",
];

export const AD_GOAL_OPTIONS = [
  { value: "brand", label: "브랜드 인지도 강화" },
  { value: "sales", label: "구매 전환 증대" },
  { value: "repeat", label: "재구매 유도" },
];

export const CONTENT_TIP =
  "여러 타입을 선택하여 다양한 채널에 맞는 광고를 한 번에 생성할 수 있습니다.";

export const TREND_SUMMARY =
  "현재 식품 업계의 트렌드를 분석하여 최적의 키워드를 추천합니다.";

// trend관련 데이터(TREND_KEYWORDS TREND_HASHTAGS TREND_STYLE_SUMMARY TREND_AI_GUIDE_OPTIONS)는 trend 데이터로 분리

// API에서 제공받을 예정
// 광고 카피문구 생성 데이터
export const AD_COPY_OPTIONS = [
  {
    title: "행복한 순간",
    description:
      "작은 행복이 모여 큰 추억이 됩니다. 당신의 특별한 순간을 더욱 달콤하게.",
  },
  {
    title: "따뜻한 마음",
    description:
      "마음을 담아 정성스럽게 만든 달콤함. 소중한 사람과 함께 나누세요.",
  },
  {
    title: "일상의 여유",
    description: "바쁜 하루 속 작은 쉼표. 달콤한 여유로 일상을 채워보세요.",
  },
];

// CONTENT_TYPE_OPTIONS >> ad.js로 분리
export const AD_CONTENT_TYPE_OPTIONS = [
  {
    title: "제품 이미지 AI",
    description: "제품 사진을 AI로 생성",
    icon: Image,
  },
  { title: "패키지 시안 AI", description: "패키지 디자인 시안", icon: Package },
  {
    title: "SNS 이미지 AI",
    description: "소셜미디어용 이미지",
    icon: Smartphone,
  },
  { title: "숏츠 AI", description: "짧은 영상 콘텐츠", icon: Clapperboard },
  { title: "배너 이미지 AI", description: "광고 배너 이미지", icon: ImageUp },
];
