import apiClient from './client';
import { 
    OwnerSummary,
    CreateOwnerPayload,
    UpdateOwnerPayload
} from '../types';

export const getOwners = (): Promise<OwnerSummary[]> => {
    return apiClient('owners');
};

export const createOwner = (ownerData: CreateOwnerPayload): Promise<{ id: string }> => {
    return apiClient('owners', { data: ownerData });
};

export const updateOwner = (id: string, ownerData: UpdateOwnerPayload): Promise<void> => {
    if (id !== ownerData.idOwner) {
        return Promise.reject(new Error("El ID del propietario en la URL y en los datos no coinciden."));
    }
    return apiClient(`owners/${id}`, {
        method: 'PUT',
        data: ownerData,
    });
};

export const deleteOwner = (id: string): Promise<void> => {
    return apiClient(`owners/${id}`, { method: 'DELETE' });
};
