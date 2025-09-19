import { create } from 'zustand';
import { Property } from '@/lib/types';

interface ModalState {
    isOpen: boolean;
    mode: 'create' | 'edit';
    propertyToEdit?: Property;
    openModal: (mode: 'create' | 'edit', property?: Property) => void;
    closeModal: () => void;
}

export const usePropertyModalStore = create<ModalState>((set) => ({
    isOpen: false,
    mode: 'create',
    propertyToEdit: undefined,
    openModal: (mode, property) => set({ isOpen: true, mode, propertyToEdit: property }),
    closeModal: () => set({ isOpen: false, propertyToEdit: undefined }),
}));
