"use client";

import React from "react";
import { Home, ShoppingBag, Users, User, Package } from "lucide-react";

export type BottomTabKey = "home" | "trade" | "manage" | "community" | "mypage";

type BottomNavProps = {
  active: BottomTabKey;
  onChange: (tab: BottomTabKey) => void;
};

const tabs: { key: BottomTabKey; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "홈", icon: <Home className="h-5 w-5" /> },
  { key: "trade", label: "거래", icon: <ShoppingBag className="h-5 w-5" /> },
  { key: "manage", label: "물품관리", icon: <Package className="h-5 w-5" /> },
  { key: "community", label: "커뮤니티", icon: <Users className="h-5 w-5" /> },
  { key: "mypage", label: "마이", icon: <User className="h-5 w-5" /> },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="flex h-14 items-center justify-between border-t border-slate-200 bg-white">
      {tabs.map((tab) => {
        const isActive = tab.key === active;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex h-full flex-1 flex-col items-center justify-center text-[11px] ${
              isActive ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {/* 아이콘 */}
            <div className="mb-0.5 flex items-center justify-center">
              {tab.icon}
            </div>
            {/* 라벨 */}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
