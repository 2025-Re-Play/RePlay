// app/screens/TradeScreen.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import ItemDetailScreen, { TradeItem } from "@/app/screens/ItemDetailScreen";

type TradeScreenProps = {
  onAddClick: () => void;
  onDetailModeChange?: (isDetail: boolean) => void;
};

type TradeItemEx = TradeItem & {
  location?: string; // 거래 1 같은 "연세대학교" "혜화동" 등
  createdAt?: string; // "2025.03.12"
  description?: string;
  image?: string; // "/trade/table-2p.jpg" 이런 식(너가 저장)
};

const mockItems: TradeItemEx[] = [
  {
    id: 1,
    category: "가구",
    title: "원목 소형 식탁 (2인용)",
    school: "연세대학교",
    tags: ["빈티지", "복고풍", "현대극", "일상극"],
    price: "30,000원",
    location: "연세대학교",
    createdAt: "2025.03.12",
    description:
      "교내 연극 동아리 정기공연에서 3주간 사용한 소형 원목 식탁입니다.\n무대 위에서는 카페 장면과 가정집 식탁 장면에 활용했어요.\n파손은 없고, 상판에 생활 스크래치가 약간 있습니다.\n일상극이나 대학생 설정, 소극장 무대에 잘 어울립니다.",
    image: "/trade/table-2p.png",
  },
  {
    id: 2,
    category: "의상",
    title: "교복 세트 (남자, 하복)",
    school: "연세대학교",
    tags: ["학교물", "현대극", "리얼리즘"],
    price: "20,000원",
    location: "혜화동",
    createdAt: "2025.03.08",
    description:
      "현대극 공연에서 주인공이 착용했던 남학생 교복입니다.\n상의·하의 모두 포함이며 촬영 포함 총 2회 사용했습니다.\n눈에 띄는 오염은 없고 전체적으로 깔끔한 상태입니다.\n학교 배경 연극이나 단편 영화 촬영용으로 추천합니다.",
    image: "/trade/uniform-set.png",
  },
  {
    id: 3,
    category: "소품",
    title: "빈티지 전화기 (다이얼식)",
    school: "연세대학교",
    tags: ["복고풍", "빈티지", "시대극"],
    price: "15,000원",
    location: "연희동",
    createdAt: "2025.03.15",
    description:
      "80년대 배경 연극에서 사용한 다이얼식 전화기입니다.\n실제 통화 기능은 없고 무대 소품용입니다.\n외관 상태가 좋아 관객석에서도 빈티지 무드가 잘 살아납니다.\n시대극이나 회상 장면 연출에 특히 잘 어울립니다.",
    image: "/trade/dial-phone.png",
  },
  {
    id: 4,
    category: "가구",
    title: "금속 프레임 의자 (블랙)",
    school: "연세대학교",
    tags: ["미니멀", "현대극", "세련된"],
    price: "10,000원",
    location: "홍제동",
    createdAt: "2025.03.05",
    description:
      "소극장 공연에서 1인 독백 장면에 사용한 의자입니다.\n사용 기간은 짧고 흔들림 없이 상태 양호합니다.\n디자인이 단순해서 연극뿐 아니라 단편 영화, 인터뷰 콘셉트 촬영에도 무난해요.",
    image: "/trade/metal-chair-black.png",
  },
  {
    id: 5,
    category: "의상",
    title: "롱 트렌치코트 (베이지)",
    school: "연세대학교",
    tags: ["세련된", "현대극", "멜로"],
    price: "25,000원",
    location: "연세대학교",
    createdAt: "2025.03.10",
    description:
      "현대 멜로드라마 연극에서 주연 배우가 착용했던 트렌치코트입니다.\n리허설 포함 총 4회 착용했고, 눈에 띄는 하자는 없습니다.\n인물 분위기를 살리기 좋아 데이트 장면이나 이별 장면 연출에 추천합니다.",
    image: "/trade/trench-beige.png",
  },
];

const categoryOptions = ["가구", "소품", "의상"];
const tagOptions = [
  "빈티지",
  "고풍스러운",
  "현대",
  "전통",
  "공포",
  "판타지",
  "시대극",
  "코미디",
  "복고풍",
  "일상극",
  "미니멀",
  "리얼리즘",
  "멜로",
  "세련된",
  "학교물",
];
const locationOptions = ["100m 이내", "1km 이내", "1-5km", "5-10km", "10km 이상"];

