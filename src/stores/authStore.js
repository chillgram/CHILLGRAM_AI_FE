import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null, // user info
  isAuthenticated: false,
  bootstrapped: false,
  isAuthModalOpen: false, // 로그인 모달 상태
  authRedirectTo: null, // 로그인 후 리다이렉트 URL

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

  openAuthModal: (redirectTo = null) => set({ isAuthModalOpen: true, authRedirectTo: redirectTo }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  clearAuthRedirect: () => set({ authRedirectTo: null }),
}));
