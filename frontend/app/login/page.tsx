"use client";

import { useState } from "react";
import { Theater } from "lucide-react";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="flex h-full w-full items-center justify-center bg-emerald-50/60">
      <div className="w-[320px] rounded-[0.5rem] bg-white p-6 shadow-md">
        {/* 로고 동그라미 */}
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
            <Theater className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">소품샵</h1>
          <p className="mt-1 text-[11px] text-slate-500">
            대학 연극 소품 거래 플랫폼
          </p>
        </div>

        {/* 로그인 / 회원가입 탭 */}
        <div className="mt-5 rounded-[0.5rem] bg-slate-100 p-1 text-xs font-medium text-slate-500">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setMode("login")}
              className={`rounded-[0.5rem] py-2 ${
                mode === "login"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-[0.5rem] py-2 ${
                mode === "signup"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* 폼 영역 */}
        <form className="mt-5 space-y-4">
          {/* 이메일 */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              이메일
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              비밀번호
            </label>
            <input
              type="password"
              placeholder={mode === "signup" ? "6자 이상 입력" : "********"}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* 회원가입 모드에서만 보이는 필드들 */}
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  소속 대학 (선택)
                </label>
                <input
                  type="text"
                  placeholder="서울대학교"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </>
          )}

          {/* 버튼 */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
