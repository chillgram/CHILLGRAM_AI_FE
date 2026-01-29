import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  isAuthenticated: false,
  bootstrapped: false,

  login: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),

  setBootstrapped: (value) => set({ bootstrapped: value }),
}));
