// components/Header.tsx
"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400 text-xs font-bold text-slate-950">
            RE
          </div>
          <span className="text-sm font-semibold tracking-tight">
            리플레이
          </span>
        </Link>

        <nav className="hidden gap-6 text-xs text-slate-300 md:flex">
          <Link href="#items" className="hover:text-sky-300">
            소품 둘러보기
          </Link>
          <Link href="#how-it-works" className="hover:text-sky-300">
            이용 안내
          </Link>
          <Link href="#about" className="hover:text-sky-300">
            리플레이 소개
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-sky-400 md:inline-block">
            로그인
          </button>
          <button className="hidden rounded-full bg-sky-400 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-sky-300 md:inline-block">
            소품 올리기
          </button>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 md:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="#items">소품 둘러보기</Link>
            <Link href="#how-it-works">이용 안내</Link>
            <Link href="#about">리플레이 소개</Link>
            <div className="mt-1 flex gap-2">
              <button className="flex-1 rounded-full border border-slate-700 px-3 py-2">
                로그인
              </button>
              <button className="flex-1 rounded-full bg-sky-400 px-3 py-2 font-semibold text-slate-950">
                소품 올리기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
