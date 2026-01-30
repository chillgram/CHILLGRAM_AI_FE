import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null, // user info
  isAuthenticated: false,
  bootstrapped: false,

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
}));
