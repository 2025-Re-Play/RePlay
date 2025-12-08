"use client";

import {
  User,
  Package,
  Calendar,
  Heart,
  Star,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function MyPageScreen() {
  // TODO: 나중에 실제 로그인 정보랑 연결
  const name = "홍길동";
  const university = "서울대학교";
  const email = "test@naver.com";

  const initial = name[0] ?? "유";

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <main className="no-scrollbar flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 프로필 카드 */}
        <section className="px-5 py-5">
          <div className="flex items-center gap-4">
            {/* 동그란 프로필 아이콘 */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {initial}
            </div>

            <div className="flex flex-1 flex-col">
              <p className="text-sm font-semibold text-slate-900">{name}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {university}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">{email}</p>
            </div>
          </div>

          <button className="mt-4 w-full rounded-full border border-slate-200 py-2 text-xs font-medium text-slate-700">
            프로필 수정
          </button>
        </section>

        {/* 내 물품 / 예약 내역 / 관심 목록 / 내 공연 */}
        <section className="space-y-1 px-4 py-3">
          <MyPageRow
            icon={<Package className="h-4 w-4 text-emerald-500" />}
            label="내 물품"
            value="0"
          />
          <Divider />
          <MyPageRow
            icon={<Calendar className="h-4 w-4 text-emerald-500" />}
            label="예약 내역"
          />
          <Divider />
          <MyPageRow
            icon={<Heart className="h-4 w-4 text-emerald-500" />}
            label="관심 목록"
          />
          <Divider />
          <MyPageRow
            icon={<Star className="h-4 w-4 text-emerald-500" />}
            label="내 공연"
          />
        </section>

        {/* 🔹 내 공연과 설정 사이 회색 선 */}
        <div className="h-px bg-slate-100 mx-4" />

        {/* 설정 / 도움말 */}
        <section className="space-y-1 px-4 py-3">
          <MyPageRow
            icon={<Settings className="h-4 w-4 text-gray-500" />}
            label="설정"
            noBackground // ✅ 초록 원 제거
          />
          <Divider />
          <MyPageRow
            icon={<HelpCircle className="h-4 w-4 text-gray-500" />}
            label="도움말"
            noBackground // ✅ 초록 원 제거
          />
        </section>

        {/* 로그아웃 */}
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500"
        >
          <LogOut className="h-4 w-4" /> {/* ✅ 아이콘 추가 */}
          <span>로그아웃</span>
        </button>
      </main>
    </div>
  );
}

/* ---- 작은 컴포넌트들 ---- */

type MyPageRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  noBackground?: boolean; // ✅ 설정/도움말용 옵션
};

function MyPageRow({ icon, label, value, noBackground }: MyPageRowProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-xl ${
            noBackground ? "" : "bg-emerald-50"
          }`}
        >
          {icon}
        </div>
        <span className="text-xs text-slate-800">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {value && (
          <span className="text-[11px] text-slate-400">{value}</span>
        )}
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100" />;
}
