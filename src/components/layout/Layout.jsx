import { Header } from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { CreateADHeader } from "./CreateADHeader";

export function Layout({ children, isLoggedIn, setIsLoggedIn }) {
  const { pathname } = useLocation();

  const isAdCreatePage = pathname.startsWith("/dashboard/createAD");

  return (
    // 선우님과 충돌 해결을 위해 min-h-dvh로 수정 했습니다
    <div className="min-h-dvh flex flex-col bg-white w-full">
      {isAdCreatePage ? (
        <CreateADHeader />
      ) : (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
