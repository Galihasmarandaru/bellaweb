const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = {
  get: async <T>(url: string): Promise<{ data: T }> => {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) throw new Error(res.statusText);
    return { data: await res.json() };
  },

  post: async <T>(url: string, body?: unknown): Promise<{ data: T }> => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(res.statusText);
    return { data: await res.json() };
  },
};
