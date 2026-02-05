import { httpJson } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ADPage에서 사용하는 광고 생성 API
 * 
 * {
  "productId": "PRODUCT_001",
  "adGoal": "BRAND_AWARENESS",
  "requestText": "광고에 포함하고 싶은 내용",
  "selectedKeywords": ["미니멀", "친환경"],
  "selectedGuide": "감성적 스토리텔링",
  "selectedCopy": "하루의 시작을 바꾸다",
  "selectedTypes": ["SNS 이미지 AI", "배너 이미지 AI"],
  "uploadFileName": "design.pdf"
 * }
 */
export async function createAd({
  productId,
  adGoal,
  requestText,
  selectedKeywords,
  selectedGuide,
  selectedCopy,
  selectedTypes,
  uploadFileName,
}) {
  const response = await fetch(`${BASE_URL}/ads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      productId,
      adGoal,
      requestText,
      selectedKeywords,
      selectedGuide,
      selectedCopy,
      selectedTypes,
      uploadFileName: uploadFileName || null,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "광고 생성 실패");
  }

  return response.json();
}

export async function fetchAdTrends({ productId, date }) {
  const body = date ? { date } : {};
  
  return httpJson(`/api/products/${productId}/ad-trends`, {
    method: "POST",
    body,
  });
}

export function fetchAdGuides(payload) {
  return httpJson(`/api/products/${payload.productId}/ad-guides`, {
    method: "POST",
    body: payload,
  });
}

export function fetchAdCopies(payload) {
  return httpJson(`/api/products/${payload.productId}/ad-copies`, {
    method: "POST",
    body: payload,
  });
}

export function createAdContents(payload) {
  return httpJson(`/api/products/${payload.productId}/ads`, {
    method: "POST",
    body: payload,
  });
}