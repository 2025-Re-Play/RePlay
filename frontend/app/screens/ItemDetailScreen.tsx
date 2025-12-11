"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export type TradeItem = {
  id: number;
  category: string;
  title: string;
  school: string;
  tags: string[];
  price: string;
};

type ItemDetailScreenProps = {
    item: TradeItem;
  onBack: () => void;
};

type Mode = "idle" | "renting" | "trading"; // 어떤 캘린더를 열었는지
type ProgressStatus = "none" | "in-progress";

// 간단히 3월 한 달만 사용하는 달력 (1~31)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

// 이미 예약된 날(대여용) 예시
const RESERVED_DAYS = [2, 3, 12, 18, 22, 25];

export default function ItemDetailScreen({ item, onBack }: ItemDetailScreenProps) {
  // 대여: 시작 / 끝 날짜
  const [rentStart, setRentStart] = useState<number | null>(null);
  const [rentEnd, setRentEnd] = useState<number | null>(null);

  // 거래: 단일 날짜
  const [tradeDate, setTradeDate] = useState<number | null>(null);

  // 어떤 캘린더가 열려있는지
  const [openMode, setOpenMode] = useState<Mode>("idle");

  // 진행중 여부 (대여/거래 공통)
  const [progress, setProgress] = useState<ProgressStatus>("none");

  // 상단 성공 팝업
  const [showSuccess, setShowSuccess] = useState(false);

  // 팝업 자동 숨김 타이머
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

  const isInRentRange = (day: number) => {
    if (!rentStart || !rentEnd) return false;
    return day >= rentStart && day <= rentEnd;
  };

  const isDisabled = (day: number) => RESERVED_DAYS.includes(day);

  const closeAll = () => {
    setOpenMode("idle");
    setShowSuccess(false);
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center text-slate-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold text-slate-900">물건명</span>
        <div className="w-8" />
      </header>

      {/* 스크롤 영역 */}
      <main className="no-scrollbar flex-1 overflow-y-auto">
        {/* 이미지 영역 */}
        <section className="bg-slate-200">
          <div className="h-64 w-full bg-slate-200" />
          <div className="flex items-center justify-center gap-1 py-3">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
        </section>

        {/* 정보 영역 */}
        <section className="px-6 pb-32 pt-4">
          <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
            가구
          </span>

          <h1 className="mt-3 text-xl font-bold text-slate-900">상품명</h1>

          <p className="mt-2 text-sm text-slate-400">
            연세대학교 · 26.03.31
          </p>

          <p className="mt-1 text-sm text-slate-400">태그 · 태그 · 태그</p>

          <p className="mt-6 text-sm leading-relaxed text-slate-800">
            상품 설명 글 상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품
            설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글
            상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글
          </p>
        </section>
      </main>

      {/* 하단 가격 + 버튼 영역 */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-slate-100 bg-white px-6 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            331,331원
          </span>
        </div>

        {progress === "none" ? (
          <div className="flex gap-3">
            <button
              className="flex-1 rounded-2xl bg-[#2F7BF6] py-3 text-sm font-semibold text-white"
              onClick={() => setOpenMode("renting")}
            >
              대여
            </button>
            <button
              className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white"
              onClick={() => setOpenMode("trading")}
            >
              거래
            </button>
          </div>
        ) : (
          <button
            className="w-full rounded-2xl bg-slate-300 py-3 text-sm font-semibold text-white"
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
              className="mt-6 w-full rounded-2xl bg-[#2F7BF6] py-3 text-sm font-semibold text-white"
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
              className="mt-6 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white"
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-8 w-8 text-white" />
            </div>
            <p className="mt-6 text-sm font-medium text-slate-900">
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
  // 요일 헤더
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="mt-4">
      {/* 요일 */}
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
