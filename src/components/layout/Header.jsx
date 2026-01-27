import { useState } from "react";
import Logo from "@/assets/image/chillgram_logo_sv.png";
import { Brand } from "../common/Brand";
import { NavMenu } from "../common/NavMenu";
import { CtaButton } from "../common/CtaButton";
import { AuthModal } from "../auth/AuthModal";
import Button from "../common/Button";

export function Header({ isLoggedIn, setIsLoggedIn }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const brand = { logoSrc: Logo, name: "chillgram", href: "/" };

  const handleDashboardClick = (event) => {
    if (!isLoggedIn) {
      event.preventDefault();
      setIsAuthOpen(true);
    }
  };

  const links = [
    {
      label: "대시보드",
      href: isLoggedIn ? "/dashboard" : "#",
      onClick: handleDashboardClick,
    },
    { label: "Q&A", href: "/qna" },
  ];

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <>
      <header className="w-full bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Brand logoSrc={brand.logoSrc} name={brand.name} href={brand.href} />

          <div className="flex items-center gap-8">
            <NavMenu links={links} />

            {isLoggedIn ? (
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <CtaButton label="로그인" onClick={() => setIsAuthOpen(true)} />
            )}
          </div>
        </div>
        <div className="h-px w-full bg-gray-200" />
      </header>

      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
