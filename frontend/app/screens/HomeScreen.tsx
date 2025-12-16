"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

import BottomNav, { BottomTabKey } from "@/app/components/BottomNav";
import AppHeader from "@/app/components/AppHeader";

import TradeScreen from "@/app/screens/TradeScreen";
import ItemNewScreen from "@/app/screens/ItemNewScreen";
import ManageScreen from "@/app/screens/ManageScreen";
import CommunityScreen from "@/app/screens/CommunityScreen";
import CommunityWriteScreen from "@/app/screens/CommunityWriteScreen";
import MyPageScreen from "@/app/screens/MyPageScreen";
import PerformanceCalendarScreen from "@/app/screens/PerformanceCalendarScreen";
import ItemDetailScreen, { TradeItem } from "@/app/screens/ItemDetailScreen";

import NeedLoginModal from "@/app/components/NeedLoginModal";
import LoginScreen from "@/app/screens/LoginScreen";
import SignupRoleScreen from "@/app/screens/SignupRoleScreen";
import SignupFormScreen from "@/app/screens/SignupFormScreen";
import { useAuth } from "@/app/auth";

type HomeRecentItem = TradeItem & {
  image?: string;
  description?: string;
  createdAt?: string;
};

type UpcomingPerformance = {
  id: number;
  title: string;
  dateText: string;
  placeText: string;
};

const HOME_RECENT_ITEMS: HomeRecentItem[] = [
  {
    id: 9001,
    category: "가구",
    title: "원목 책상",
    school: "연세대학교",
    tags: ["빈티지", "학교", "현대"],
    price: "70,000원",
    image: "/items/item-1.png",
    description: "동아리방에서 사용하던 원목 책상입니다.",
    createdAt: "2025.03.12",
  },
  {
    id: 9002,
    category: "소품",
    title: "빈티지 서류 가방",
    school: "연세대학교",
    tags: ["빈티지", "현대극", "리얼리즘"],
    price: "30,000원",
    image: "/items/item-3.png",
    description: "현대극 공연에서 사용했던 서류 가방입니다.",
    createdAt: "2025.03.15",
  },
  {
    id: 9003,
    category: "조명",
    title: "무대용 스탠드 조명",
    school: "연세대학교",
    tags: ["공포", "현대", "전등"],
    price: "60,000원",
    image: "/items/item-5.png",
    description: "조도 조절 가능한 스탠드 조명입니다.",
    createdAt: "2025.03.05",
  },
];

const UPCOMING_PERFORMANCES: UpcomingPerformance[] = [
  { id: 5001, title: "우리들의 여름", dateText: "2025.02.15-02.17", placeText: "연세대학교 학생회관 대강당" },
  { id: 5002, title: "햄릿: 변주", dateText: "2025.03.01-03.03", placeText: "대학로 소극장 예그린" },
  { id: 5003, title: "웃음의 기술", dateText: "2025.03.22-03.23", placeText: "부산문화회관 소극장" },
];

