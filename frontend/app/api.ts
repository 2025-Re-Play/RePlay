const BASE_URL = "https://replay-production-69e1.up.railway.app";

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  // 응답이 string(token)일 수도 있어서 text 먼저 받고 파싱 시도
  const text = await res.text();

  if (!res.ok) {
    // swagger 422 같은 에러도 여기로 떨어짐
    throw new Error(text || `HTTP ${res.status}`);
  }

  // JSON이면 JSON으로, 아니면 string 그대로
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
