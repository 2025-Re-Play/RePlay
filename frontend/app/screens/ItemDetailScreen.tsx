// app/screens/ItemDetailScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export type TradeItem = {
  id: number;
  category: string;
  title: string;
  school: string;
  tags: string[];
  price: string;

  // ✅ TradeScreen 더미데이터 확장 필드(선택)
  image?: string; // "/trade/xxx.jpg"
  location?: string; // "연세대학교", "혜화동" 등
  createdAt?: string; // "2025.03.12"
  description?: string; // 본문
};

type ItemDetailScreenProps = {
  item: TradeItem;
  onBack: () => void;
};

type Mode = "idle" | "renting" | "trading";
type ProgressStatus = "none" | "in-progress";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const RESERVED_DAYS = [2, 3, 12, 18, 22, 25];

export default function ItemDetailScreen({ item, onBack }: ItemDetailScreenProps) {
  const [rentStart, setRentStart] = useState<number | null>(null);
  const [rentEnd, setRentEnd] = useState<number | null>(null);

  const [tradeDate, setTradeDate] = useState<number | null>(null);

  const [openMode, setOpenMode] = useState<Mode>("idle");
  const [progress, setProgress] = useState<ProgressStatus>("none");

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleRentDateClick = (day: number) => {
    if (RESERVED_DAYS.includes(day)) return;

    if (!rentStart || (rentStart && rentEnd)) {
      setRentStart(day);
      setRentEnd(null);
    } else if (day < rentStart) {
      setRentStart(day);
    } else {
      setRentEnd(day);
    }
  };

  const handleTradeDateClick = (day: number) => {
    setTradeDate(day);
  };

  const handleRentConfirm = () => {
    if (!rentStart || !rentEnd) return;
    setOpenMode("idle");
    setProgress("in-progress");
    setShowSuccess(true);
  };

  const handleTradeConfirm = () => {
    if (!tradeDate) return;
    setOpenMode("idle");
    setProgress("in-progress");
    setShowSuccess(true);
  };

  const closeAll = () => {
    setOpenMode("idle");
    setShowSuccess(false);
  };

  // ✅ 화면에 표시할 텍스트 정리
  const metaLine = `${item.school}${item.createdAt ? ` · ${item.createdAt}` : ""}`;
  const tagLine = item.tags?.length ? item.tags.join(" · ") : "";
  const descText = item.description?.trim() ? item.description : "상품 설명이 없습니다.";

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-20 items-center justify-between border-b border-slate-100 px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center text-slate-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* ✅ 제목도 item.title로 */}
        <span className="text-[14px]">{item.title}</span>

        <div className="w-8" />
      </header>

      {/* 스크롤 영역 */}
      <main className="no-scrollbar flex-1 overflow-y-auto">
        {/* 이미지 영역 */}
        <section className="bg-slate-200">
          {/* ✅ 회색 박스 안에 이미지 넣기 */}
          <div className="relative h-65 w-full overflow-hidden bg-slate-200">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            ) : null}
          </div>
        </section>

        {/* 정보 영역 */}
        <section className="px-6 pb-32 pt-4">
          {/* ✅ 카테고리 */}
          <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
            {item.category}
          </span>

          {/* ✅ 상품명 */}
          <h1 className="mt-3 text-[22px] text-[#1A1A1A]">{item.title}</h1>

          {/* ✅ 학교/등록일 */}
          <p className="mt-2 text-sm text-[#A7A7A7]">{metaLine}</p>

          {/* ✅ 위치가 있으면 한 줄 더 */}
          {item.location ? (
            <p className="mt-1 text-sm text-[#A7A7A7]">위치 · {item.location}</p>
          ) : null}

          {/* ✅ 태그 */}
          {tagLine ? (
            <p className="mt-1 text-[14px] text-[#A7A7A7]">{tagLine}</p>
          ) : null}

          {/* ✅ 설명 */}
          <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-[#1A1A1A]">
            {descText}
          </p>
        </section>
      </main>

      {/* 하단 가격 + 버튼 영역 */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-slate-100 bg-white px-6 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          {/* ✅ 가격 */}
          <span className="ml-auto text-lg font-semibold text-slate-900">
            {item.price}
          </span>
        </div>

        {progress === "none" ? (
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-[10px] bg-[#237BFF] py-3 text-[16px] text-white"
              onClick={() => setOpenMode("renting")}
            >
              대여
            </button>
            <button
              className="flex-1 rounded-[10px] bg-[#0EBC81] py-3 text-[16px] text-white"
              onClick={() => setOpenMode("trading")}
            >
              거래
            </button>
          </div>
        ) : (
          <button
            className="w-full rounded-[10px] bg-[#9E9E9E] py-3 text-[16px] text-white"
            disabled
          >
            진행중
          </button>
        )}
      </div>

      {/* 대여 캘린더 모달 (기간 선택) */}
      {openMode === "renting" && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-black/60"
          onClick={closeAll}
        >
          <div
            className="w-full rounded-t-3xl bg-white px-6 pb-6 pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-slate-900">
              대여 일자를 선택해주세요
            </p>

            <p className="mt-4 text-base font-semibold text-slate-900">
              2025년 3월
            </p>

            <CalendarGrid
              mode="range"
              onDayClick={handleRentDateClick}
              selectedStart={rentStart}
              selectedEnd={rentEnd}
              disabledDays={RESERVED_DAYS}
            />

            <button
              className="mt-6 w-full rounded-[10px] bg-[#237BFF] py-3 text-[16px] text-white"
              onClick={handleRentConfirm}
              disabled={!rentStart || !rentEnd}
            >
              대여
            </button>
          </div>
        </div>
      )}

      {/* 거래 캘린더 모달 (단일 선택) */}
      {openMode === "trading" && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-black/60"
          onClick={closeAll}
        >
          <div
            className="w-full rounded-t-3xl bg-white px-6 pb-6 pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-slate-900">
              거래 일자를 선택해주세요
            </p>

            <p className="mt-4 text-base font-semibold text-slate-900">
              2025년 3월
            </p>

            <CalendarGrid
              mode="single"
              onDayClick={handleTradeDateClick}
              selectedStart={tradeDate}
              selectedEnd={null}
              disabledDays={[]}
            />

            <button
              className="mt-6 w-full rounded-[10px] bg-[#0EBC81] py-3 text-[16px] text-white"
              onClick={handleTradeConfirm}
              disabled={!tradeDate}
            >
              거래
            </button>
          </div>
        </div>
      )}

      {/* 성공 팝업 */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-8"
          onClick={closeAll}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-8 text-center shadow-xl">
            <div className="mx-auto flex items-center justify-center">
              <Image src="/icons/check.svg" alt="확인" width={48} height={48} />
            </div>
            <p className="mt-2.5 text-[16px] font-medium text-[#1A1A1A]">
              대여 및 거래가 성사되면
              <br />
              알림으로 알려드릴게요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- 캘린더 그리드 컴포넌트 ----------------- */

type CalendarGridProps = {
  mode: "range" | "single";
  onDayClick: (day: number) => void;
  selectedStart: number | null;
  selectedEnd: number | null;
  disabledDays: number[];
};

function CalendarGrid({
  mode,
  onDayClick,
  selectedStart,
  selectedEnd,
  disabledDays,
}: CalendarGridProps) {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mt-4">
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-slate-400">
        {weekDays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {DAYS.map((day) => {
          const disabled = disabledDays.includes(day);

          const isSelectedStart = selectedStart === day;
          const isSelectedEnd = mode === "range" && selectedEnd === day;

          const inRange =
            mode === "range" &&
            selectedStart != null &&
            selectedEnd != null &&
            day > selectedStart &&
            day < selectedEnd;

          const isSelectedSingle = mode === "single" && selectedStart === day;

          let className =
            "mx-auto flex h-9 w-9 items-center justify-center rounded-full";

          if (disabled) {
            className += " bg-slate-100 text-slate-300";
          } else if (isSelectedStart || isSelectedEnd || isSelectedSingle) {
            className += " bg-emerald-500 text-white";
          } else if (inRange) {
            className += " bg-emerald-50 text-emerald-600";
          } else {
            className += " text-slate-700";
          }

          return (
            <button
              key={day}
              type="button"
              className={className}
              onClick={() => !disabled && onDayClick(day)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
