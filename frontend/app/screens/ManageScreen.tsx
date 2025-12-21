"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

type ManageScreenProps = {
  onAddClick: () => void;
  onDetailModeChange?: (isDetail: boolean) => void;

  tabNonce?: number;
};

export type ManageItem = {
  id: number;

  category: string;
  rentalStatus: "대여중" | "거래완" | "거래가능";
  title: string;
  school: string;
  tags: string[];
  purchasedAt: string;
  statusText: string;
  needsCheck: boolean;
  size: string;
  description: string;
  price: string;
  dailyRentPrice: string; 
  images: string[];
};

const categoryOptions = ["가구", "소품", "의상", "조명"];
const tagOptions = [
  "빈티지",
  "고풍스러운",
  "현대",
  "전통",
  "공포",
  "판타지",
  "시대극",
  "코미디",
  "학교",
  "현대극",
  "리얼리즘",
  "전등",
  "고풍",
];
const rentalStatusOptions: ManageItem["rentalStatus"][] = ["대여중", "거래완"];

type ViewMode = "list" | "detail" | "edit";

const initialItems: ManageItem[] = [
  {
    id: 1,
    category: "가구",
    rentalStatus: "거래가능",
    title: "원목 책상",
    school: "연세대학교",
    tags: ["빈티지", "학교", "현대"],
    purchasedAt: "2025.03.12 등록",
    statusText: "양호",
    needsCheck: false,
    size: "가로 120cm × 세로 60cm",
    description:
      "동아리방에서 2년간 사용한 원목 책상입니다. 주로 소품 정리 및 서류 작업용으로 사용했어요. 구조적으로 튼튼하고, 상판에 생활 스크래치가 약간 있습니다. 일상극/학교 배경 장면에 잘 어울립니다.",
    price: "70,000원",
    dailyRentPrice: "5,000원",
    images: ["/items/item-1.png"],
  },
  {
    id: 2,
    category: "가구",
    rentalStatus: "대여중",
    title: "철제 캐비닛 (그레이)",
    school: "연세대학교",
    tags: ["현대", "학교"],
    purchasedAt: "2025.03.08 등록",
    statusText: "보통",
    needsCheck: true,
    size: "가로 90cm × 세로 45cm × 높이 180cm",
    description:
      "동아리방 소품 보관용으로 사용하던 철제 캐비닛입니다. 문 여닫힘 정상이고 내부 선반 포함입니다. 외관에 사용감은 있으나 무대 배경 소품으로 활용하기 좋습니다.",
    price: "50,000원",
    dailyRentPrice: "6,000원",
    images: ["/items/item-2.png"],
  },
  {
    id: 3,
    category: "소품",
    rentalStatus: "거래가능",
    title: "빈티지 서류 가방",
    school: "연세대학교",
    tags: ["빈티지", "현대극", "리얼리즘"],
    purchasedAt: "2025.03.15 등록",
    statusText: "양호",
    needsCheck: false,
    size: "가로 40cm × 세로 30cm",
    description:
      "현대극 공연에서 직장인 역할 소품으로 사용했던 서류 가방입니다. 가죽 느낌의 외관이라 무대에서 분위기가 잘 살아납니다. 내부 수납공간도 정상입니다.",
    price: "30,000원",
    dailyRentPrice: "4,000원",
    images: ["/items/item-3.png"],
  },
  {
    id: 4,
    category: "소품",
    rentalStatus: "거래완",
    title: "촛대 장식 소품",
    school: "연세대학교",
    tags: ["고풍스러운", "판타지", "전통"],
    purchasedAt: "2025.03.10 등록",
    statusText: "양호",
    needsCheck: false,
    size: "가로 15cm × 세로 30cm",
    description:
      "고풍스러운 분위기 연출용 촛대 장식 소품입니다. 실제 초 사용은 하지 않았고 무대 연출용으로만 사용했습니다. 중세/판타지 장면에 잘 어울립니다.",
    price: "25,000원",
    dailyRentPrice: "4,000원",
    images: ["/items/item-4.png"],
  },
  {
    id: 5,
    category: "조명",
    rentalStatus: "거래가능",
    title: "무대용 스탠드 조명",
    school: "연세대학교",
    tags: ["공포", "현대", "전등"],
    purchasedAt: "2025.03.05 등록",
    statusText: "사용감 있음",
    needsCheck: true,
    size: "높이 최대 180cm",
    description:
      "소극장 공연에서 반복 사용한 스탠드 조명입니다. 조도 조절 기능 정상 작동하며 외관에 사용 흔적이 있습니다. 공포/드라마 장면 분위기 연출에 효과적입니다.",
    price: "60,000원",
    dailyRentPrice: "8,000원",
    images: ["/items/item-5.png"],
  },
];

