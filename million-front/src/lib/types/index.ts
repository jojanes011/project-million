// --- Entidades Base ---

export interface Owner {
  idOwner: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

export interface Property {
  idProperty: string;
  idOwner: string;
  ownerName: string;
  ownerPhoto: string;
  name: string;
  address: string;
  price: number;
  year: number;
  image: string;
}

// --- Nuevos DTOs para gestión de imágenes ---

export interface PropertyImage {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface AddImageRequestDto {
  imageFile: File; // Para FormData
}

export interface AddImagePayload {
  imageUrl: string;
  publicId: string;
}

export interface PropertyTrace {
  idPropertyTrace: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  idProperty: string;
}

// --- API Envelopes ---
export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: T[];
}

// --- API Payloads & Parámetros ---

// GET /api/properties
export interface PropertyFilterParams {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
}

// POST /api/properties (Nota: ya no incluye imageFile)
export interface CreatePropertyPayload {
  name: string;
  address: string;
  price: number;
  year: number;
  idOwner: string;
}

export interface AddImagePayload {
  imageUrl: string;
  publicId: string;
}

// PUT /api/properties/{id}
export interface UpdatePropertyPricePayload {
  price: number;
}

// GET /api/owners (simple version for dropdowns)
export type OwnerSummary = Pick<Owner, 'idOwner' | 'name'>;

// POST /api/owners
export interface CreateOwnerPayload {
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

// PUT /api/owners/{id}
export interface UpdateOwnerPayload {
  idOwner: string;
  name: string;
  address: string;
  photo?: string;
  birthday?: string;
}

// --- Respuestas de Endpoints ---

// POST /api/properties (respuesta)
export interface CreatePropertyResponse {
  idProperty: string; // El GUID de la nueva propiedad
}

// POST /api/properties/{id}/images (respuesta)
export interface AddImageResponse {
  imageId: string; // El GUID de la nueva imagen
}

// GET /api/properties/{id}/images (respuesta)
export type PropertyImagesResponse = PropertyImage[];

// --- Tipos de utilidad ---

// Para filtrar owners por búsqueda
export interface OwnerFilterParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Para respuestas de error consistentes
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Para respuestas de éxito genéricas
export interface ApiSuccessResponse {
  message: string;
  data?: unknown;
}