export default function TradeScreen({ onAddClick, onDetailModeChange }: TradeScreenProps) {
  const [query, setQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState<TradeItemEx | null>(null);

  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);

  const [draftCategory, setDraftCategory] = useState<string | null>(null);
  const [draftTags, setDraftTags] = useState<string[]>([]);

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const isFilterActive = !!category || tags.length > 0;
  const isLocationActive = !!location;

  const handleFilterClick = () => {
    setDraftCategory(category);
    setDraftTags(tags);
    setShowFilterSheet(true);
    setShowLocationMenu(false);
  };

  const handleFilterApply = () => {
    setCategory(draftCategory);
    setTags(draftTags);
    setShowFilterSheet(false);
  };

  const toggleDraftTag = (tag: string) => {
    setDraftTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleLocationClick = () => {
    setShowLocationMenu((prev) => !prev);
    setShowFilterSheet(false);
  };

  const handleLocationSelect = (option: string) => {
    setLocation(option);
    setShowLocationMenu(false);
  };

  useEffect(() => {
    if (onDetailModeChange) onDetailModeChange(selectedItem !== null);
  }, [selectedItem, onDetailModeChange]);

  const filteredItems = useMemo(() => {
    const q = query.trim();

    return mockItems
      .filter((it) => (category ? it.category === category : true))
      .filter((it) => (tags.length ? tags.every((t) => it.tags.includes(t)) : true))
      .filter((it) => {
        if (!q) return true;
        return (
          it.title.includes(q) ||
          it.school.includes(q) ||
          it.tags.join(" ").includes(q) ||
          (it.location ?? "").includes(q)
        );
      });
  }, [query, category, tags]);

  // 상세
  if (selectedItem) {
    return <ItemDetailScreen item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 상단 검색/필터 영역 */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <div className="space-y-3">
          {/* 검색 + 카메라 */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-3xl border border-[#F7F7F7] bg-white px-6 py-3 text-xs text-slate-500 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-300"
                placeholder="어떤 소품을 찾으시나요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button className="mr-4 flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-white to-[#D9FFEE]">
              <Image src="/icons/camera.svg" alt="카메라" width={22} height={20} />
            </button>
          </div>

          {/* 필터 / 위치 칩 */}
          <div className="flex items-center gap-2 px-4">
            {/* 필터 */}
            <button
              type="button"
              onClick={handleFilterClick}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition
                ${
                  isFilterActive
                    ? "border border-[#0EBC81] bg-[#E7FFF6] text-[#0EBC81]"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
            >
              <Image
                src={isFilterActive ? "/icons/filter-active.svg" : "/icons/filter-inactive.svg"}
                alt="필터"
                width={16}
                height={16}
              />
              <span>필터</span>
            </button>

            {/* 위치 */}
            <div className="relative">
              <button
                type="button"
                onClick={handleLocationClick}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition
                  ${
                    isLocationActive
                      ? "border border-[#0EBC81] bg-[#E7FFF6] text-[#0EBC81]"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
              >
                <Image
                  src={isLocationActive ? "/icons/location-active.svg" : "/icons/location-inactive.svg"}
                  alt="위치"
                  width={16}
                  height={16}
                />
                <span>{location ?? "위치"}</span>
              </button>

              {showLocationMenu && (
                <div className="absolute left-0 top-11 z-20 w-36 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.17)]">
                  <div className="space-y-2">
                    {locationOptions.map((opt) => (
                      <button key={opt} className="block w-full text-left" onClick={() => handleLocationSelect(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 리스트 */}
        <div className="mt-4 space-y-2 pb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <TradeListItem key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))
          ) : (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
              <p className="text-[16px] font-bold text-[#D1D6DB]">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 필터 바텀시트 */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={() => setShowFilterSheet(false)}>
          <div
            className="w-full rounded-t-3xl bg-white px-6 pb-8 pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-slate-900">필터</p>

            <div className="mt-6 space-y-6 text-sm text-slate-800">
              {/* 종류 */}
              <div>
                <p className="mb-3 font-medium">종류</p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((label) => {
                    const selected = draftCategory === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setDraftCategory(selected ? null : label)}
                        className={`rounded-full px-4 py-2 text-sm ${
                          selected ? "bg-[#0EBC81] text-white" : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 태그 */}
              <div>
                <p className="mb-3 font-medium">태그</p>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => {
                    const selected = draftTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleDraftTag(tag)}
                        className={`rounded-full px-4 py-2 text-sm ${
                          selected ? "bg-[#0EBC81] text-white" : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              className="mt-8 w-full rounded-full bg-[#0EBC81] py-3 text-sm font-semibold text-white"
              onClick={handleFilterApply}
            >
              필터 적용하기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* ----------------- 리스트 아이템 ----------------- */

function TradeListItem({ item, onClick }: { item: TradeItemEx; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 text-left"
    >
      {/* ✅ 회색 사각형 + 이미지 */}
      <div className="relative mt-[-36px] h-[96px] w-[96px] flex-shrink-0 overflow-hidden rounded-[10px] bg-[#B2B2B2]">
        {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : null}
      </div>

      <div className="flex flex-1 flex-col px-2">
        <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
          {item.category}
        </span>

        <p className="mt-1 text-[16px] font-bold text-[#1A1A1A]">{item.title}</p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">{item.school}</p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">{item.tags.join(" · ")}</p>

        <p className="mt-2 text-[16px] font-bold text-[#1A1A1A]">{item.price}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-[#B5BBC1]" />
    </button>
  );
}
