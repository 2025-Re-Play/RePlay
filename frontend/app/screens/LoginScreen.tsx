"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/auth";

export default function LoginScreen() {
  const { login, openSignupRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      setErr("로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white px-6 pb-10 pt-16">
      <div className="mt-16">
        <Image src="/icons/replay-logo.svg" alt="logo" width={64} height={64} />
        <p className="mt-8 text-[24px] font-bold text-[#1A1A1A]">
          연극 소품이 초연에서
          <br />
          끝나지 않도록,
        </p>
        <p className="mt-4 text-[44px] font-extrabold text-[#0EBC81]">리플레이</p>
      </div>

      <div className="mt-10 space-y-3">
        <input
          className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err ? <p className="text-[12px] text-red-500">{err}</p> : null}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="mt-auto w-full rounded-[16px] bg-[#0EBC81] py-4 text-[16px] font-bold text-white"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <button
        type="button"
        onClick={openSignupRole}
        className="mt-4 text-center text-[14px] font-bold text-[#9E9E9E]"
      >
        리플레이가 처음이신가요?
      </button>
    </div>
  );
}
