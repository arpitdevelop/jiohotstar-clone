import { HomeCategory } from "@/types/home";
import { create } from "zustand";

interface HomeCategoryState {
  category: HomeCategory;
  setCategory: (category: HomeCategory) => void;
}

export const useHomeCategoryStore = create<HomeCategoryState>((set) => ({
  category: "Movies",
  setCategory: (category) => set({ category }),
}));
