# Guía de Backend para el Proyecto Frontend (Million)

Este documento sirve como guía para los desarrolladores del frontend, proporcionando todo el contexto necesario sobre la API del backend, sus endpoints, modelos de datos y comportamiento.

## 1. Visión General del Backend

-   **Stack Tecnológico**: .NET 9, C#, MongoDB
-   **Arquitectura**: Clean Architecture, CQRS con MediatR.
-   **URL Base (Local)**: `http://localhost:5124` (el puerto puede variar, revisa la consola al ejecutar `dotnet run`).
-   **Documentación Interactiva (Swagger)**: `http://localhost:5124/swagger` (✅ Completamente funcional con soporte para subida de imágenes)

## 2. Modelos de Datos (DTOs)

El frontend interactuará principalmente con los siguientes objetos JSON.

### PropertyDto

Este es el objeto que representa una propiedad en las respuestas de la API.

```json
{
  "idProperty": "550e8400-e29b-41d4-a716-446655440011",
  "idOwner": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "ownerName": "Juan Perez",
  "name": "Casa de Playa de Lujo",
  "address": "123 Avenida del Mar",
  "price": 750000,
  "image": "url_de_la_imagen.jpg"
}
```

### AddImageRequestDto

DTO utilizado para subir imágenes a una propiedad existente.

```json
{
  "imageFile": "archivo_de_imagen" // Archivo binario (IFormFile)
}
```

### PagedResponse<T>

Las respuestas de listados (como obtener propiedades) vendrán envueltas en este objeto para manejar la paginación.

```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50,
  "data": [
    // Array de PropertyDto
  ]
}
```

## 3. Endpoints de la API

A continuación se detallan todos los endpoints disponibles.

---

### Endpoints de Propiedades (`/api/properties`)

#### a) Obtener Lista de Propiedades (con Filtros y Paginación)
- **Endpoint**: `GET /api/properties`
- **Método**: `GET`
- **Descripción**: Devuelve una lista paginada de propiedades. Se pueden aplicar filtros.
- **Parámetros de Consulta (Query Params)**:
    -   `name` (string, opcional): Filtra por propiedades cuyo nombre contenga el texto.
    -   `address` (string, opcional): Filtra por propiedades cuya dirección contenga el texto.
    -   `minPrice` (decimal, opcional): Filtra por propiedades con un precio mayor o igual.
    -   `maxPrice` (decimal, opcional): Filtra por propiedades con un precio menor o igual.
    -   `pageNumber` (int, opcional, por defecto: `1`): El número de página a obtener.
    -   `pageSize` (int, opcional, por defecto: `10`): El número de resultados por página.
- **Respuesta Exitosa (200 OK)**: Un objeto `PagedResponse<PropertyDto>`.

---

### b) Obtener Propiedad por ID

-   **Endpoint**: `GET /api/properties/{id}`
-   **Método**: `GET`
-   **Descripción**: Devuelve una propiedad específica por su ID, incluyendo información completa del owner.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID único de la propiedad a obtener.
-   **Respuesta Exitosa (200 OK)**: Un objeto `PropertyDto` con toda la información de la propiedad.
-   **Respuesta de Error (404 Not Found)**: Si la propiedad no existe.

---

### c) Crear una Nueva Propiedad

-   **Endpoint**: `POST /api/properties`
-   **Método**: `POST`
-   **Descripción**: Crea una nueva propiedad. **Importante**: Se debe proporcionar un `idOwner` válido que ya exista en la base de datos. La imagen se puede agregar posteriormente usando el endpoint de subida de imágenes.
-   **Cuerpo de la Petición (Request Body)**:
    ```json
    {
      "name": "Casa Nueva",
      "address": "Calle Falsa 123",
      "price": 300000,
      "year": 2024,
      "idOwner": "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Requerido
    }
    ```
-   **Respuesta Exitosa (201 Created)**: Devuelve el `Guid` de la nueva propiedad creada.

---

### d) Actualizar el Precio de una Propiedad

-   **Endpoint**: `PUT /api/properties/{id}`
-   **Método**: `PUT`
-   **Descripción**: Actualiza el precio de una propiedad existente.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID de la propiedad a actualizar.
-   **Cuerpo de la Petición (Request Body)**:
    ```json
    {
      "price": 325000.50
    }
    ```
-   **Respuesta Exitosa (204 No Content)**: No devuelve contenido.

---

### e) Eliminar una Propiedad

-   **Endpoint**: `DELETE /api/properties/{id}`
-   **Método**: `DELETE`
-   **Descripción**: Elimina una propiedad existente y sus imágenes asociadas.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID de la propiedad a eliminar.
-   **Respuesta Exitosa (204 No Content)**: No devuelve contenido.