export default function HomeScreen() {
  const auth = useAuth();

  // ✅ 훅들은 return 이전에 전부 호출되어야 함
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as BottomTabKey) ?? "home";

  const [activeTab, setActiveTab] = useState<BottomTabKey>(initialTab);

  const [showItemForm, setShowItemForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [headerHidden, setHeaderHidden] = useState(false);

  const [homeSelectedItem, setHomeSelectedItem] = useState<HomeRecentItem | null>(null);
  const [homeSelectedPerformance, setHomeSelectedPerformance] = useState<UpcomingPerformance | null>(null);

  // ✅ auth 화면이면 헤더/네비 없이 auth 화면만 렌더
  if (auth.authScreen === "login") return <LoginScreen />;
  if (auth.authScreen === "signupRole") return <SignupRoleScreen />;
  if (auth.authScreen === "signupForm") return <SignupFormScreen />;

  const handleTabChange = (tab: BottomTabKey) => {
    setActiveTab(tab);
    setShowItemForm(false);
    setShowPostForm(false);
    setShowCalendar(false);
    setHomeSelectedItem(null);
    setHomeSelectedPerformance(null);
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
      {/* ✅ 로그인 필요 모달은 "한 번만" */}
      <NeedLoginModal
        open={auth.needLoginOpen}
        onClose={auth.closeNeedLogin}
        onGoLogin={auth.goLoginFromModal}
      />

      <AppHeader
        title={headerTitle}
        showLogo={!showItemForm && !showPostForm && !showCalendar && !homeSelectedItem && !homeSelectedPerformance}
        hidden={headerHidden || showCalendar || !!homeSelectedItem || !!homeSelectedPerformance}
      />

      <main className="flex-1 overflow-hidden bg-slate-50">
        {showItemForm ? (
          <ItemNewScreen
            onBack={() => {
              setShowItemForm(false);
              setHeaderHidden(false);
            }}
            onHeaderHiddenChange={setHeaderHidden}
          />
        ) : showPostForm ? (
          <CommunityWriteScreen onBack={() => setShowPostForm(false)} />
        ) : showCalendar ? (
          <PerformanceCalendarScreen
            onBack={() => {
              setShowCalendar(false);
              setHeaderHidden(false);
            }}
          />
        ) : homeSelectedItem ? (
          <ItemDetailScreen
            item={homeSelectedItem}
            onBack={() => {
              setHomeSelectedItem(null);
              setHeaderHidden(false);
            }}
          />
        ) : homeSelectedPerformance ? (
          <PerformanceDetailScreen
            p={homeSelectedPerformance}
            onBack={() => {
              setHomeSelectedPerformance(null);
              setHeaderHidden(false);
            }}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeTab
                recentItems={HOME_RECENT_ITEMS}
                upcoming={UPCOMING_PERFORMANCES}
                onClickRegister={() => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setShowItemForm(true);
                  });
                }}
                onClickRecentArrow={() => {
                  auth.requireLogin(() => {
                    setActiveTab("manage");
                    setShowItemForm(false);
                    setShowPostForm(false);
                    setShowCalendar(false);
                    setHomeSelectedItem(null);
                    setHomeSelectedPerformance(null);
                    setHeaderHidden(false);
                  });
                }}
                onClickUpcomingArrow={() => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setShowCalendar(true);
                  });
                }}
                onClickRecentItem={(item) => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setHomeSelectedItem(item);
                  });
                }}
                onClickUpcomingItem={(p) => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setHomeSelectedPerformance(p);
                  });
                }}
                onSearchGoTrade={() => {
                  setActiveTab("trade");
                  setShowItemForm(false);
                  setShowPostForm(false);
                  setShowCalendar(false);
                  setHomeSelectedItem(null);
                  setHomeSelectedPerformance(null);
                  setHeaderHidden(false);
                }}
              />
            )}

            {activeTab === "trade" && (
              <TradeScreen
                onAddClick={() => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setShowItemForm(true);
                  });
                }}
                onDetailModeChange={setHeaderHidden}
              />
            )}

            {activeTab === "manage" && (
              <ManageScreen
                onAddClick={() => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setShowItemForm(true);
                  });
                }}
                onDetailModeChange={setHeaderHidden}
              />
            )}

            {activeTab === "community" && (
              <CommunityScreen
                onCalendarClick={() => {
                  auth.requireLogin(() => {
                    setHeaderHidden(true);
                    setShowCalendar(true);
                  });
                }}
                onHeaderHiddenChange={setHeaderHidden}
              />
            )}

            {activeTab === "mypage" && <MyPageScreen onDetailModeChange={setHeaderHidden} />}
          </>
        )}
      </main>

      <BottomNav active={showItemForm ? "manage" : showPostForm ? "community" : activeTab} onChange={handleTabChange} />
    </div>
  );
}

/* ===================== 홈 탭 ===================== */

