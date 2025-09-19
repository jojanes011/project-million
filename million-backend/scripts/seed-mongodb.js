// Script para poblar MongoDB con datos dummy
// Ejecutar desde MongoDB Shell: mongo MillionDb scripts/seed-mongodb.js
// O desde MongoDB Compass

// Usar la base de datos
use MillionDb;

// Limpiar datos existentes
db.Owners.deleteMany({});
db.Properties.deleteMany({});
db.PropertyImages.deleteMany({});
db.PropertyTraces.deleteMany{};

print("🗑️  Datos existentes eliminados");

// Insertar Owners
const owners = [
  {
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440001"),
    "Name": "Juan Carlos Pérez González",
    "Address": "Calle 45 # 12-34, Medellín, Colombia",
    "Photo": "https://randomuser.me/api/portraits/men/1.jpg",
    "Birthday": ISODate("1985-03-15T00:00:00Z")
  },
  {
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440002"),
    "Name": "María Isabel Rodríguez Santos",
    "Address": "Carrera 7 # 23-45, Bogotá, Colombia",
    "Photo": "https://randomuser.me/api/portraits/women/2.jpg",
    "Birthday": ISODate("1990-07-22T00:00:00Z")
  },
  {
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440003"),
    "Name": "Carlos Andrés López Ramírez",
    "Address": "Avenida El Dorado # 68-12, Bogotá, Colombia",
    "Photo": "https://randomuser.me/api/portraits/men/3.jpg",
    "Birthday": ISODate("1978-11-08T00:00:00Z")
  },
  {
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440004"),
    "Name": "Ana María Gutiérrez Torres",
    "Address": "Calle 72 # 8-56, Medellín, Colombia",
    "Photo": "https://randomuser.me/api/portraits/women/4.jpg",
    "Birthday": ISODate("1982-05-30T00:00:00Z")
  },
  {
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440005"),
    "Name": "Roberto José Martínez Silva",
    "Address": "Carrera 15 # 89-01, Cali, Colombia",
    "Photo": "https://randomuser.me/api/portraits/men/5.jpg",
    "Birthday": ISODate("1975-09-18T00:00:00Z")
  }
];

db.Owners.insertMany(owners);
print(`✅ Insertados ${owners.length} owners`);

// Insertar Properties
const properties = [
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440011"),
    "Name": "Casa Moderna con Vista al Mar",
    "Address": "Carrera 7 # 45-67, Bogotá",
    "Price": 750000,
    "CodeInternal": "PROP-2024-001",
    "Year": 2020,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440001")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440012"),
    "Name": "Apartamento Ejecutivo Centro",
    "Address": "Calle 85 # 12-34, Medellín",
    "Price": 450000,
    "CodeInternal": "PROP-2024-002",
    "Year": 2018,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440002")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440013"),
    "Name": "Casa Familiar Zona Norte",
    "Address": "Diagonal 12 # 34-56, Cartagena",
    "Price": 320000,
    "CodeInternal": "PROP-2024-003",
    "Year": 2015,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440003")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440014"),
    "Name": "Penthouse con Terraza",
    "Address": "Carrera 43A # 7-89, Barranquilla",
    "Price": 1200000,
    "CodeInternal": "PROP-2024-004",
    "Year": 2022,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440004")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440015"),
    "Name": "Casa de Campo",
    "Address": "Transversal 9 # 12-34, Bucaramanga",
    "Price": 280000,
    "CodeInternal": "PROP-2024-005",
    "Year": 2012,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440005")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440016"),
    "Name": "Apartamento Estudio",
    "Address": "Calle 10 # 5-67, Pereira",
    "Price": 180000,
    "CodeInternal": "PROP-2024-006",
    "Year": 2019,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440001")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440017"),
    "Name": "Casa Colonial Restaurada",
    "Address": "Diagonal 6 # 12-34, Armenia",
    "Price": 420000,
    "CodeInternal": "PROP-2024-007",
    "Year": 2017,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440002")
  },
  {
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440018"),
    "Name": "Loft Industrial",
    "Address": "Carrera 8 # 5-67, Ibagué",
    "Price": 350000,
    "CodeInternal": "PROP-2024-008",
    "Year": 2021,
    "IdOwner": UUID("550e8400-e29b-41d4-a716-446655440003")
  }
];

db.Properties.insertMany(properties);
print(`✅ Insertadas ${properties.length} propiedades`);

// Insertar PropertyImages
const images = [
  {
    "IdPropertyImage": UUID("550e8400-e29b-41d4-a716-446655440021"),
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440011"),
    "File": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "Enabled": true
  },
  {
    "IdPropertyImage": UUID("550e8400-e29b-41d4-a716-446655440022"),
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440011"),
    "File": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    "Enabled": true
  },
  {
    "IdPropertyImage": UUID("550e8400-e29b-41d4-a716-446655440023"),
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440012"),
    "File": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    "Enabled": true
  },
  {
    "IdPropertyImage": UUID("550e8400-e29b-41d4-a716-446655440024"),
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440013"),
    "File": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "Enabled": true
  }
];

db.PropertyImages.insertMany(images);
print(`✅ Insertadas ${images.length} imágenes`);

// Insertar PropertyTraces
const traces = [
  {
    "IdPropertyTrace": UUID("550e8400-e29b-41d4-a716-446655440031"),
    "DateSale": ISODate("2023-06-15T00:00:00Z"),
    "Name": "Venta inicial",
    "Value": 700000,
    "Tax": 35000,
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440011")
  },
  {
    "IdPropertyTrace": UUID("550e8400-e29b-41d4-a716-446655440032"),
    "DateSale": ISODate("2023-09-10T00:00:00Z"),
    "Name": "Reventa",
    "Value": 420000,
    "Tax": 21000,
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440012")
  },
  {
    "IdPropertyTrace": UUID("550e8400-e29b-41d4-a716-446655440033"),
    "DateSale": ISODate("2023-12-05T00:00:00Z"),
    "Name": "Transacción familiar",
    "Value": 300000,
    "Tax": 15000,
    "IdProperty": UUID("550e8400-e29b-41d4-a716-446655440013")
  }
];

db.PropertyTraces.insertMany(traces);
print(`✅ Insertados ${traces.length} registros de trazas`);

print("🎉 ¡Base de datos poblada exitosamente!");
print(`📊 Resumen:`);
print(`   - Owners: ${owners.length}`);
print(`   - Properties: ${properties.length}`);
print(`   - Property Images: ${images.length}`);
print(`   - Property Traces: ${traces.length}`);
