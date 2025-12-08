// app/screens/SplashScreen.tsx
"use client";

import Image from "next/image";

type SplashProps = {
  onSkip?: () => void;
};

export default function SplashScreen({ onSkip }: SplashProps) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-white"
      onClick={onSkip}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/replay-logo.svg"
          alt="리플레이 로고"
          width={220}
          height={220}
        />

        <p className="mt-10 text-sm text-emerald-800">
          대학 연극·영화 동아리 소품 순환 플랫폼
        </p>
        <p className="mt-3 text-2xl font-bold text-slate-900">리플레이</p>

        <p className="mt-6 text-[11px] text-slate-400">
          화면을 탭하면 시작합니다
        </p>
      </div>
    </div>
  );
}
