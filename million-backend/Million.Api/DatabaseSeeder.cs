using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Million.Api
{
    public class DatabaseSeeder
    {
        private readonly MillionDbContext _context;

        public DatabaseSeeder(MillionDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            Console.WriteLine("🌱 Iniciando seeding de base de datos...");

            // Limpiar datos existentes
            await ClearExistingDataAsync();

            // Crear datos dummy
            var owners = await CreateOwnersAsync();
            var properties = await CreatePropertiesAsync(owners);
            await CreatePropertyImagesAsync(properties);
            await CreatePropertyTracesAsync(properties);

            Console.WriteLine("✅ Seeding completado exitosamente!");
        }

        private async Task ClearExistingDataAsync()
        {
            Console.WriteLine("🗑️  Limpiando datos existentes...");

            await _context.Owners.DeleteManyAsync(FilterDefinition<Owner>.Empty);
            await _context.Properties.DeleteManyAsync(FilterDefinition<Property>.Empty);
            await _context.PropertyImages.DeleteManyAsync(FilterDefinition<PropertyImage>.Empty);
            await _context.PropertyTraces.DeleteManyAsync(FilterDefinition<PropertyTrace>.Empty);

            Console.WriteLine("✅ Datos existentes eliminados");
        }

        private async Task<List<Owner>> CreateOwnersAsync()
        {
            Console.WriteLine("👥 Creando owners...");

            var owners = new List<Owner>
            {
                new Owner
                {
                    Name = "Juan Carlos Pérez González",
                    Address = "Calle 45 # 12-34, Medellín, Colombia",
                    Photo = "https://randomuser.me/api/portraits/men/1.jpg",
                    Birthday = new DateTime(1985, 3, 15)
                },
                new Owner
                {
                    Name = "María Isabel Rodríguez Santos",
                    Address = "Carrera 7 # 23-45, Bogotá, Colombia",
                    Photo = "https://randomuser.me/api/portraits/women/2.jpg",
                    Birthday = new DateTime(1990, 7, 22)
                },
                new Owner
                {
                    Name = "Carlos Andrés López Ramírez",
                    Address = "Avenida El Dorado # 68-12, Bogotá, Colombia",
                    Photo = "https://randomuser.me/api/portraits/men/3.jpg",
                    Birthday = new DateTime(1978, 11, 8)
                },
                new Owner
                {
                    Name = "Ana María Gutiérrez Torres",
                    Address = "Calle 72 # 8-56, Medellín, Colombia",
                    Photo = "https://randomuser.me/api/portraits/women/4.jpg",
                    Birthday = new DateTime(1982, 5, 30)
                },
                new Owner
                {
                    Name = "Roberto José Martínez Silva",
                    Address = "Carrera 15 # 89-01, Cali, Colombia",
                    Photo = "https://randomuser.me/api/portraits/men/5.jpg",
                    Birthday = new DateTime(1975, 9, 18)
                },
                new Owner
                {
                    Name = "Catalina Elena Vargas Muñoz",
                    Address = "Transversal 9 # 34-67, Barranquilla, Colombia",
                    Photo = "https://randomuser.me/api/portraits/women/6.jpg",
                    Birthday = new DateTime(1988, 12, 3)
                },
                new Owner
                {
                    Name = "Diego Fernando Castro Morales",
                    Address = "Diagonal 12 # 45-78, Cartagena, Colombia",
                    Photo = "https://randomuser.me/api/portraits/men/7.jpg",
                    Birthday = new DateTime(1983, 4, 25)
                },
                new Owner
                {
                    Name = "Valentina Sofía Herrera Ruiz",
                    Address = "Calle 10 # 5-23, Pereira, Colombia",
                    Photo = "https://randomuser.me/api/portraits/women/8.jpg",
                    Birthday = new DateTime(1992, 8, 14)
                }
            };

            await _context.Owners.InsertManyAsync(owners);
            Console.WriteLine($"✅ Creados {owners.Count} owners");
            return owners;
        }

        private async Task<List<Property>> CreatePropertiesAsync(List<Owner> owners)
        {
            Console.WriteLine("🏠 Creando properties...");

            var properties = new List<Property>();
            var random = new Random();
            var propertyNames = new[]
            {
                "Casa Moderna con Vista al Mar", "Apartamento Ejecutivo Centro", "Casa Familiar Zona Norte",
                "Penthouse con Terraza", "Casa de Campo", "Apartamento Estudio", "Casa Colonial Restaurada",
                "Loft Industrial", "Casa Campestre", "Apartamento con Balcón", "Casa en Conjunto Cerrado",
                "Apartamento Duplex", "Casa Inteligente", "Apartamento Minimalista", "Casa de Lujo"
            };

            var addresses = new[]
            {
                "Carrera 7 # 45-67, Bogotá", "Calle 85 # 12-34, Medellín", "Avenida 6N # 23-45, Cali",
                "Carrera 43A # 7-89, Barranquilla", "Diagonal 12 # 34-56, Cartagena",
                "Calle 10 # 5-67, Pereira", "Transversal 9 # 12-34, Bucaramanga",
                "Avenida Santander # 45-67, Cúcuta", "Calle Real # 23-45, Santa Marta",
                "Carrera 5 # 8-90, Manizales", "Avenida 19 # 34-56, Popayán",
                "Calle 15 # 7-23, Pasto", "Diagonal 6 # 12-34, Armenia",
                "Carrera 8 # 5-67, Ibagué", "Transversal 12 # 23-45, Neiva"
            };

            for (int i = 0; i < 25; i++)
            {
                var owner = owners[random.Next(owners.Count)];
                var property = new Property
                {
                    Name = propertyNames[random.Next(propertyNames.Length)],
                    Address = addresses[random.Next(addresses.Length)],
                    Price = random.Next(100000, 2000000), // Precios entre 100k y 2M
                    CodeInternal = $"PROP-{DateTime.Now.Year}-{i + 1:000}",
                    Year = random.Next(2010, 2024),
                    IdOwner = owner.IdOwner
                };

                properties.Add(property);
            }

            await _context.Properties.InsertManyAsync(properties);
            Console.WriteLine($"✅ Creadas {properties.Count} propiedades");
            return properties;
        }

        private async Task CreatePropertyImagesAsync(List<Property> properties)
        {
            Console.WriteLine("🖼️  Creando property images...");

            var images = new List<PropertyImage>();
            var random = new Random();
            var imageUrls = new[]
            {
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
                "https://images.unsplash.com/photo-1520637836862-4d197d17c1a9?w=800",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
            };

            foreach (var property in properties)
            {
                // Crear entre 1 y 4 imágenes por propiedad
                var numImages = random.Next(1, 5);
                for (int i = 0; i < numImages; i++)
                {
                    var image = new PropertyImage
                    {
                        IdProperty = property.IdProperty,
                        File = imageUrls[random.Next(imageUrls.Length)],
                        Enabled = random.NextDouble() > 0.1 // 90% de probabilidad de estar habilitada
                    };

                    images.Add(image);
                }
            }

            await _context.PropertyImages.InsertManyAsync(images);
            Console.WriteLine($"✅ Creadas {images.Count} imágenes de propiedades");
        }

        private async Task CreatePropertyTracesAsync(List<Property> properties)
        {
            Console.WriteLine("📊 Creando property traces...");

            var traces = new List<PropertyTrace>();
            var random = new Random();

            foreach (var property in properties)
            {
                // Crear entre 0 y 3 trazas por propiedad
                var numTraces = random.Next(0, 4);
                for (int i = 0; i < numTraces; i++)
                {
                    var trace = new PropertyTrace
                    {
                        IdProperty = property.IdProperty,
                        DateSale = DateTime.Now.AddMonths(-random.Next(1, 24)),
                        Name = $"Venta #{i + 1} - {property.Name}",
                        Value = property.Price * (decimal)(0.8 + random.NextDouble() * 0.4), // 80%-120% del precio actual
                        Tax = property.Price * 0.05m // 5% de impuesto
                    };

                    traces.Add(trace);
                }
            }

            await _context.PropertyTraces.InsertManyAsync(traces);
            Console.WriteLine($"✅ Creados {traces.Count} registros de trazas");
        }
    }
}
