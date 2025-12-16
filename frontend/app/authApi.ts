export type SignupReq = {
  email: string;
  password: string;
  name: string;
  role: "USER" | "ADMIN";
  admin_code?: string;
  school_id: number;
  club_id: number;
};

const BASE = "https://replay-production-69e1.up.railway.app";

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text(); // ✅ 서버가 text/plain으로 줘도 잡힘

  if (!res.ok) {
    // ✅ 여기서 실제 서버 에러 메시지 확인 가능
    console.error("[API ERROR]", path, res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 서버가 "string" 토큰을 주는 스펙이면 text 그대로 쓰면 됨
  // JSON으로 오면 JSON 파싱
  try {
    return JSON.parse(text) as TRes;
  } catch {
    return text as unknown as TRes;
  }
}

export async function signupApi(body: SignupReq): Promise<string> {
  return postJson<SignupReq, string>("/api/v1/auth/signup", body);
}

export async function loginApi(body: { email: string; password: string }): Promise<string> {
  return postJson<typeof body, string>("/api/v1/auth/login", body);
}
