# 🚀 Guía Completa: Integración con Cloudinary

## Implementación de Subida de Imágenes con Cloudinary

### 🎯 **¿Por qué Cloudinary?**

- ✅ **Optimización automática** de imágenes
- ✅ **Entrega CDN global** rápida
- ✅ **Transformaciones** en tiempo real
- ✅ **Almacenamiento confiable** y escalable
- ✅ **API simple** y bien documentada

### 📝 **Paso 1: Configuración de Cloudinary**

#### 1. Crear cuenta en Cloudinary
1. Ve a [cloudinary.com](https://cloudinary.com)
2. Regístrate (plan gratuito incluye 25GB y 25GB de transferencias)
3. Obtén tus credenciales del Dashboard

#### 2. Instalar SDK de Cloudinary
```bash
npm install cloudinary
# o
yarn add cloudinary
```

### 🛠️ **Paso 2: Implementación en el Frontend**

#### **Configuración de Cloudinary**
```typescript
// config/cloudinary.ts
import { Cloudinary } from 'cloudinary-core';

const cloudinaryConfig = {
  cloud_name: 'tu-cloud-name', // Reemplaza con tu cloud name
  api_key: 'tu-api-key',       // Solo para operaciones del lado del servidor
  api_secret: 'tu-api-secret', // Solo para operaciones del lado del servidor
  upload_preset: 'propiedades-preset' // Preset para subir imágenes
};

export const cloudinary = new Cloudinary({
  cloud_name: cloudinaryConfig.cloud_name,
  secure: true
});

export default cloudinaryConfig;
```

#### **Widget de Subida (Método 1 - Recomendado)**
```typescript
// components/ImageUploadWidget.tsx
import { useEffect, useRef } from 'react';

interface ImageUploadWidgetProps {
  onImageUploaded: (result: CloudinaryUploadResult) => void;
  propertyId?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function ImageUploadWidget({ onImageUploaded, propertyId }: ImageUploadWidgetProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: 'tu-cloud-name',
          uploadPreset: 'propiedades-preset',
          folder: `propiedades/${propertyId || 'general'}`,
          maxFiles: 5,
          maxFileSize: 5000000, // 5MB
          acceptedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          theme: 'minimal'
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            console.log('Imagen subida exitosamente:', result.info);
            onImageUploaded(result.info);
          }
        }
      );
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [propertyId, onImageUploaded]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button
      onClick={openWidget}
      className="upload-button"
      type="button"
    >
      📸 Subir Imágenes
    </button>
  );
}
```

#### **Subida Directa con Fetch (Método 2)**
```typescript
// utils/cloudinaryUpload.ts
export async function uploadToCloudinary(file: File, propertyId?: string): Promise<CloudinaryUploadResult> {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', 'propiedades-preset');
  formData.append('folder', `propiedades/${propertyId || 'general'}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/tu-cloud-name/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Error al subir imagen a Cloudinary');
  }

  const result = await response.json();
  return result;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}
```

#### **Componente de Subida Completo**
```tsx
// components/PropertyImageUpload.tsx
import React, { useState } from 'react';
import { ImageUploadWidget } from './ImageUploadWidget';
import { uploadToCloudinary, CloudinaryUploadResult } from '../utils/cloudinaryUpload';

interface PropertyImageUploadProps {
  propertyId: string;
  onImagesUpdated: (images: PropertyImage[]) => void;
}

interface PropertyImage {
  id: string;
  url: string;
  publicId: string;
  propertyId: string;
}

