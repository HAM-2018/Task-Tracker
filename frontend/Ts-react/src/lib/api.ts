
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  return fetch(`http://localhost:3001${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
