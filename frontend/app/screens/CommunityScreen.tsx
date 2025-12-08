"use client";

import { Search, Calendar, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

type CommunityScreenProps = {
  onAddClick: () => void;
  onCalendarClick: () => void;
};

const boards = ["일반 게시판", "소품 요청"];

export default function CommunityScreen({ onAddClick, onCalendarClick, }: CommunityScreenProps) {
  const [activeBoard, setActiveBoard] = useState<string>("일반 게시판");

  return (
    <div className="relative flex h-full flex-col bg-slate-50">
      {/* 스크롤 영역 */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 검색창 */}
        <section>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="게시글 검색"
            />
          </div>
        </section>

        {/* 공연 캘린더 카드 */}
        <section>
          <button 
           type= "button"
           onClick={onCalendarClick}
           className="flex w-full items-center gap-3 rounded-3xl bg-emerald-50 px-4 py-4 text-left shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800">
                공연 캘린더
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-700/80">
                대학 공연 일정 확인
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-emerald-500" />
          </button>
        </section>

        {/* 게시판 탭 (일반 게시판 / 소품 요청) */}
        <section>
          <div className="flex rounded-2xl bg-slate-100 p-1">
            {boards.map((name) => {
              const active = activeBoard === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveBoard(name)}
                  className={`flex-1 rounded-2xl py-2 text-center text-xs font-medium ${
                    active
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </section>

        {/* 비어있는 상태 텍스트 */}
        <section className="flex h-[55vh] items-center justify-center">
          <p className="text-xs text-slate-400">게시글이 없습니다</p>
        </section>
      </div>

      {/* 플로팅 + 버튼 */}
      <button
        onClick={onAddClick}
        className="fixed bottom-20 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
