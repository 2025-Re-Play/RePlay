"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import BottomNav, { BottomTabKey } from "@/app/components/BottomNav";
import AppHeader from "@/app/components/AppHeader";

import TradeScreen from "@/app/screens/TradeScreen";
import ItemNewScreen from "@/app/screens/ItemNewScreen";
import ManageScreen from "@/app/screens/ManageScreen";
import CommunityScreen from "@/app/screens/CommunityScreen";
import CommunityWriteScreen from "@/app/screens/CommunityWriteScreen";
import MyPageScreen from "@/app/screens/MyPageScreen";
import PerformanceCalendarScreen from "@/app/screens/PerformanceCalendarScreen";

export default function HomeScreen() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as BottomTabKey) ?? "home";

  const [activeTab, setActiveTab] = useState<BottomTabKey>(initialTab);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [headerHidden, setHeaderHidden] = useState(false);

  const handleTabChange = (tab: BottomTabKey) => {
    setActiveTab(tab);
    setShowItemForm(false);
    setShowPostForm(false);
    setShowCalendar(false);
    setHeaderHidden(false);
  };

  const headerTitle =
    activeTab === "trade"
      ? "거래"
      : activeTab === "manage"
      ? "물품관리"
      : activeTab === "community"
      ? "커뮤니티"
      : activeTab === "mypage"
      ? "마이페이지"
      : undefined;

  return (
    <div className="flex h-full w-full flex-col bg-slate-50">
      {/* 상단 헤더 */}
      <AppHeader
        title={headerTitle}
        showLogo={!showItemForm && !showPostForm && !showCalendar}
        hidden={headerHidden}
      />

      {/* 가운데 영역 */}
      <main className="flex-1 overflow-hidden bg-slate-50">
        {showItemForm ? (
          <ItemNewScreen onBack={() => setShowItemForm(false)} />
        ) : showPostForm ? (
          <CommunityWriteScreen onBack={() => setShowPostForm(false)} />
        ) : showCalendar ? (
          <PerformanceCalendarScreen />
        ) : (
          <>
            {activeTab === "home" && <HomeTab />}

            {activeTab === "trade" && (
              <TradeScreen
                onAddClick={() => setShowItemForm(true)}
                onDetailModeChange={setHeaderHidden} // ✅ 상세 모드일 때 헤더 숨김
              />
            )}

            {activeTab === "manage" && (
              <ManageScreen
                onAddClick={() => setShowItemForm(true)}
                onDetailModeChange={(isDetail) => setHeaderHidden(isDetail)}
              />
            )}

            {activeTab === "community" && (
              <CommunityScreen
                onCalendarClick={() => setShowCalendar(true)}
                onHeaderHiddenChange={(hidden) => setHeaderHidden(hidden)}
              />
            )}

            {activeTab === "mypage" && (  <MyPageScreen onDetailModeChange={setHeaderHidden} />
            )}
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

/* ----------------- 홈 탭 (메인 홈 화면) ----------------- */

function HomeTab() {
  return (
    <div className="no-scrollbar h-full space-y-6 overflow-y-auto px-4 pb-6 pt-2">
      {/* 상단 큰 카드 */}
      <section
        className="mt-2 rounded-3xl px-5 py-6
        bg-[linear-gradient(90deg,#DEF8EC_0%,#DEF8EC_98%,#FDFDFD_100%)]"
      >
        <p className="text-[20px] font-bold text-[#1A1A1A]">
          대학 공연의 모든 것
        </p>
        <p className="mt-2 text-[14px] text-[#9E9E9E]">
          원하는 소품, 의상, 가구를 손쉽게 거래하세요
        </p>

        {/* 검색창 + 카메라 버튼 */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[14px] text-slate-500 shadow-sm">
            <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
            <input
              className="h-9 w-full bg-transparent text-[14px] text-[#D1D6DB] outline-none"
              placeholder="어떤 소품을 찾으시나요?"
            />
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[20px]
                        bg-gradient-to-r from-white to-[#D9FFEE]"
          >
            <Image src="/icons/camera.svg" alt="카메라" width={18} height={18} />
          </button>
        </div>
      </section>

      {/* 두 번째 카드 */}
      <section className="rounded-[20px] bg-white px-5 py-6 shadow-sm">
        <p className="text-center text-[16px] font-semibold text-[#4F4F4F]">
          우리 동방에 뭐가 남았지?
        </p>
        <p className="mt-2 text-center text-[14px] text-[#9E9E9E]">
          사용하지 않는 물품을 다른 연극부와 공유해요
        </p>
        <button className="mx-auto mt-4 block w-[124px] rounded-[12px] bg-[#0EBC81] py-2 text-[14px] text-white">
          물품 등록하기
        </button>
      </section>

      {/* 최근 등록 물품 */}
      <section className="space-y-3">
        <SectionHeaderWithArrow title="최근 등록 물품" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </div>
      </section>

      {/* 다가오는 공연 */}
      <section className="space-y-3">
        <SectionHeaderWithArrow title="다가오는 공연" />
        <p className="text-[11px] text-slate-500">
          등록된 공연 일정이 없어요.
        </p>
      </section>
    </div>
  );
}

/* ----------------- 홈 탭용 작은 컴포넌트들 ----------------- */

type SectionHeaderWithArrowProps = {
  title: string;
};

function SectionHeaderWithArrow({ title }: SectionHeaderWithArrowProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <button type="button">
        <Image src="/icons/arrow-right.svg" alt="더보기" width={20} height={20} />
      </button>
    </div>
  );
}

function ItemCard() {
  return (
    <div className="flex min-w-[200px] items-center rounded-[12px] bg-white p-3 shadow-sm">
      <div className="h-16 w-16 rounded-xl bg-slate-200" />
      <div className="ml-3 flex flex-col gap-1">
        <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
          가구
        </span>
        <span className="text-[16px] text-[#4F4F4F]">물품명</span>
      </div>
    </div>
  );
}
