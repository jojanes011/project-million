"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, createProperty, updatePropertyPrice, deleteProperty, addImageToProperty } from '@/lib/api/properties';
import { PropertyFilterParams, CreatePropertyPayload, UpdatePropertyPricePayload, Property, PagedResponse } from '@/lib/types';
import { AddImagePayload } from '@/lib/types';

const PROPERTIES_QUERY_KEY = 'properties';

export const useProperties = (filters: PropertyFilterParams) => {
    return useQuery<PagedResponse<Property>, Error>({
        queryKey: [PROPERTIES_QUERY_KEY, filters],
        queryFn: () => getProperties(filters),
    });
};

export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProperty: CreatePropertyPayload) => createProperty(newProperty),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
        },
    });
};

export const useUpdatePropertyPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdatePropertyPricePayload }) => 
            updatePropertyPrice(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY, variables.id] });
        },
    });
};

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProperty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
        },
    });
};

export const useAddImageToProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AddImagePayload }) =>
            addImageToProperty(id, payload),
        onSuccess: (_, variables) => {
            // Invalidate both the list of properties and the specific property details
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY, variables.id] });
        },
    });
};
