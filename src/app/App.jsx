import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/QnAPage";
import { Layout } from "@/components/layout/Layout";
import ProductsPage from "../pages/ProductsPage";
import DashboardPage from "../pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qna" element={<QnAPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
