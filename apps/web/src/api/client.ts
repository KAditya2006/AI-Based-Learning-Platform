const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

interface FetchOptions extends RequestInit {
  data?: any;
}

export const fetchClient = async <T>(endpoint: string, { data, headers: customHeaders, ...customConfig }: FetchOptions = {}): Promise<T> => {
  const token = getAuthToken();
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : '',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  // Clean up empty headers
  const headers = config.headers as Record<string, string>;
  if (!headers['Content-Type']) delete headers['Content-Type'];

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const result = await response.json();

  if (response.ok) {
    return result.data as T;
  } else {
    throw new Error(result.error?.message || 'API request failed');
  }
};
