import { create } from "zustand";

export const useProductDetailStore = create((set) => ({
  selectedType: "base", // 기본값
  setSelectedType: (type) => set({ selectedType: type }),
}));