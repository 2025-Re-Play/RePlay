"use client";

import {
  Search,
  Camera,
  ShoppingBag,
  Users,
  User,
  MonitorPlay,
  Sparkles,
  Package,
} from "lucide-react";
import { useState } from "react";
import BottomNav, { BottomTabKey } from "@/app/components/BottomNav";
import TradeScreen from "@/app/screens/TradeScreen";
import ItemNewScreen from "@/app/screens/ItemNewScreen";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ManageScreen from "@/app/screens/ManageScreen";
import CommunityScreen from "@/app/screens/CommunityScreen";
import CommunityWriteScreen from "@/app/screens/CommunityWriteScreen";
import { ChevronLeft } from "lucide-react";
import MyPageScreen from "@/app/screens/MyPageScreen";
import PerformanceCalendarScreen from "@/app/screens/PerformanceCalendarScreen";

const popularTags = [
  "#반디지",
  "#학교",
  "#공연소품",
  "#현대",
  "#전통",
  "#로맨틱",
  "#공감",
  "#단편",
  "#시대극",
  "#코미디",
];

export default function HomeScreen() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as BottomTabKey) ?? "home";

  const [activeTab, setActiveTab] = useState<BottomTabKey>(initialTab);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false); // 추가
  const [showCalendar, setShowCalendar] = useState(false); // ✅ 공연 캘린더

  const handleTabChange = (tab: BottomTabKey) => {
    setActiveTab(tab);
    setShowItemForm(false);
    setShowPostForm(false);
    setShowCalendar(false);
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-50">
      {/* 상단 헤더 */}
      <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
        {showPostForm ? (
          // 글쓰기 모드
          <>
            <button
              type="button"
              onClick={() => setShowPostForm(false)}
              className="flex items-center text-slate-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-slate-900">글쓰기</span>
            <button
              type="button"
              className="text-xs font-semibold text-emerald-500"
            >
              등록
            </button>
          </>
        ) : showCalendar ? (
          // ✅ 공연 캘린더 헤더
          <>
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="flex items-center text-slate-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-slate-900">
              공연 캘린더
            </span>
            <div className="w-4" />
          </>
        ) : (
          // 기본 헤더
          <>
            <span className="text-sm font-semibold text-slate-900">
              {showItemForm
                ? "물품 등록"
                : activeTab === "trade"
                ? "거래"
                : activeTab === "manage"
                ? "물품관리"
                : activeTab === "community"
                ? "커뮤니티"
                : activeTab === "mypage"
                ? "마이페이지"
                : "리플레이"}
            </span>

            <Link
              href="/login"
              className="flex items-center gap-1 text-xs text-emerald-600"
            >
              <span>로그인</span>
              <User className="h-4 w-4" />
            </Link>
          </>
        )}
      </header>



      {/* 가운데 영역만 스크롤 가능하게 */}
      <main className="flex-1 bg-slate-50 overflow-hidden">
        {showItemForm ? (
          <ItemNewScreen onBack={() => setShowItemForm(false)} />
        ) :  showPostForm ? (
          <CommunityWriteScreen onBack={() => setShowPostForm(false)} />
        ) : showCalendar ? (
          <PerformanceCalendarScreen />
        ) : (
          <>
            {activeTab === "home" && <HomeTab />}

            {activeTab === "trade" && (
              <TradeScreen onAddClick={() => setShowItemForm(true)} />
            )}

            {activeTab === "manage" && (
              <ManageScreen onAddClick={() => setShowItemForm(true)} />
            )}

            {activeTab === "community" && (
              <CommunityScreen 
              onAddClick={() => setShowPostForm(true)}
              onCalendarClick={() => setShowCalendar(true)}   // ✅ 추가
              />
            )}

            {activeTab === "mypage" && <MyPageScreen />}
          </>
        )}
      </main>

      {/* 하단 네비 */}
      <BottomNav
        active={showItemForm ? "manage" : showPostForm ? "community" : activeTab}
        onChange={handleTabChange}
      />
    </div>
  );
}

/* ----------------- 홈 탭 내용 ----------------- */

function HomeTab() {
  return (
    // 이 부분만 스크롤
    <div className="no-scrollbar h-full space-y-4 overflow-y-auto px-4 py-4">
      {/* 히어로 카드 */}
      <section className="relative rounded-3xl bg-emerald-50 px-5 py-4">
        <div className="pointer-events-none absolute right-4 top-2 opacity-20">
          <Sparkles className="h-20 w-20 text-emerald-400" />
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-emerald-600">
            대학 공연의 모든 것
          </p>
          <h1 className="text-base font-semibold text-slate-900">
            소품, 의상, 가구를
            <br />
            손쉽게 거래해요
          </h1>
          <p className="mt-1 text-[11px] text-emerald-700/80">
            공연 준비에 필요한 모든 것을 한 번에.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
            <Search className="h-4 w-4 text-emerald-500" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="어떤 소품을 찾으시나요?"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 메인 메뉴 아이콘 4개 */}
      <section className="grid grid-cols-4 gap-2">
        <MenuButton icon={<ShoppingBag className="h-5 w-5" />} label="거래" />
        <MenuButton icon={<Package className="h-5 w-5" />} label="물품관리" />
        <MenuButton icon={<Users className="h-5 w-5" />} label="커뮤니티" />
        <MenuButton
          icon={<MonitorPlay className="h-5 w-5" />}
          label="공연일정"
        />
      </section>

      {/* 인기 태그 */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-slate-900">인기 태그</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-full bg-white px-3 py-1 text-[11px] text-slate-700 shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <SectionHeader title="최근 등록 물품" />
      <EmptyListCard text="아직 등록된 물품이 없어요." />

      <SectionHeader title="다가오는 공연" />
      <EmptyListCard text="등록된 공연 일정이 없어요." />

      <section className="mt-2 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">
          내 물품도 등록해보세요
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          사용하지 않는 소품을 다른 연극부와 나눠요.
        </p>
        <button className="mt-3 w-full rounded-full bg-emerald-500 py-2 text-xs font-semibold text-white">
          로그인하고 시작하기
        </button>
      </section>
    </div>
  );
}

/* ----------------- 공통 작은 컴포넌트들 ----------------- */

type MenuButtonProps = {
  icon: React.ReactNode;
  label: string;
};

function MenuButton({ icon, label }: MenuButtonProps) {
  return (
    <button className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white py-3 text-[11px] text-slate-700 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

type SectionHeaderProps = {
  title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <h2 className="text-xs font-semibold text-slate-900">{title}</h2>
      <button className="text-[11px] font-medium text-emerald-600">
        더보기
      </button>
    </div>
  );
}

type EmptyListCardProps = {
  text: string;
};

function EmptyListCard({ text }: EmptyListCardProps) {
  return (
    <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-500">
      {text}
    </div>
  );
}
