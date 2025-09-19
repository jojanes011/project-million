# Million - Real Estate API

API REST completa para gestión de propiedades inmobiliarias construida con .NET 9, MongoDB y arquitectura limpia.

## 🚀 Inicio Rápido

### 1. Requisitos Previos
- .NET 9 SDK
- MongoDB (local o en la nube)
- Puerto 27017 disponible para MongoDB

### 2. Configuración
1. Clona el repositorio
2. Verifica la configuración en `Million.Api/appsettings.json`
3. Asegúrate de que MongoDB esté ejecutándose

### 3. Ejecutar la Aplicación
```bash
cd Million.Api
dotnet run
```

### 4. Poblar con Datos Dummy

#### Opción A: Usando la API (Recomendado)
```bash
# Ejecutar seeding desde la aplicación
curl -X POST http://localhost:5124/api/seed
```

#### Opción B: Usando Comando de Línea
```bash
# Desde el directorio Million.Api
dotnet run --seed
```

#### Opción C: Script MongoDB Directo
```bash
# Ejecutar desde MongoDB Shell
mongo MillionDb scripts/seed-mongodb.js
```

## 📋 Endpoints Disponibles

### Propiedades
- `GET /api/properties` - Listar propiedades (con filtros y paginación)
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/{id}` - Actualizar precio
- `DELETE /api/properties/{id}` - Eliminar propiedad

### Imágenes de Propiedades
- `POST /api/properties/{id}/images` - Subir imagen
- `GET /api/properties/{id}/images` - Obtener imágenes
- `DELETE /api/properties/{id}/images/{imageId}` - Eliminar imagen

### Dueños
- `GET /api/owners` - Listar dueños
- `POST /api/owners` - Crear dueño
- `PUT /api/owners/{id}` - Actualizar dueño
- `DELETE /api/owners/{id}` - Eliminar dueño

### Utilidades
- `POST /api/seed` - Poblar base de datos con datos dummy
- `DELETE /api/seed` - Limpiar base de datos

## 📖 Documentación

- **Swagger UI**: http://localhost:5124/swagger
- **Guía Frontend**: [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)

## 🏗️ Arquitectura

- **Clean Architecture** con separación de capas
- **CQRS** con MediatR para comandos y queries
- **Repository Pattern** para acceso a datos
- **MongoDB** como base de datos NoSQL
- **Swagger/OpenAPI** para documentación

## 📦 Tecnologías

- .NET 9
- C# 12
- MongoDB
- MediatR
- FluentValidation
- Serilog
- Swashbuckle (Swagger)

## 🧪 Testing

```bash
# Ejecutar tests
dotnet test

# Ejecutar tests con cobertura
dotnet test --collect:"XPlat Code Coverage"
```

## 📁 Estructura del Proyecto

```
Million/
├── Million.Api/              # Capa de presentación (API)
├── Million.Application/      # Capa de aplicación (CQRS)
├── Million.Domain/           # Capa de dominio (entidades)
├── Million.Infrastructure/   # Capa de infraestructura (MongoDB)
├── Million.Tests/            # Tests unitarios
├── scripts/                  # Scripts de utilidad
└── FRONTEND_GUIDE.md         # Guía para desarrolladores frontend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.