"use client";

import { Search, Box, Plus } from "lucide-react";
import { useState } from "react";

type ManageScreenProps = {
  onAddClick: () => void; // + 버튼 눌렀을 때 호출
};

const filters = ["전체", "거래가능", "예약중", "판매완료", "대여중"];

export default function ManageScreen({ onAddClick }: ManageScreenProps) {
  const [activeFilter, setActiveFilter] = useState("전체");

  return (
    <div className="relative flex h-full flex-col bg-slate-50">
      {/* 이 안이 스크롤 영역 */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {/* 검색창 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="내 물품 검색"
            />
          </div>
        </div>

        {/* 상태 필터 버튼들 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((name) => {
            const active = activeFilter === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setActiveFilter(name)}
                className={`rounded-full px-4 py-1.5 text-[11px] ${
                  active
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* 비어 있는 상태 */}
        <div className="flex h-[55vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
            <Box className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            등록된 물품이 없습니다
          </p>
          <p className="mt-1 text-xs text-slate-400">
            새 물품을 등록해보세요
          </p>

          <button className="mt-4 rounded-full bg-emerald-500 px-6 py-2 text-xs font-semibold text-white">
            물품 등록하기
          </button>
        </div>
      </div>

      {/* 오른쪽 아래 플로팅 + 버튼 */}
      <button
        onClick={onAddClick}
        className="fixed bottom-20 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
