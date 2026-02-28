  export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

  export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      credentials: "include"
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (data as any)?.message || `Request failed: ${res.status}`;
      throw new Error(msg);
    }

    return data as T;
  }
