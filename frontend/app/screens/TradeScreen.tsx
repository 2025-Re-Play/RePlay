// app/screens/TradeScreen.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, Plus } from "lucide-react";

import ItemDetailScreen, {
  TradeItem,
} from "@/app/screens/ItemDetailScreen";

type TradeScreenProps = {
  onAddClick: () => void;
  onDetailModeChange?: (isDetail: boolean) => void; // ✅ 헤더 숨김 컨트롤
};

const mockItems: TradeItem[] = [
  {
    id: 1,
    category: "가구",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    price: "331,331원",
  },
  {
    id: 2,
    category: "가구",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    price: "331,331원",
  },
  {
    id: 3,
    category: "가구",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    price: "331,331원",
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
];
const locationOptions = ["100m 이내", "1km 이내", "1-5km", "5-10km", "10km 이상"];

export default function TradeScreen({
  onAddClick,
  onDetailModeChange,
}: TradeScreenProps) {
  const [query, setQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState<TradeItem | null>(null);

  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string | null>(null);

  const [draftCategory, setDraftCategory] = useState<string | null>(null);
  const [draftTags, setDraftTags] = useState<string[]>([]);

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const hasResult = query.trim().length > 0;

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
    setDraftTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLocationClick = () => {
    setShowLocationMenu((prev) => !prev);
    setShowFilterSheet(false);
  };

  const handleLocationSelect = (option: string) => {
    setLocation(option);
    setShowLocationMenu(false);
  };

  // ✅ 상세 페이지 여부를 HomeScreen에 알려줌
  useEffect(() => {
    if (onDetailModeChange) {
      onDetailModeChange(selectedItem !== null);
    }
  }, [selectedItem, onDetailModeChange]);

  // ✅ 상세 페이지 모드
  if (selectedItem) {
    return (
      <ItemDetailScreen
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
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
              <Image
                src="/icons/camera.svg"
                alt="카메라"
                width={22}
                height={20}
              />
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
                src={
                  isFilterActive
                    ? "/icons/filter-active.svg"
                    : "/icons/filter-inactive.svg"
                }
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
                  src={
                    isLocationActive
                      ? "/icons/location-active.svg"
                      : "/icons/location-inactive.svg"
                  }
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
                      <button
                        key={opt}
                        className="block w-full text-left"
                        onClick={() => handleLocationSelect(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 검색 결과 영역 */}
        {hasResult ? (
          <div className="mt-4 space-y-2 pb-20">
            {mockItems.map((item) => (
              <TradeListItem
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-[16px] font-bold text-[#D1D6DB]">
              검색 결과가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* 필터 바텀시트 */}
      {showFilterSheet && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-black/60"
          onClick={() => setShowFilterSheet(false)}
        >
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
                        onClick={() =>
                          setDraftCategory(selected ? null : label)
                        }
                        className={`rounded-full px-4 py-2 text-sm ${
                          selected
                            ? "bg-[#0EBC81] text-white"
                            : "bg-slate-50 text-slate-700"
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
                          selected
                            ? "bg-[#0EBC81] text-white"
                            : "bg-slate-50 text-slate-700"
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

type TradeListItemProps = {
  item: TradeItem;
  onClick: () => void;
};

function TradeListItem({ item, onClick }: TradeListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 text-left"
    >
      <div className="mt-[-36px] h-[96px] w-[96px] flex-shrink-0 rounded-[10px] bg-[#B2B2B2]" />

      <div className="flex flex-1 flex-col px-2">
        <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
          {item.category}
        </span>

        <p className="mt-1 text-[16px] font-bold text-[#1A1A1A]">
          {item.title}
        </p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">{item.school}</p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">
          {item.tags.join(" · ")}
        </p>

        <p className="mt-2 text-[16px] font-bold text-[#1A1A1A]">
          {item.price}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 text-[#B5BBC1]" />
    </button>
  );
}
