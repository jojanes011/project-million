"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOwners, createOwner, updateOwner, deleteOwner } from '@/lib/api/owners';
import { CreateOwnerPayload, UpdateOwnerPayload } from '@/lib/types';

const OWNERS_QUERY_KEY = 'owners';

export const useOwners = () => {
    return useQuery({
        queryKey: [OWNERS_QUERY_KEY],
        queryFn: getOwners,
    });
};

export const useCreateOwner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newOwner: CreateOwnerPayload) => createOwner(newOwner),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
        },
    });
};

export const useUpdateOwner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdateOwnerPayload }) => 
            updateOwner(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
        },
    });
};

export const useDeleteOwner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteOwner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [OWNERS_QUERY_KEY] });
        },
    });
};
