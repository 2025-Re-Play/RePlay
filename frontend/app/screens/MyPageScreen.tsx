// app/screens/MyPageScreen.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";

type Performance = {
  id: number;
  title: string;
  period: string;
};

type Review = {
  id: number;
  playTitle: string;
  rating: number;
  date: string;
  content: string;
};

type MyPageScreenProps = {
  // true면 상세(리뷰) 모드 -> 헤더 숨김
  onDetailModeChange?: (isDetail: boolean) => void;
};

const performances: Performance[] = [
  { id: 1, title: "햄릿", period: "26.03.31 - 26.11.07" },
  { id: 2, title: "햄릿", period: "26.03.31 - 26.11.07" },
  { id: 3, title: "햄릿", period: "26.03.31 - 26.11.07" },
];

const mockReviews: Review[] = [
  {
    id: 1,
    playTitle: "햄릿",
    rating: 4,
    date: "26.03.31",
    content: "리뷰 내용 와 재밌네요",
  },
  {
    id: 2,
    playTitle: "햄릿",
    rating: 4,
    date: "26.03.31",
    content: "리뷰 내용 와 재밌네요",
  },
  {
    id: 3,
    playTitle: "햄릿",
    rating: 4,
    date: "26.03.31",
    content: "리뷰 내용 와 재밌네요",
  },
];

export default function MyPageScreen({ onDetailModeChange }: MyPageScreenProps) {
  const [selectedPerformance, setSelectedPerformance] =
    useState<Performance | null>(null);

  // ✅ 리뷰 화면 들어가면 true, 나오면 false로 알려줌
  useEffect(() => {
    onDetailModeChange?.(!!selectedPerformance);
  }, [selectedPerformance, onDetailModeChange]);

  // 리뷰 화면 (selectedPerformance 있을 때)
  if (selectedPerformance) {
    return (
      <div className="flex h-full flex-col bg-white">
        <header className="flex h-20 items-center px-4 shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedPerformance(null)}
            className="mr-2 flex h-9 w-9 items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
          </button>
          <p className="flex-1 text-center text-[16px] font-semibold text-[#1A1A1A]">
            {selectedPerformance.title} 리뷰 확인
          </p>
          <div className="h-9 w-9" />
        </header>

        <main className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          <section className="mt-4 mb-6 px-4">
            <p className="text-[16px] font-medium text-[#9E9E9E]">
              후기 (3) · 평균 4점
            </p>
          </section>

          <section className="space-y-6">
            {mockReviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </section>
        </main>
      </div>
    );
  }

  // 마이페이지 메인 화면 (공연 리스트)
  const name = "헤일로";
  const university = "연세대학교";
  const role = "관리자";

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4 pt-4">
        {/* 프로필 영역 */}
        <section className="mb-10">
          <p className="mb-2 text-[16px] font-medium text-[#9E9E9E]">
            프로필
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-[64px] w-[64px] rounded-[10px] bg-[#D9D9D9]" />

              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-medium text-[#1A1A1A]">
                  {name}
                </p>
                <p className="text-[14px] font-medium text-[#9E9E9E]">{university}</p>
                <p className="text-[14px] font-medium text-[#9E9E9E]">{role}</p>
              </div>
            </div>

            <button className="rounded-[5px] bg-[#F7F7F7] px-2 py-1 text-[14px] font-bold text-[#4F4F4F]">
              로그아웃
            </button>
          </div>
        </section>

        {/* 우리 공연 관리 */}
        <section className="space-y-4">
          <p className="text-[16px] font-medium text-[#9E9E9E]">
            우리 공연 관리
          </p>

          <div className="space-y-4">
            {performances.map((pf) => (
              <PerformanceRow
                key={pf.id}
                performance={pf}
                onClickReview={() => setSelectedPerformance(pf)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type PerformanceRowProps = {
  performance: Performance;
  onClickReview: () => void;
};

function PerformanceRow({ performance, onClickReview }: PerformanceRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-[64px] w-[64px] rounded-[10px] bg-[#D9D9D9]" />
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-medium text-[#1A1A1A]">
            {performance.title}
          </p>
          <p className="text-[14px] font-medium text-[#9E9E9E]">{performance.period}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClickReview}
        className="rounded-[5px] bg-[#F7F7F7] px-2 py-1 text-[14px] font-bold text-[#4F4F4F]"
      >
        리뷰확인
      </button>
    </div>
  );
}

type ReviewRowProps = {
  review: Review;
};

function ReviewRow({ review }: ReviewRowProps) {
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-[36px] w-[36px] rounded-full bg-[#D1D6DB]" />

          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-medium text-[#1A1A1A]">
              {review.playTitle}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < review.rating;
                return (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${
                      filled
                        ? "text-[#0EBC81] fill-[#0EBC81]"
                        : "text-[#D1D6DB] fill-[#D1D6DB]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[14px] font-medium text-[#D1D6DB]">{review.date}</p>
      </div>

      <p className="text-[14px] mt-2 font-medium text-[#1A1A1A]">{review.content}</p>
    </div>
  );
}
