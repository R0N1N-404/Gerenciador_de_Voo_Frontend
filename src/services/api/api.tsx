const API_URL = "http://localhost:8080";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token && { Authorization: token }),
    },
  });

  if (!response.ok) {
  const erro = await response.json();
  throw new Error(erro.mensagem || `Erro HTTP: ${response.status}`);
}

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}