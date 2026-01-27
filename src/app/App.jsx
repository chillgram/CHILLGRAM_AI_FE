import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/qna/QnAPage";
import QnaWritePage from "@/pages/qna/QnaWritePage";
import QnaDetailPage from "@/pages/qna/QnaDetailPage";
import { Layout } from "@/components/layout/Layout";
import ProductsPage from "@/pages/ProductsPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CreateADPage from "@/pages/createAD/CreateADPage";
import CreateADStep1Page from "@/pages/createAD/CreateADStep1Page";
import CreateADStep2Page from "@/pages/createAD/CreateADStep2Page";
import CreateADStep3Page from "@/pages/createAD/CreateADStep3Page";
import CreateADStep4Page from "@/pages/createAD/CreateADStep4Page";
import CreateADStep5Page from "@/pages/createAD/CreateADStep5Page";
import SignupPage from "@/pages/SignupPage";
import PrivacyConsentPage from "@/pages/PrivacyPolicyPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import SnsManagementPage from "@/pages/SnsManagement.jsx";

export default function App() {
  // sessionStorage에서 로그인 상태를 유지
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

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
        <Route path="/qna/:questionId" element={<QnaDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/createAD" element={<CreateADPage />} />
        <Route path="/dashboard/createAD/step-1" element={<CreateADStep1Page />} />
        <Route path="/dashboard/createAD/step-2" element={<CreateADStep2Page />} />
        <Route path="/dashboard/createAD/step-3" element={<CreateADStep3Page />} />
        <Route path="/dashboard/createAD/step-4" element={<CreateADStep4Page />} />
        <Route path="/dashboard/createAD/step-5" element={<CreateADStep5Page />} />
        <Route path="/dashboard/sns" element={<SnsManagementPage />} />
      </Routes>
    </Layout>
  );
}
