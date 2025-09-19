const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5288/api';

interface RequestOptions extends RequestInit {
  data?: unknown;
}

async function apiClient<T>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const isFormData = data instanceof FormData;

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    headers: {
      ...(!isFormData && data && { 'Content-Type': 'application/json' }) as Record<string, string>,
      ...customHeaders,
    },
    ...customConfig,
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    return Promise.reject(new Error(error.message || 'Ocurrió un error en la petición a la API'));
  }

  if (response.status === 204) {
    return Promise.resolve(undefined as T);
  }

  return await response.json();
}

export default apiClient;
