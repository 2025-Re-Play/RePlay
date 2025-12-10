// app/components/BottomNav.tsx
"use client";

import React from "react";
import Image from "next/image";

export type BottomTabKey = "home" | "trade" | "manage" | "community" | "mypage";

type BottomNavProps = {
  active: BottomTabKey;
  onChange: (tab: BottomTabKey) => void;
};

type TabConfig = {
  key: BottomTabKey;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
};

const tabs: TabConfig[] = [
  {
    key: "home",
    label: "홈",
    activeIcon: "/icons/nav-home-active.svg",
    inactiveIcon: "/icons/nav-home-inactive.svg",
  },
  {
    key: "trade",
    label: "거래",
    activeIcon: "/icons/nav-trade-active.svg",
    inactiveIcon: "/icons/nav-trade-inactive.svg",
  },
  {
    key: "manage",
    label: "물품관리",
    activeIcon: "/icons/nav-manage-active.svg",
    inactiveIcon: "/icons/nav-manage-inactive.svg",
  },
  {
    key: "community",
    label: "커뮤니티",
    activeIcon: "/icons/nav-community-active.svg",
    inactiveIcon: "/icons/nav-community-inactive.svg",
  },
  {
    key: "mypage",
    label: "마이페이지",
    activeIcon: "/icons/nav-mypage-active.svg",
    inactiveIcon: "/icons/nav-mypage-inactive.svg",
  },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="flex h-16 items-center justify-between border-t border-slate-200 bg-white">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const iconSrc = isActive ? tab.activeIcon : tab.inactiveIcon;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex h-full flex-1 flex-col items-center justify-center text-[11px] ${
              isActive ? "text-[#0EBC81]" : "text-[#D1D6DB]"
            }`}
          >
            {/* 아이콘 */}
            <div className="mt-2 mb-1 flex items-center justify-center">
              <Image
                src={iconSrc}
                alt={tab.label}
                width={56}
                height={48}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
