# Usa la imagen oficial de .NET SDK como base para la compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Copia los archivos de proyecto (.csproj) y restaura las dependencias
COPY *.sln .
COPY Million.Api/*.csproj ./Million.Api/
COPY Million.Application/*.csproj ./Million.Application/
COPY Million.Domain/*.csproj ./Million.Domain/
COPY Million.Infrastructure/*.csproj ./Million.Infrastructure/
RUN dotnet restore "Million.Api/Million.Api.csproj"

# Copia el resto del código fuente
COPY . .
WORKDIR "/source/Million.Api"
# Publica la aplicación para producción
RUN dotnet publish -c Release -o /app/publish

# Usa una imagen más ligera de ASP.NET Core para ejecutar la aplicación
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expone el puerto que usará la aplicación
EXPOSE 8080

# Define el punto de entrada para ejecutar la aplicación
ENTRYPOINT ["dotnet", "Million.Api.dll"]
