export type SignupReq = {
  email: string;
  password: string;
  name: string;
  role: "USER" | "ADMIN";
  admin_code?: string;
  school_id: number;
  club_id: number;
};

// ✅ rewrites 쓰는 중이면 BASE 필요 없음. 항상 상대경로로 호출해.
type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
};

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include", // ✅ 콤마 누락 금지
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    console.error("[API ERROR]", path, res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (text ? JSON.parse(text) : null) as TRes;
}

export async function signupApi(body: SignupReq): Promise<string> {
  const r = await postJson<SignupReq, ApiEnvelope<string>>("/api/v1/auth/signup", body);
  if (!r.success) throw new Error(r.error?.message || "signup failed");
  return r.data; // ✅ 토큰만 반환
}

export async function loginApi(body: { email: string; password: string }): Promise<string> {
  const r = await postJson<typeof body, ApiEnvelope<string>>("/api/v1/auth/login", body);
  if (!r.success) throw new Error(r.error?.message || "login failed");
  return r.data; // ✅ 토큰만 반환
}
