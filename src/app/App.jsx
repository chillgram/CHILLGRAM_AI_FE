import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/QnAPage";
import QnaWritePage from "@/pages/QnaWritePage";
import { Layout } from "@/components/layout/Layout";
import ProductsPage from "@/pages/ProductsPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CreateADPage from "@/pages/createADPage";
import SignupPage from "@/pages/SignupPage";
import PrivacyConsentPage from "@/pages/PrivacyPolicyPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";

export default function App() {
  // sessionStorage에서 가져와 탭 유지 시에만 로그인 유지(탭 닫으면 로그인 풀림)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  // 로그인 상태 세션 스토리지 업데이트 핸들러
  const handleLoginState = (status) => {
    setIsLoggedIn(status);
    if (status) {
      sessionStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.removeItem("isLoggedIn");
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={handleLoginState}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy/consent" element={<PrivacyConsentPage />} />
        <Route path="/qna" element={<QnAPage />} />
        <Route path="/qna/new" element={<QnaWritePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/createAD" element={<CreateADPage />} />
      </Routes>
    </Layout>
  );
}
