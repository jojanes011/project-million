import { create } from 'zustand';

interface PropertyTraceModalState {
    isOpen: boolean;
    propertyInfo?: { id: string; name: string };
    openModal: (id: string, name: string) => void;
    closeModal: () => void;
}

export const usePropertyTraceModalStore = create<PropertyTraceModalState>((set) => ({
    isOpen: false,
    propertyInfo: undefined,
    openModal: (id, name) => set({ isOpen: true, propertyInfo: { id, name } }),
    closeModal: () => set({ isOpen: false, propertyInfo: undefined }),
}));
