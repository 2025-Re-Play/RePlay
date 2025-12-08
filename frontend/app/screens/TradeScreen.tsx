"use client";

import { Camera, Filter, Search, Box, Plus } from "lucide-react";

type TradeScreenProps = {
  onAddClick: () => void;
};

export default function TradeScreen({ onAddClick }: TradeScreenProps) {
  return (
    // 바깥: HomeScreen의 <main> 안에 들어가는 영역
    <div className="relative flex h-full flex-col bg-slate-50">
      {/* 이 안만 스크롤 */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {/* 검색 + 카메라 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="소품 이름 또는 태그 검색"
              />
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* 필터 버튼 */}
          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
            <Filter className="h-4 w-4" />
            <span>필터</span>
          </button>
        </div>

        {/* 비어 있는 상태 */}
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Box className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            검색 결과가 없습니다
          </p>
          <p className="mt-1 text-xs text-slate-400">
            다른 검색어나 필터를 시도해보세요
          </p>
        </div>
      </div>

      {/* 플로팅 + 버튼 – BottomNav 위에 떠 있게 */}
      <button
        onClick={onAddClick}
        className="fixed bottom-20 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
