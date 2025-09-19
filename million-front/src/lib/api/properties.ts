import apiClient from './client';
import {
  Property,
  PropertyFilterParams,
  CreatePropertyPayload,
  UpdatePropertyPricePayload,
  PagedResponse,
  AddImagePayload,
  PropertyTrace,
} from '../types';

export const getProperties = (
  filters: PropertyFilterParams
): Promise<PagedResponse<Property>> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return apiClient(`properties?${params.toString()}`);
};

export const getPropertyById = (id: string): Promise<Property> => {
  return apiClient(`properties/${id}`);
};

export const createProperty = (
  propertyData: CreatePropertyPayload
): Promise<{ idProperty: string }> => {
  // El backend devuelve directamente el Guid, lo envolvemos en el objeto esperado.
  return apiClient('properties', { data: propertyData }).then((id) => ({
    idProperty: id as unknown as string,
  }));
};

export const updatePropertyPrice = (
  id: string,
  payload: UpdatePropertyPricePayload
): Promise<void> => {
  return apiClient(`properties/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

export const deleteProperty = (id: string): Promise<void> => {
  return apiClient(`properties/${id}`, { method: 'DELETE' });
};

// --- Image Management ---

export const addImageToProperty = (
  id: string,
  payload: AddImagePayload
): Promise<{ imageId: string }> => {
  return apiClient(`properties/${id}/images`, {
    method: 'POST',
    data: payload,
  });
};

export const deletePropertyImage = (id: string, imageId: string): Promise<void> => {
  return apiClient(`properties/${id}/images/${imageId}`, { method: 'DELETE' });
};

// --- Property Traces ---

export const getPropertyTraces = (id: string): Promise<PropertyTrace[]> => {
  return apiClient(`properties/${id}/traces`);
};
