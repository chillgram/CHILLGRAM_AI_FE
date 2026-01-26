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
  // 초기값을 로컬 스토리지에서 가져와 새로고침 시에도 상태 유지 시킴
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // 로그인 상태 로컬 스토리지 업데이트
  const handleLoginState = (status) => {
    setIsLoggedIn(status);
    if (status) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
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
