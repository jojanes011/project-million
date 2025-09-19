import { create } from 'zustand';

interface OwnerModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useOwnerModalStore = create<OwnerModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
