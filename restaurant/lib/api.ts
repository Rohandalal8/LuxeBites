const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function apiFetch<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}), Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => null) as { data?: T; message?: string } | null;
  if (!response.ok) throw new Error(payload?.message ?? "The request could not be completed.");
  return payload?.data as T;
}
