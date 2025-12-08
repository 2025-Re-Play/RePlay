// app/screens/PerformanceCalendarScreen.tsx
"use client";

import { Search, MapPin, CalendarDays } from "lucide-react";
import Image from "next/image";

const cities = ["서울", "부산", "대구", "인천", "광주", "대전", "울산"];

type Performance = {
  id: number;
  title: string;
  category: string;
  university: string;
  city: string;
  period: string;
  image: string;
};

const performances: Performance[] = [
  {
    id: 1,
    title: "햇빛",
    category: "클래식/비극",
    university: "서울대학교",
    city: "서울",
    period: "2.15 - 2.17",
    image: "/sample-show-1.jpg", // 나중에 실제 이미지로 교체
  },
  {
    id: 2,
    title: "봄날의 꿈",
    category: "로맨스/코미디",
    university: "연세대학교",
    city: "서울",
    period: "2.20 - 2.22",
    image: "/sample-show-2.jpg",
  },
  {
    id: 3,
    title: "그날의 기억",
    category: "역사/드라마",
    university: "부산예술대학교",
    city: "부산",
    period: "3.1 - 3.3",
    image: "/sample-show-3.jpg",
  },
];

export default function PerformanceCalendarScreen() {
  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-slate-50 px-4 py-4 space-y-4">
      {/* 검색창 */}
      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="공연명 또는 학교 검색"
        />
      </div>

      {/* 지역 태그 */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {cities.map((city) => (
          <button
            key={city}
            className="flex-shrink-0 rounded-full bg-white px-3 py-1 text-[11px] text-slate-700 shadow-sm"
          >
            {city}
          </button>
        ))}
      </div>

      {/* 공연 카드 리스트 */}
      <div className="space-y-3 pb-6">
        {performances.map((p) => (
          <article
            key={p.id}
            className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm"
          >
            {/* 썸네일 */}
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-200">
              {/* 이미지 없으면 그냥 컬러 박스만 보여도 됨 */}
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover"
              />
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-1">
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                  {p.category}
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {p.title}
                </p>
                <p className="text-xs font-medium text-emerald-600">
                  {p.university}
                </p>
              </div>

              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.city}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {p.period}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
