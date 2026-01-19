import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import QnAPage from "@/pages/QnAPage";
import { Layout } from "@/components/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qna" element={<QnAPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
