import { create } from 'zustand';
import { PropertyFilterParams } from '@/lib/types';

interface FilterState {
    filters: Omit<PropertyFilterParams, 'pageNumber' | 'pageSize'>;
    pagination: {
        pageNumber: number;
        pageSize: number;
    };
    setFilters: (newFilters: Partial<Omit<PropertyFilterParams, 'pageNumber' | 'pageSize'>>) => void;
    setPageNumber: (page: number) => void;
    clearFilters: () => void;
}

const initialFilterState: FilterState['filters'] = {
    name: '',
    address: '',
    minPrice: undefined,
    maxPrice: undefined,
};

const initialPaginationState: FilterState['pagination'] = {
    pageNumber: 1,
    pageSize: 9, // 3x3 grid
};

export const useFilterStore = create<FilterState>((set) => ({
    filters: initialFilterState,
    pagination: initialPaginationState,
    setFilters: (newFilters) => 
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, pageNumber: 1 } // Reset to page 1 on filter change
        })),
    setPageNumber: (page) => set((state) => ({
        pagination: { ...state.pagination, pageNumber: page }
    })),
    clearFilters: () => set({ filters: initialFilterState, pagination: { ...initialPaginationState, pageNumber: 1 } }),
}));
