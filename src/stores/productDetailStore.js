import { create } from "zustand";

export const useProductDetailStore = create((set) => ({
  // 현재 선택된 제품
  productId: null,
  productName: "",

  // 탭 타입
  selectedType: "base", // 기본값

  // Actions
  setProduct: (id, name) => set({ productId: id, productName: name }),
  setSelectedType: (type) => set({ selectedType: type }),
  clearProduct: () => set({ productId: null, productName: "" }),
}));
