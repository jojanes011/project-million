# Guía Completa: Subida de Imágenes desde el Frontend

## 📸 Sistema de Subida de Imágenes - Explicación Completa

### 🎯 **¿Cómo funciona actualmente?**

El backend tiene un sistema **simulado** de subida de imágenes que:

1. **Recibe** archivos via `multipart/form-data`
2. **Valida** tipo, tamaño y existencia de propiedad
3. **Simula** el almacenamiento guardando una ruta local
4. **Registra** la imagen en la base de datos
5. **Devuelve** el ID de la imagen creada

### 🚀 **Implementación en el Frontend**

#### **1. HTML Form Básico**
```html
<form id="uploadForm" enctype="multipart/form-data">
  <input type="file" id="imageInput" accept="image/*" />
  <button type="submit">Subir Imagen</button>
</form>
```

#### **2. JavaScript/TypeScript - Método 1 (FormData nativo)**
```typescript
async function uploadImage(propertyId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData, // NO incluir Content-Type, el browser lo setea automáticamente
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.imageId; // Retorna el ID de la imagen
}
```

#### **3. JavaScript/TypeScript - Método 2 (Con validación previa)**
```typescript
async function uploadImageWithValidation(propertyId: string, file: File): Promise<string> {
  // Validación del lado del cliente (opcional pero recomendado)
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 5MB.');
  }

  // Crear FormData y enviar
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.imageId;
}
```

#### **4. React - Ejemplo Completo**
```tsx
import React, { useState } from 'react';

interface ImageUploadProps {
  propertyId: string;
  onImageUploaded: (imageId: string) => void;
}

export function ImageUpload({ propertyId, onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const imageId = await uploadImage(propertyId, file);
      onImageUploaded(imageId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {uploading && <p>Subiendo imagen...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

// Función auxiliar
async function uploadImage(propertyId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const result = await response.json();
  return result.imageId;
}
```

#### **5. Vue.js - Ejemplo**
```vue
<template>
  <div>
    <input
      type="file"
      @change="handleFileUpload"
      accept="image/*"
      :disabled="uploading"
    />

    <div v-if="uploading">Subiendo imagen...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Imagen subida exitosamente!</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  propertyId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  imageUploaded: [imageId: string];
}>();

const uploading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    uploading.value = true;
    error.value = null;
    success.value = false;

    const imageId = await uploadImage(props.propertyId, file);

    success.value = true;
    emit('imageUploaded', imageId);

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    uploading.value = false;
  }
};

async function uploadImage(propertyId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const result = await response.json();
  return result.imageId;
}
</script>
```

### 🔧 **Validaciones y Manejo de Errores**

#### **Validaciones del Backend**
- ✅ **Archivo requerido**: No puede ser nulo/vacío
- ✅ **Tipos permitidos**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- ✅ **Tamaño máximo**: 5MB por archivo
- ✅ **Propiedad existe**: Valida que el ID de propiedad sea válido

#### **Códigos de Error**
```typescript
// Manejo de errores específico
if (response.status === 400) {
  // Error de validación (tipo, tamaño, archivo inválido)
  const error = await response.json();
  showError(`Archivo inválido: ${error.message}`);
} else if (response.status === 404) {
  // Propiedad no encontrada
  showError('La propiedad especificada no existe');
} else if (response.status === 500) {
  // Error del servidor
  showError('Error interno del servidor');
}
```

### 📦 **Consideraciones para Producción**

#### **1. Almacenamiento Real**
Actualmente el backend **simula** el almacenamiento guardando rutas locales:
```csharp
var filePath = Path.Combine("uploads", "images", fileName);
```

En producción necesitarás:
- **AWS S3** o **Azure Blob Storage**
- **Cloudinary** o **Imgix** para optimización
- **CDN** para distribución rápida

#### **2. URLs de Imágenes**
Las imágenes se devolverán como URLs. En desarrollo:
```json
{
  "image": "uploads/images/12345678-1234-1234-1234-123456789abc.jpg"
}
```

En producción:
```json
{
  "image": "https://cdn.midominio.com/images/12345678-1234-1234-1234-123456789abc.jpg"
}
```

#### **3. Optimización**
- **Compresión automática** de imágenes
- **Formatos modernos** (WebP, AVIF)
- **Lazy loading** en el frontend
- **Thumbnails** para diferentes tamaños

### 🎯 **Resumen para el Frontend**

1. **Usar `FormData`** para enviar archivos
2. **NO incluir `Content-Type`** en headers (automático)
3. **Validar archivos** del lado del cliente antes de enviar
4. **Manejar errores** específicos del backend
5. **Mostrar progreso** de subida si es necesario
6. **Actualizar UI** después de subida exitosa

### 🚀 **Ejemplo Rápido de Uso**

```typescript
// Subir imagen cuando el usuario selecciona un archivo
const fileInput = document.getElementById('imageInput') as HTMLInputElement;

fileInput.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const imageId = await uploadImage('property-id-aqui', file);
      console.log('Imagen subida:', imageId);
      // Actualizar la UI con la nueva imagen
    } catch (error) {
      console.error('Error:', error);
      // Mostrar error al usuario
    }
  }
});
```

¿Te gustaría que te ayude con algún aspecto específico de la implementación frontend o que mejore alguna parte del sistema de imágenes?
