import { Header } from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { CreateADHeader } from "./CreateADHeader";

export function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdCreatePage = pathname.startsWith("/dashboard/createAD");
  return (
    <div className="min-h-dvh flex flex-col bg-[#f5f5f5] h-2 w-full">
      {isAdCreatePage ? <CreateADHeader /> : <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}