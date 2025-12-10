"use client";

import Image from "next/image";

type AppHeaderProps = {
  title?: string;
  showLogo?: boolean;
  hidden?: boolean;
  onBellClick?: () => void;
};

export default function AppHeader({
  title,
  showLogo = true,
  hidden,
  onBellClick,
}: AppHeaderProps) {
  if (hidden) return null;

  return (
    <header className="flex h-20 items-center justify-between bg-white px-6 shadow-sm">
      {showLogo ? (
        <div className="flex items-center">
          <Image
            src="/icons/replay-logo.svg"
            alt="리플레이"
            width={31}
            height={36}
          />
        </div>
      ) : (
        <span className="text-sm font-semibold text-slate-900">{title}</span>
      )}

      <button
        type="button"
        onClick={onBellClick}
        className="flex items-center justify-center"
      >
        <Image src="/icons/bell.svg" alt="알림" width={26} height={28} />
      </button>
    </header>
  );
}
