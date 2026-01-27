import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import SignupPage from "@/pages/SignupPage";
import PrivacyConsentPage from "@/pages/PrivacyPolicyPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";

import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/qna/QnAPage";
import QnaWritePage from "@/pages/qna/QnaWritePage";
import QnaDetailPage from "@/pages/qna/QnaDetailPage";

import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateADPage from "@/pages/createAD/CreateADPage";
import CreateADResultPage from "@/pages/createAD/CreateADResultPage";
import SnsManagementPage from "@/pages/SnsManagement.jsx";
import ProductManagementPage from "@/pages/ProductManagement";
import ProductAdStatusPage from "@/pages/ProductAdStatus";

export default function App() {
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
        <Route path="/dashboard/createAD/result" element={<CreateADResultPage />} />
        <Route path="/dashboard/sns" element={<SnsManagementPage />} />
        <Route path="/dashboard/products" element={<ProductManagementPage />} />
        <Route
          path="/dashboard/products/:productId"
          element={<ProductAdStatusPage />}
        />
      </Routes>
    </Layout>
  );
}