export function PropertyImageUpload({ propertyId, onImagesUpdated }: PropertyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Método 1: Usando Widget
  const handleWidgetUpload = async (result: CloudinaryUploadResult) => {
    try {
      setUploading(true);
      setError(null);

      // Registrar imagen en el backend
      const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: result.secure_url,
          publicId: result.public_id
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar imagen en el backend');
      }

      const backendResult = await response.json();
      console.log('Imagen registrada:', backendResult);

      // Actualizar lista de imágenes
      await loadPropertyImages();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  // Método 2: Usando input file directo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Subir a Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file, propertyId);

      // Registrar en backend
      const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar imagen en el backend');
      }

      const backendResult = await response.json();
      console.log('Imagen registrada:', backendResult);

      // Actualizar lista de imágenes
      await loadPropertyImages();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const loadPropertyImages = async () => {
    try {
      const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`);
      if (!response.ok) throw new Error('Error al cargar imágenes');

      const images = await response.json();
      onImagesUpdated(images);
    } catch (err) {
      console.error('Error al cargar imágenes:', err);
    }
  };

  return (
    <div className="image-upload">
      <h3>Subir Imágenes de la Propiedad</h3>

      {/* Método 1: Widget de Cloudinary */}
      <div className="upload-methods">
        <div className="method">
          <h4>Método 1: Widget Interactivo</h4>
          <ImageUploadWidget
            onImageUploaded={handleWidgetUpload}
            propertyId={propertyId}
          />
        </div>

        {/* Método 2: Input file directo */}
        <div className="method">
          <h4>Método 2: Selector de Archivo</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {uploading && <p>Subiendo imagen...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="upload-info">
        <p><strong>Formatos permitidos:</strong> JPG, PNG, GIF, WebP</p>
        <p><strong>Tamaño máximo:</strong> 5MB por imagen</p>
        <p><strong>Optimización:</strong> Cloudinary optimiza automáticamente las imágenes</p>
      </div>
    </div>
  );
}
```

### 🔧 **Paso 3: Configuración en Cloudinary**

#### **Crear Upload Preset**
1. Ve al Dashboard de Cloudinary
2. Ve a "Settings" → "Upload"
3. Crea un nuevo Upload Preset llamado "propiedades-preset"
4. Configura:
   - **Mode**: `Upload`
   - **Folder**: `propiedades/`
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Allowed formats**: `jpg,png,gif,webp`
   - **Max file size**: `5000000` (5MB)

#### **Configuración CORS (si usas widget)**
En "Settings" → "Security" → "CORS":
```
https://tu-dominio.com
http://localhost:3000
```

### 📱 **Paso 4: Optimización de Imágenes**

#### **URLs Optimizadas**
```typescript
// Imagen original
const originalUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

// Imagen optimizada para web (más pequeña)
const optimizedUrl = originalUrl.replace('/upload/', '/upload/q_auto,f_auto,w_800/');

// Thumbnail
const thumbnailUrl = originalUrl.replace('/upload/', '/upload/q_auto,f_auto,w_300,h_200,c_thumb,g_auto/');

// Imagen responsive
const responsiveUrl = originalUrl.replace('/upload/', '/upload/q_auto,f_auto,w_auto,c_scale/');
```

#### **Componente de Imagen Optimizada**
```tsx
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height,
  className,
  loading = 'lazy'
}: OptimizedImageProps) {
  // Crear URL optimizada
  const optimizedSrc = src.replace(
    '/upload/',
    `/upload/q_auto,f_auto,w_${width}${height ? `,h_${height},c_limit` : ''}/`
  );

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      onError={(e) => {
        console.error('Error al cargar imagen:', src);
        // Fallback a imagen de placeholder
        e.currentTarget.src = '/placeholder-image.jpg';
      }}
    />
  );
}
```

### 🗂️ **Paso 5: Gestión de Imágenes**

#### **Eliminar Imagen**
```typescript
export async function deletePropertyImage(propertyId: string, imageId: string): Promise<void> {
  // Eliminar del backend primero
  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images/${imageId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar imagen del backend');
  }

  // Opcional: Eliminar de Cloudinary también
  // Nota: Para esto necesitarías el publicId guardado en el backend
  // await deleteFromCloudinary(publicId);
}
```

#### **Obtener Imágenes de una Propiedad**
```typescript
export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`);

  if (!response.ok) {
    throw new Error('Error al obtener imágenes');
  }

  return response.json();
}
```

### 🎨 **Paso 6: UI/UX Recomendaciones**

#### **Estados de Carga**
```tsx
const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

const getUploadStateColor = () => {
  switch (uploadState) {
    case 'uploading': return '#007bff';
    case 'success': return '#28a745';
    case 'error': return '#dc3545';
    default: return '#6c757d';
  }
};
```

#### **Vista Previa de Imágenes**
```tsx
const [previewUrls, setPreviewUrls] = useState<string[]>([]);

const handleFileSelect = (files: FileList) => {
  const urls = Array.from(files).map(file => URL.createObjectURL(file));
  setPreviewUrls(urls);
};

// Limpiar URLs de preview para evitar memory leaks
useEffect(() => {
  return () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };
}, [previewUrls]);
```

### 🔒 **Paso 7: Seguridad**

#### **Validaciones del Lado del Cliente**
```typescript
const validateImage = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return 'Tipo de archivo no permitido';
  }

  if (file.size > maxSize) {
    return 'El archivo es demasiado grande (máximo 5MB)';
  }

  return null; // Válido
};
```

#### **Validaciones del Lado del Servidor**
```typescript
// En el backend ya tienes estas validaciones:
// - URL requerida
// - URL debe ser de Cloudinary
// - Propiedad debe existir
```

### 📊 **Paso 8: Monitoreo y Analytics**

#### **Tracking de Subidas**
```typescript
const trackImageUpload = (result: CloudinaryUploadResult) => {
  // Enviar a analytics (Google Analytics, Mixpanel, etc.)
  gtag('event', 'image_upload', {
    event_category: 'engagement',
    event_label: 'property_image',
    value: result.bytes,
    custom_parameters: {
      format: result.format,
      width: result.width,
      height: result.height
    }
  });
};
```

### 🎯 **Resumen de Beneficios**

✅ **Rendimiento**: Imágenes optimizadas automáticamente
✅ **Escalabilidad**: CDN global de Cloudinary
✅ **Simplicidad**: Backend solo guarda URLs
✅ **Fiabilidad**: Servicio profesional de imágenes
✅ **Flexibilidad**: Múltiples formatos y transformaciones
✅ **Costo**: Plan gratuito suficiente para desarrollo

### 🚀 **Implementación Rápida**

Para probar rápidamente:

1. **Configura Cloudinary** (5 minutos)
2. **Instala el SDK** (1 minuto)
3. **Copia el componente** de arriba (2 minutos)
4. **¡Listo!** Ya puedes subir imágenes

¿Te gustaría que te ayude con algún aspecto específico de la implementación o que te muestre cómo configurar algún caso de uso particular?