function HomeTab({
  recentItems,
  upcoming,
  onClickRegister,
  onClickRecentArrow,
  onClickUpcomingArrow,
  onClickRecentItem,
  onClickUpcomingItem,
  onSearchGoTrade,
}: {
  recentItems: HomeRecentItem[];
  upcoming: UpcomingPerformance[];
  onClickRegister: () => void;
  onClickRecentArrow: () => void;
  onClickUpcomingArrow: () => void;
  onClickRecentItem: (item: HomeRecentItem) => void;
  onClickUpcomingItem: (p: UpcomingPerformance) => void;
  onSearchGoTrade: () => void;
}) {
  const [homeSearch, setHomeSearch] = useState("");

  return (
    <div className="no-scrollbar h-full space-y-6 overflow-y-auto px-4 pb-6 pt-2">
      <section
        className="mt-2 rounded-3xl px-5 py-6
        bg-[linear-gradient(90deg,#DEF8EC_0%,#DEF8EC_98%,#FDFDFD_100%)]"
      >
        <p className="text-[20px] font-bold text-[#1A1A1A]">대학 공연의 모든 것</p>
        <p className="mt-2 text-[14px] text-[#9E9E9E]">원하는 소품, 의상, 가구를 손쉽게 거래하세요</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
            <input
              className="h-9 w-full bg-transparent text-[14px] text-[#D1D6DB] outline-none"
              placeholder="어떤 소품을 찾으시나요?"
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchGoTrade();
              }}
            />
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[20px] bg-gradient-to-r from-white to-[#D9FFEE]"
            onClick={onSearchGoTrade}
            type="button"
          >
            <Image src="/icons/camera.svg" alt="카메라" width={18} height={18} />
          </button>
        </div>
      </section>

      <section className="rounded-[20px] bg-white px-5 py-6 shadow-sm">
        <p className="text-center text-[16px] font-semibold text-[#4F4F4F]">우리 동방에 뭐가 남았지?</p>
        <p className="mt-2 text-center text-[14px] text-[#9E9E9E]">사용하지 않는 물품을 다른 연극부와 공유해요</p>
        <button
          type="button"
          onClick={onClickRegister}
          className="mx-auto mt-4 block w-[124px] rounded-[12px] bg-[#0EBC81] py-2 text-[14px] text-white"
        >
          물품 등록하기
        </button>
      </section>

      <section className="space-y-3">
        <SectionHeaderWithArrow title="최근 등록 물품" onArrowClick={onClickRecentArrow} />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {recentItems.map((it) => (
            <ItemCard key={it.id} category={it.category} title={it.title} image={it.image} onClick={() => onClickRecentItem(it)} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeaderWithArrow title="다가오는 공연" onArrowClick={onClickUpcomingArrow} />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {upcoming.map((p) => (
            <PerformanceCard key={p.id} title={p.title} dateText={p.dateText} placeText={p.placeText} onClick={() => onClickUpcomingItem(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeaderWithArrow({ title, onArrowClick }: { title: string; onArrowClick: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <button type="button" onClick={onArrowClick}>
        <Image src="/icons/arrow-right.svg" alt="더보기" width={20} height={20} />
      </button>
    </div>
  );
}

function ItemCard({
  category,
  title,
  image,
  onClick,
}: {
  category: string;
  title: string;
  image?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex min-w-[250px] items-center rounded-[12px] bg-white p-3 shadow-sm">
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-200">
        {image ? <Image src={image} alt={title} fill className="object-cover" /> : null}
      </div>
      <div className="ml-3 flex flex-col gap-1">
        <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
          {category}
        </span>
        <span className="text-[16px] text-[#4F4F4F]">{title}</span>
      </div>
    </button>
  );
}

function PerformanceCard({
  title,
  dateText,
  placeText,
  onClick,
}: {
  title: string;
  dateText: string;
  placeText: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex min-w-[250px] items-center rounded-[12px] bg-white p-3 shadow-sm">
      <div className="flex-1">
        <p className="text-[16px] font-semibold text-[#4F4F4F]">{title}</p>
        <p className="mt-1 text-[14px] text-[#9E9E9E]">{dateText}</p>
        <p className="mt-1 text-[14px] text-[#9E9E9E]">{placeText}</p>
      </div>
    </button>
  );
}

/* =================== 공연 상세 화면 =================== */

function PerformanceDetailScreen({ p, onBack }: { p: UpcomingPerformance; onBack: () => void }) {
  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="flex h-20 items-center px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-24 pt-2">
        <p className="text-[20px] font-bold text-[#1A1A1A]">{p.title}</p>
        <p className="mt-3 text-[14px] text-[#9E9E9E]">{p.dateText}</p>
        <p className="mt-1 text-[14px] text-[#9E9E9E]">{p.placeText}</p>

        <div className="mt-6 h-[260px] w-full rounded-[20px] bg-[#D9D9D9]" />
      </div>
    </div>
  );
}
