// Ejemplos actualizados de uso del frontend con las nuevas funcionalidades

// === NUEVA FUNCIONALIDAD: GetPropertyById ===

// Función para obtener una propiedad específica por su ID
export async function getPropertyById(propertyId: string): Promise<Property> {
  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Propiedad no encontrada');
    }
    const error: ApiErrorResponse = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

// === EJEMPLO DE USO EN COMPONENTE DE DETALLE ===

/*
// Componente de página de detalle de propiedad
interface PropertyDetailPageProps {
  propertyId: string;
}

export function PropertyDetailPage({ propertyId }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId]);

  const loadPropertyDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertyData = await getPropertyById(propertyId);
      setProperty(propertyData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando propiedad...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Propiedad no encontrada</div>;

  return (
    <div className="property-detail">
      <h1>{property.name}</h1>
      <div className="property-info">
        <p><strong>Dirección:</strong> {property.address}</p>
        <p><strong>Precio:</strong> ${property.price.toLocaleString()}</p>
        <p><strong>Dueño:</strong> {property.ownerName}</p>
        {property.image && (
          <img
            src={property.image}
            alt={property.name}
            className="property-image"
          />
        )}
      </div>

      <div className="property-actions">
        <button onClick={() => updatePropertyPrice(property.idProperty, property.price * 1.1)}>
          Aumentar precio 10%
        </button>
        <button onClick={() => deleteProperty(property.idProperty)}>
          Eliminar propiedad
        </button>
      </div>
    </div>
  );
}
*/

// === FUNCIONES DE ACCIONES ADICIONALES ===

// Función para actualizar precio de propiedad (usando el ID obtenido)
export async function updatePropertyPrice(propertyId: string, newPrice: number): Promise<void> {
  const payload: UpdatePropertyPricePayload = { price: newPrice };

  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();
    throw new Error(error.message);
  }
}

// Función para eliminar propiedad (usando el ID obtenido)
export async function deleteProperty(propertyId: string): Promise<void> {
  const response = await fetch(`http://localhost:5124/api/properties/${propertyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();
    throw new Error(error.message);
  }
}

// === TIPOS ACTUALIZADOS PARA EL FRONTEND ===

export interface Property {
  idProperty: string; // ✅ NUEVO: ID único de la propiedad
  idOwner: string;
  ownerName: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

export interface UpdatePropertyPricePayload {
  price: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Función helper para manejar errores
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error.message) {
    return error.message;
  }

  return 'Error desconocido en la API';
}