---

### Endpoints de Imágenes de Propiedades (`/api/properties/{id}/images`)

##### a) Subir Imagen a una Propiedad

-   **Endpoint**: `POST /api/properties/{id}/images`
-   **Método**: `POST`
-   **Descripción**: Registra una imagen subida a Cloudinary para una propiedad existente.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID de la propiedad a la que se agregará la imagen.
-   **Tipo de Contenido**: `application/json`
-   **Cuerpo de la Petición (JSON)**:
    ```json
    {
      "imageUrl": "https://res.cloudinary.com/tu-cuenta/image/upload/v1234567890/imagen.jpg",
      "publicId": "propiedades/imagen_unica_id"
    }
    ```
-   **Campos del Request**:
    -   `imageUrl` (string, obligatorio): URL completa de la imagen en Cloudinary
    -   `publicId` (string, obligatorio): ID público asignado por Cloudinary
-   **Validaciones del Backend**:
    -   **URL requerida**: No puede estar vacía
    -   **URL de Cloudinary**: Debe contener "cloudinary.com"
    -   **Propiedad existente**: El ID de propiedad debe existir
-   **Respuesta Exitosa (200 OK)**:
    ```json
    {
      "imageId": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```
-   **Respuestas de Error**:
    -   `400 Bad Request`: URL inválida o no es de Cloudinary
    -   `404 Not Found`: Propiedad no existe

##### b) Obtener Imágenes de una Propiedad

-   **Endpoint**: `GET /api/properties/{id}/images`
-   **Método**: `GET`
-   **Descripción**: Obtiene todas las imágenes asociadas a una propiedad.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID de la propiedad.
-   **Respuesta Exitosa (200 OK)**: Array de objetos con información de las imágenes.

##### c) Eliminar Imagen de una Propiedad

-   **Endpoint**: `DELETE /api/properties/{id}/images/{imageId}`
-   **Método**: `DELETE`
-   **Descripción**: Elimina una imagen específica de una propiedad.
-   **Parámetros de Ruta**:
    -   `id` (Guid): El ID de la propiedad.
    -   `imageId` (Guid): El ID de la imagen a eliminar.
-   **Respuesta Exitosa (204 No Content)**: No devuelve contenido.

---

### Endpoints de Dueños (`/api/owners`)

#### a) Obtener Lista de Dueños
- **Endpoint**: `GET /api/owners`
- **Método**: `GET`
- **Descripción**: Devuelve una lista de todos los dueños. Es ideal para poblar menús desplegables.
- **Respuesta Exitosa (200 OK)**: Un array de `OwnerDto`.
  ```json
  [
    {
      "idOwner": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Juan Perez"
    }
  ]
  ```

#### b) Crear un Nuevo Dueño
- **Endpoint**: `POST /api/owners`
- **Método**: `POST`
- **Cuerpo de la Petición (Request Body)**:
  ```json
  {
    "name": "Nuevo Dueño",
    "address": "Su Dirección Completa",
    "photo": "url_de_la_foto.jpg",
    "birthday": "1990-01-15T00:00:00Z"
  }
  ```
- **Respuesta Exitosa (201 Created)**: Devuelve el `Guid` del nuevo dueño.

#### c) Actualizar un Dueño
- **Endpoint**: `PUT /api/owners/{id}`
- **Método**: `PUT`
- **Parámetros de Ruta**: `id` (Guid) del dueño a actualizar.
- **Cuerpo de la Petición (Request Body)**:
  ```json
  {
    "idOwner": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Debe coincidir con el id de la URL
    "name": "Nombre Actualizado",
    "address": "Dirección Actualizada"
  }
  ```
- **Respuesta Exitosa (204 No Content)**: No devuelve contenido.

#### d) Eliminar un Dueño
- **Endpoint**: `DELETE /api/owners/{id}`
- **Método**: `DELETE`
- **Parámetros de Ruta**: `id` (Guid) del dueño a eliminar.
- **Respuesta Exitosa (204 No Content)**: No devuelve contenido.

## 4. Manejo de Errores

La API devolverá los siguientes códigos de estado para errores:

-   **`400 Bad Request`**: Ocurre cuando los datos enviados en una petición `POST` o `PUT` no son válidos (ej. un nombre vacío, un precio negativo). La respuesta contendrá un mensaje de error.
-   **`404 Not Found`**: Ocurre cuando se intenta obtener, actualizar o eliminar una propiedad con un `id` que no existe.
-   **`500 Internal Server Error`**: Para cualquier otro error inesperado en el servidor.

Todas las respuestas de error tendrán un cuerpo JSON similar a este:
```json
{
  "message": "Mensaje descriptivo del error."
}
```

