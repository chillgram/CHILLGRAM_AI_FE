import { Header } from "./Header";
import Footer from "./Footer";

export function Layout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}