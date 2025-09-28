import { create } from "zustand";

export type ModalType = "confirmation-model" | "media-uplaod-model" | "parent-id-model" ;

interface ModalData {
  handleConfirm?: () => void;
  confirmText?: string;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  chapterId?: string;
  handleUpdate?: (files?: Array<{
    key: string;
    url: string;
    name: string;
    originalName: string;
    size: number;
    category: string;
  }>) => void;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  openModal: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type: ModalType, data = {}) => {
    set({ type, isOpen: true, data });
  },
  onClose: () => {
    set({ type: null, isOpen: false });
  },
}));
