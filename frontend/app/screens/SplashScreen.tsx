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
          src="/icons/replay-logo.svg"
          alt="리플레이 로고"
          width={86}
          height={99}
        />

        {/* 한 줄짜리 슬로건 + 색/크기 사진1처럼 */}
        <p className="mt-12 text-xl text-[#004D2F]">
          연극·영화 소품 플랫폼
        </p>

        {/* 서비스 이름 크게 */}
        <p className="mt-2.5 text-2xl font-bold text-[#004D2F]">
          리플레이
        </p>
      </div>
    </div>
  );
}
