import { create } from "zustand";
import { Parent, Game, Course, Category, Admin, Payment } from "@/types";
export type SheetType = "admin-form" | "game-form" | "course-form" | "category-form" | "parent-form" | "payment-form" | "read-along-form";

interface SheetData {
  mode?: "create" | "edit";
  parent?: Parent | null;
  game?: Game | null;
  course?: Course | null;
  admin?: Admin | null;
  category?: Category | null;
  payment?:Payment | null;
}

interface SheetStore {
  type: SheetType | null;
  data: SheetData;
  isOpen: boolean;
  openSheet: (type: SheetType, data?: SheetData) => void;
  onClose: () => void;
}

export const useSheet = create<SheetStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openSheet: (type: SheetType, data = {}) => {
    set({ type, isOpen: true, data });
  },
  onClose: () => {
    set({ type: null, isOpen: false, data: {} });
  },
}));
