"use client";

import Image from "next/image";

type AppHeaderProps = {
  // 홈이 아닐 때 다른 타이틀 쓰고 싶으면 여기로
  title?: string;
  showLogo?: boolean;
  onBellClick?: () => void;
};

export default function AppHeader({
  title,
  showLogo = true,
  onBellClick,
}: AppHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between bg-white px-6 shadow-sm">
      {showLogo ? (
        <div className="flex items-center">
          {/* 좌측 로고 (R 아이콘) */}
          <Image
            src="/icons/replay-logo.svg"
            alt="리플레이"
            width={31}
            height={36}
          />
        </div>
      ) : (
        <span className="text-sm font-semibold text-slate-900">
          {title}
        </span>
      )}

      {/* 우측 알림 아이콘 */}
      <button
        type="button"
        onClick={onBellClick}
        className="flex items-center justify-center"
      >
        <Image
          src="/icons/bell.svg"
          alt="알림"
          width={26}
          height={28}
        />
      </button>
    </header>
  );
}
