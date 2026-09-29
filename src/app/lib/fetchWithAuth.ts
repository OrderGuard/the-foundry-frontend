// lib/fetchWithAuth.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  auth?: boolean; // allow disabling auth if needed
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem('refresh');

  if (!refresh) return null;

  try {
    const res = await fetch(`${API_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });

    const data = await res.json();

    if (!res.ok) return null;

    localStorage.setItem('access', data.access);
    return data.access;
  } catch {
    return null;
  }
};

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { auth = true, headers, ...rest } = options;

  let token = auth ? localStorage.getItem('access') : null;

  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${API_URL}${url}`, {
      ...rest,
      headers: {
        ...(headers || {}),
        ...(auth && accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    });
  };

  let response = await makeRequest(token);

  // 🔁 Auto refresh on 401
  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      // ❌ logout scenario
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      // optional: redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw new Error('Session expired');
    }

    response = await makeRequest(newToken);
  }

  return response;
};

