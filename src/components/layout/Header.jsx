import { useState, useEffect } from "react";
import Logo from "@/assets/image/logo.png";
import { Brand } from "@/components/common/Brand";
import { NavMenu } from "@/components/common/NavMenu";
import { CtaButton } from "@/components/common/CtaButton";
import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/common/Button";

import { useAuthStore } from "@/stores/authStore";
import { logoutApi } from "@/data/authApi";

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  // 전역 상태와 동기화 (다른 컴포넌트에서 모달 열기 가능)
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);

  useEffect(() => {
    if (isAuthModalOpen) {
      setIsAuthOpen(true);
      closeAuthModal(); // 전역 상태 리셋
    }
  }, [isAuthModalOpen, closeAuthModal]);

  const brand = { logoSrc: Logo, name: "chillgram", href: "/" };

  const handleDashboardClick = (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      setIsAuthOpen(true);
    }
  };

  const user = useAuthStore((s) => s.user);
  const isAdmin =
    true || // 개발용! 이 줄 주석 해제하면 관리자 모드 강제 적용 됩니다
    user?.role === "ADMIN" ||
    user?.email === "admin@chillgram.com";

  const links = [
    ...(isAdmin
      ? [
          {
            label: "관리자 대시보드",
            href: "/admin",
          },
        ]
      : []),
    {
      label: isAdmin ? "운영자 대시보드" : "대시보드",
      href: isAuthenticated ? "/dashboard" : "#",
      onClick: handleDashboardClick,
    },
    { label: "Q&A", href: "/qna" },
  ];

  const handleLogout = async () => {
    await logoutApi(); // refresh 쿠키 무효화
    logout(); // accessToken 메모리 제거
    alert("로그아웃 되었습니다.");
  };

  return (
    <>
      <header className="w-full bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Brand logoSrc={brand.logoSrc} name={brand.name} href={brand.href} />

          <div className="flex items-center gap-8">
            <NavMenu links={links} />

            {isAuthenticated ? (
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

      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
