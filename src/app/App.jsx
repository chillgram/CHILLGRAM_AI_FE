import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuthStore } from "@/stores/authStore";
import { refreshApi } from "@/data/authApi";
import PrivateRoute from "@/routes/PrivateRoute";

import SignupPage from "@/pages/SignupPage";
import SignupEmailSentPage from "@/pages/SignupEmailSentPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import PrivacyConsentPage from "@/pages/PrivacyConsentPage";

import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/qna/QnAPage";
import QnaWritePage from "@/pages/qna/QnaWritePage";
import QnaDetailPage from "@/pages/qna/QnaDetailPage";

import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import ADPage from "@/pages/ad/ADPage";
import ADResultPage from "@/pages/ad/ADResultPage";
import SnsManagementPage from "@/pages/SnsManagement.jsx";
import ProductManagementPage from "@/pages/ProductManagement";
import ProductAdStatusPage from "@/pages/ProductAdStatus";
import AnalyticsReportPage from "@/pages/AnalyticsReportPage";

export default function App() {
  const login = useAuthStore((s) => s.login);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  // 앱 시작 시 silent refresh (중요)
  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await refreshApi();
        login(accessToken);
      } catch {
        // refresh 없으면 비로그인
      } finally {
        setBootstrapped(true);
      }
    })();
  }, [login, setBootstrapped]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/sent" element={<SignupEmailSentPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy/consent" element={<PrivacyConsentPage />} />
        <Route path="/qna" element={<QnAPage />} />
        <Route path="/qna/new" element={<QnaWritePage />} />
        <Route path="/qna/:questionId" element={<QnaDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />

        {/* 로그인 라우트 */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/createAD" element={<ADPage />} />
          <Route
            path="/dashboard/createAD/result"
            element={<ADResultPage />}
          />
          <Route path="/dashboard/sns" element={<SnsManagementPage />} />
          <Route
            path="/dashboard/products"
            element={<ProductManagementPage />}
          />
          <Route
            path="/dashboard/products/:productId"
            element={<ProductAdStatusPage />}
          />
          <Route
            path="/dashboard/analytics"
            element={<AnalyticsReportPage />}
          />
        </Route>
      </Routes>
    </Layout>
  );
}