export default function ManageScreen({
  onAddClick,
  onDetailModeChange,
  tabNonce,
}: ManageScreenProps) {
  const [items, setItems] = useState<ManageItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<string>("전체");

  const [view, setView] = useState<ViewMode>("list");
  const [selectedItem, setSelectedItem] = useState<ManageItem | null>(null);
  const [editingItem, setEditingItem] = useState<ManageItem | null>(null);

  const [query, setQuery] = useState("");

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [draftCategory, setDraftCategory] = useState<string | null>(null);
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [draftRentalStatus, setDraftRentalStatus] =
    useState<ManageItem["rentalStatus"] | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [rentalStatusFilter, setRentalStatusFilter] =
    useState<ManageItem["rentalStatus"] | null>(null);

  const [checkExpanded, setCheckExpanded] = useState(true);

  useEffect(() => {
    if (onDetailModeChange) onDetailModeChange(view !== "list");
  }, [view, onDetailModeChange]);

  const isFilterActive =
    !!categoryFilter || tagFilter.length > 0 || !!rentalStatusFilter;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = query.trim();
      if (q.length > 0) {
        const ok =
          item.title.includes(q) ||
          item.school.includes(q) ||
          item.tags.some((t) => t.includes(q));
        if (!ok) return false;
      }

      if (categoryFilter && item.category !== categoryFilter) return false;
      if (rentalStatusFilter && item.rentalStatus !== rentalStatusFilter)
        return false;

      if (tagFilter.length > 0) {
        const hasAny = tagFilter.some((tag) => item.tags.includes(tag));
        if (!hasAny) return false;
      }

      if (activeFilter === "대여중" && item.rentalStatus !== "대여중")
        return false;
      if (activeFilter === "거래완" && item.rentalStatus !== "거래완")
        return false;

      return true;
    });
  }, [items, query, categoryFilter, rentalStatusFilter, tagFilter, activeFilter]);

  const checkItems = items.filter((i) => i.needsCheck);
  const checkCount = checkItems.length;

  const openDetail = (item: ManageItem) => {
    setSelectedItem(item);
    setView("detail");
  };

  const backToList = () => {
    setView("list");
    setSelectedItem(null);
    setEditingItem(null);
  };

  useEffect(() => {
    setView("list");
    setSelectedItem(null);
    setEditingItem(null);
    onDetailModeChange?.(false);
  }, [tabNonce]);

  const openEdit = () => {
    if (!selectedItem) return;
    setEditingItem({ ...selectedItem });
    setView("edit");
  };

  const cancelEdit = () => {
    setView("detail");
    setEditingItem(null);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? editingItem : it)),
    );
    setSelectedItem(editingItem);
    setView("detail");
  };

  const handleFilterButtonClick = () => {
    setDraftCategory(categoryFilter);
    setDraftTags(tagFilter);
    setDraftRentalStatus(rentalStatusFilter);
    setShowFilterSheet(true);
  };

  const applyFilter = () => {
    setCategoryFilter(draftCategory);
    setTagFilter(draftTags);
    setRentalStatusFilter(draftRentalStatus);
    setShowFilterSheet(false);
  };

  const toggleDraftTag = (tag: string) => {
    setDraftTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };


  if (view === "detail" && selectedItem) {
    return (
      <ManageItemDetailView item={selectedItem} onBack={backToList} onEdit={openEdit} />
    );
  }

  if (view === "edit" && editingItem) {
    return (
      <ManageItemEditView
        item={editingItem}
        onChange={setEditingItem}
        onBack={cancelEdit}
        onSave={saveEdit}
      />
    );
  }


  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="no-scrollbar flex-1 overflow-y-auto pb-4">
        {/* 검색 + 카메라 */}
        <div className="space-y-3 px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-3xl border border-[#F7F7F7] bg-white px-6 py-3 text-xs text-slate-500 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#D1D6DB]"
                placeholder="어떤 소품을 찾으시나요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button className="mr-4 flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-r from-white to-[#D9FFEE]">
              <Image src="/icons/camera.svg" alt="카메라" width={22} height={20} />
            </button>
          </div>

          {/* 필터 버튼 */}
          <div className="flex items-center gap-2 px-4">
            <button
              type="button"
              onClick={handleFilterButtonClick}
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
          </div>

          {/* 점검 필요한 물품들 */}
          <section className="mt-2 rounded-[20px] bg-[#F5F5F5] px-6 py-5">
            <button
              type="button"
              onClick={() => setCheckExpanded((p) => !p)}
              className="flex w-full items-center justify-between"
            >
              <span className="text-[14px] font-medium text-[#4F4F4F]">
                점검 필요한 물품들 ({checkCount})
              </span>
              <ChevronRight
                className={`h-4 w-4 text-[#9E9E9E] transition-transform ${
                  checkExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {checkExpanded && checkCount > 0 && (
              <div className="mt-4 space-y-3">
                {checkItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3"
                  >
                    <ThumbBox src={item.images?.[0]} className="h-12 w-12 rounded-[10px]" />
                    <div className="flex flex-col">
                      <span className="text-[16px] text-[#1A1A1A]">{item.title}</span>
                      <span className="mt-1 text-[12px] text-[#FF4545]">
                        {item.purchasedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 리스트 */}
        <div className="mt-4 space-y-3 px-3 pb-24">
          {filteredItems.map((item) => (
            <ManageItemRow key={item.id} item={item} onClick={() => openDetail(item)} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="fixed bottom-23 right-4 flex items-center justify-center"
      >
        <Image src="/icons/plus.svg" alt="물품 추가" width={72} height={72} />
      </button>

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
            <p className="text-base font-semibold text-[#1A1A1A]">필터</p>

            <div className="mt-6 space-y-6 text-sm text-[#1A1A1A]">
              {/* 대여 상태 */}
              <div>
                <p className="mb-3 text-[14px] text-[#1A1A1A]">대여 상태</p>
                <div className="flex flex-wrap gap-2">
                  {rentalStatusOptions.map((status) => {
                    const selected = draftRentalStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setDraftRentalStatus(selected ? null : status)}
                        className={`rounded-full px-4 py-2 text-sm ${
                          selected ? "bg-[#0EBC81] text-white" : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 종류 */}
              <div>
                <p className="mb-3 text-[14px] text-[#1A1A1A]">종류</p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((label) => {
                    const selected = draftCategory === label;
                    return (
                      <button
                        key={label}
                        type="button"
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
                <p className="mb-3 text-[14px] text-[#1A1A1A]">태그</p>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => {
                    const selected = draftTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
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
              type="button"
              className="mt-8 w-full rounded-full bg-[#0EBC81] py-3 text-sm font-semibold text-white"
              onClick={applyFilter}
            >
              필터 적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function ThumbBox({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#B2B2B2] ${className ?? ""}`}>
      {src ? (
        <Image src={src} alt="thumbnail" fill className="object-cover" />
      ) : null}
    </div>
  );
}


type RowProps = {
  item: ManageItem;
  onClick: () => void;
};

function ManageItemRow({ item, onClick }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 text-left"
    >
      <ThumbBox src={item.images?.[0]} className="h-12 w-12 flex-shrink-0 rounded-[10px]" />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-fit rounded-[5px] bg-[#E7F8F2] px-2 py-0.5 text-[14px] font-bold text-[#0EBC81]">
            {item.category}
          </span>
          {item.rentalStatus !== "거래가능" && (
            <span className="inline-flex w-fit rounded-[5px] bg-[#FFD9D1] px-2 py-0.5 text-[14px] font-bold text-[#FF2B00]">
              {item.rentalStatus}
            </span>
          )}
        </div>

        <p className="text-[16px] font-bold text-[#1A1A1A]">{item.title}</p>

        <p className="text-[12px] text-[#A7A7A7]">{item.tags.join(" · ")}</p>
        <p className="text-[12px] text-[#A7A7A7]">{item.purchasedAt}</p>

        <p className="mt-1 text-[16px] text-[#1A1A1A]">{item.statusText}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-[#B5BBC1]" />
    </button>
  );
}


type DetailProps = {
  item: ManageItem;
  onBack: () => void;
  onEdit: () => void;
};

function ManageItemDetailView({ item, onBack, onEdit }: DetailProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* 자체 헤더 */}
      <header className="flex h-14 items-center justify-between px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
        </button>
        <span className="text-[16px] font-semibold text-[#1A1A1A]">{item.title}</span>
        <div className="w-5" />
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-6">
        {/* 이미지 */}
        <div className="mt-2">
          <ThumbBox
            src={item.images?.[0]}
            className="h-64 w-full rounded-none bg-[#DFDFDF]"
          />
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === 3 ? "bg-white" : "bg-[#B3B3B3]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 카테고리 + 수정 */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-[5px] bg-[#E7F8F2] px-3 py-1 text-[14px] font-bold text-[#0EBC81]">
              {item.category}
            </span>
            {item.rentalStatus !== "거래가능" && (
              <span className="inline-flex rounded-[5px] bg-[#FFD9D1] px-3 py-1 text-[14px] font-bold text-[#FF2B00]">
                {item.rentalStatus}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-[8px] bg-[#F2F2F2] px-4 py-1 text-[14px] text-[#4F4F4F]"
          >
            수정
          </button>
        </div>

        <p className="mt-4 text-[16px] font-bold text-[#1A1A1A]">{item.title}</p>
        <p className="mt-2 text-[12px] text-[#A7A7A7]">
          {item.school} · {item.purchasedAt.replace(" 등록", "").replace(" 구매", "")}
        </p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">{item.tags.join(" · ")}</p>

        <div className="mt-4 space-y-2 text-[14px] text-[#1A1A1A]">
          <p>
            <span className="font-semibold">상태</span> · {item.statusText}
          </p>
          <p>
            <span className="font-semibold">크기</span> · {item.size}
          </p>
          <p>
            <span className="font-semibold">일일 대여료</span> · {item.dailyRentPrice}
          </p>
        </div>

        <p className="mt-6 text-[16px] leading-relaxed text-[#1A1A1A]">{item.description}</p>

        <p className="mt-8 text-[20px] font-semibold text-[#1A1A1A]">{item.price}</p>
      </div>
    </div>
  );
}


type EditProps = {
  item: ManageItem;
  onChange: (item: ManageItem) => void;
  onBack: () => void;
  onSave: () => void;
};

function ManageItemEditView({ item, onChange, onBack, onSave }: EditProps) {
  const setField = (field: keyof ManageItem, value: any) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-14 items-center justify-between px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
        </button>

        <span className="text-[16px] font-semibold text-[#1A1A1A]">{item.title}</span>

        <button
          type="button"
          onClick={onSave}
          className="rounded-[8px] bg-[#E7F8F2] px-3 py-1 text-[14px] font-semibold text-[#0EBC81]"
        >
          완료
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-6">
        <div className="mt-2">
          <ThumbBox src={item.images?.[0]} className="h-64 w-full bg-[#DFDFDF]" />
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === 3 ? "bg-white" : "bg-[#B3B3B3]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 종류/상태 */}
        <div className="mt-6 flex flex-wrap gap-2">
          <select
            value={item.category}
            onChange={(e) => setField("category", e.target.value)}
            className="rounded-[10px] border border-[#E0E0E0] px-4 py-2 text-[14px] text-[#4F4F4F] outline-none"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={item.rentalStatus}
            onChange={(e) => setField("rentalStatus", e.target.value as any)}
            className="rounded-[10px] border border-[#E0E0E0] px-4 py-2 text-[14px] text-[#4F4F4F] outline-none"
          >
            {["거래가능", "대여중", "거래완"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            value={item.statusText}
            onChange={(e) => setField("statusText", e.target.value)}
            className="flex-1 min-w-[120px] rounded-[10px] border border-[#E0E0E0] px-4 py-2 text-[14px] text-[#4F4F4F] outline-none"
            placeholder="상태(양호/보통...)"
          />
        </div>

        <input
          className="mt-6 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[16px] text-[#1A1A1A] outline-none"
          value={item.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="물품명"
        />

        <input
          className="mt-3 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={item.school}
          onChange={(e) => setField("school", e.target.value)}
          placeholder="학교/위치"
        />

        <input
          className="mt-3 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={item.size}
          onChange={(e) => setField("size", e.target.value)}
          placeholder="크기"
        />

        <input
          className="mt-3 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={item.tags.join(" · ")}
          onChange={(e) =>
            setField(
              "tags",
              e.target.value
                .split("·")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="태그 ( · 로 구분)"
        />

        <textarea
          className="mt-4 h-40 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={item.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="상품 설명을 적어주세요"
        />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-[12px] border border-[#E0E0E0] px-4 py-3">
            <input
              className="w-full text-[14px] text-[#1A1A1A] outline-none"
              value={item.price.replace("원", "").replaceAll(",", "")}
              onChange={(e) => setField("price", `${e.target.value}원`)}
              placeholder="판매가"
            />
            <span className="text-[14px] text-[#1A1A1A]">원</span>
          </div>

          <div className="flex items-center gap-2 rounded-[12px] border border-[#E0E0E0] px-4 py-3">
            <input
              className="w-full text-[14px] text-[#1A1A1A] outline-none"
              value={item.dailyRentPrice.replace("원", "").replaceAll(",", "")}
              onChange={(e) => setField("dailyRentPrice", `${e.target.value}원`)}
              placeholder="일일 대여료"
            />
            <span className="text-[14px] text-[#1A1A1A]">원</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[12px] border border-[#E0E0E0] px-4 py-3">
          <span className="text-[14px] text-[#4F4F4F]">점검 필요</span>
          <button
            type="button"
            onClick={() => setField("needsCheck", !item.needsCheck)}
            className={`h-7 w-12 rounded-full p-1 transition ${
              item.needsCheck ? "bg-[#0EBC81]" : "bg-[#D1D6DB]"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white transition ${
                item.needsCheck ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
