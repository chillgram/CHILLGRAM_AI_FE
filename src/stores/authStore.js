// 역할: 인증 상태(AccessToken, 사용자, 로그인 여부)와 로그인 모달 상태를 전역으로 관리한다.
// 주의: 아래는 "토큰을 실제로 API 요청 Authorization 헤더에 붙여서" Spring(SecurityConfig) Bearer 인증과 맞추는 전제다.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ===== Auth State =====
      accessToken: null,
      user: null,
      isAuthenticated: false,

      // 앱 초기 부트스트랩 완료 여부(선택)
      bootstrapped: false,

      // ===== UI State (Auth Modal) =====
      isAuthModalOpen: false,
      authRedirectTo: null,

      // ===== Actions =====
      login: (accessToken, user) =>
        set({
          accessToken,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setBootstrapped: (value) => set({ bootstrapped: value }),

      openAuthModal: (redirectTo = null) =>
        set({
          isAuthModalOpen: true,
          authRedirectTo: redirectTo,
        }),

      closeAuthModal: () => set({ isAuthModalOpen: false }),

      clearAuthRedirect: () => set({ authRedirectTo: null }),

      // ===== Helpers =====
      // accessToken이 있는지 빠르게 체크
      hasToken: () => Boolean(get().accessToken),
    }),
    {
      name: "chillgram-auth", // localStorage key
      // 민감도 낮추려면 accessToken만 저장하지 말고 필요한 값만 골라 저장해라.
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
