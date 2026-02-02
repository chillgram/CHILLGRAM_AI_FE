import { Header } from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { ADHeader } from "./ADHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export function Layout({ children, isLoggedIn, setIsLoggedIn }) {
  const { pathname } = useLocation();

  const isAdCreatePage = pathname === "/dashboard/createAD";
  const isAuthOnlyPage = pathname.startsWith("/signup");

  return (
    // 선우님과 충돌 해결을 위해 min-h-dvh로 수정 했습니다
    <div className="min-h-dvh flex flex-col bg-white w-full">
      {!isAuthOnlyPage && (
        <ErrorBoundary>
          {isAdCreatePage ? (
            <ADHeader />
          ) : (
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          )}
        </ErrorBoundary>
      )}

      <main className="flex-1">{children}</main>
      {!isAuthOnlyPage && (
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      )}
    </div>
  );
}