## 5. Trazas y Entidades Adicionales

-   **`Owner`**: Existe una entidad `Owner` y ahora **se puede gestionar completamente** a través de los endpoints `/api/owners`. Esto permite al frontend crear y seleccionar dueños al momento de crear una propiedad.
-   **`PropertyImage`**: Nueva entidad para manejar imágenes de propiedades. **Integra Cloudinary** para optimización y entrega automática de imágenes. Incluye funcionalidad completa para registrar, obtener y eliminar imágenes.
-   **`PropertyTrace`**: Existe una entidad para el historial de una propiedad (ventas, cambios de precio, etc.). Actualmente no hay endpoints para gestionarla, pero la base de datos está preparada para esta funcionalidad en el futuro.

## 6. Sistema de Imágenes con Cloudinary

### 🎯 **Arquitectura**
- **Frontend**: Sube imágenes directamente a Cloudinary
- **Backend**: Recibe URLs de Cloudinary y las registra en BD
- **Beneficios**: Optimización automática, CDN global, menor carga en servidor

### 📋 **Flujo de Subida**
1. Usuario selecciona imagen en el frontend
2. Frontend sube a Cloudinary y obtiene URL + publicId
3. Frontend envía URL y publicId al backend
4. Backend valida y registra en base de datos
5. Sistema devuelve ID de imagen registrada

### 🔧 **Configuración Requerida**
- **Cuenta Cloudinary**: [cloudinary.com](https://cloudinary.com)
- **Upload Preset**: Configurado para optimización automática
- **SDK Frontend**: `npm install cloudinary`

### 📖 **Documentación Detallada**
Ver **[CLOUDINARY_FRONTEND_GUIDE.md](CLOUDINARY_FRONTEND_GUIDE.md)** para implementación completa.

## 7. Poblar Base de Datos con Datos Dummy

### Método 1: Usando Endpoint HTTP (Recomendado para desarrollo)

```bash
# Ejecutar seeding desde la API
curl -X POST http://localhost:5124/api/seed
```

### Método 2: Usando Comando de Línea

```bash
# Desde el directorio del proyecto Million.Api
cd Million.Api
dotnet run --seed
```

### Método 3: Script MongoDB Directo

Si prefieres poblar directamente desde MongoDB:

```javascript
// Ejecutar en MongoDB Shell o MongoDB Compass
use MillionDb

// Insertar Owners
db.Owners.insertMany([
  {
    "_id": UUID("550e8400-e29b-41d4-a716-446655440001"),
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440001"),
    "Name": "Juan Carlos Pérez González",
    "Address": "Calle 45 # 12-34, Medellín, Colombia",
    "Photo": "https://randomuser.me/api/portraits/men/1.jpg",
    "Birthday": ISODate("1985-03-15T00:00:00Z")
  }
  // ... más owners
]);

// Insertar Properties
db.Properties.insertMany([
  {
    "_id": UUID("550e8400-e29b-41d4-a716-446655440011"),
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440011"),
    "Name": "Casa Moderna con Vista al Mar",
    "Address": "Carrera 7 # 45-67, Bogotá",
    "Price": 750000,
    "CodeInternal": "PROP-2024-001",
    "Year": 2020,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440001")
  }
  // ... más properties
]);
```

### Datos de Prueba Incluidos

El seeder creará automáticamente:
- **8 Owners** con información realista
- **25 Properties** con precios variados
- **Múltiples imágenes** por propiedad (URLs de Unsplash)
- **Registros de trazas** con historial de ventas

## 7. Notas de Actualización

**Última actualización**: Sistema completo con integración Cloudinary y arquitectura optimizada.
- ✅ **Swagger completamente funcional** con soporte para subida de archivos
- ✅ **Nuevos endpoints** para gestión de imágenes (`/api/properties/{id}/images`)
- ✅ **Nueva funcionalidad `GetPropertyById`** (`GET /api/properties/{id}`) para páginas de detalle
- ✅ **Nueva entidad `AddImageRequestDto`** para subida de imágenes
- ✅ **Sistema de seeding** completo con datos dummy realistas
- ✅ **Puerto actualizado** a `http://localhost:5124`
- ✅ **Separación de responsabilidades**: Crear propiedad y subir imagen son operaciones independientes
- ✅ **`IdProperty` incluido** en respuestas de GET /api/properties para identificación única
- ✅ **Mapeos de MongoDB corregidos** para compatibilidad con consultas avanzadas
- ✅ **Arquitectura CQRS completa** con queries y commands separados
- ✅ **Integración Cloudinary** para optimización y entrega automática de imágenes
- ✅ **Backend simplificado** - solo registra URLs, no procesa archivos
- ✅ **Optimización automática** de imágenes con CDN global
