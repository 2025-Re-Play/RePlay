// app/screens/ManageScreen.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

type ManageScreenProps = {
  onAddClick: () => void;
  // HomeScreen 에서 header 숨길 때 쓰는 선택사항 콜백
  onDetailModeChange?: (isDetail: boolean) => void;
};

export type ManageItem = {
  id: number;
  category: string;          // 가구
  rentalStatus: "대여중" | "거래완" | "거래가능";
  title: string;             // 상품명
  school: string;            // 연세대학교
  tags: string[];            // 태그들
  purchasedAt: string;       // 2026.03.31 구매
  statusText: string;        // 상태.. 어쩌구..
  price: string;             // "331,331원"
  needsCheck: boolean;       // 점검 필요한 물품 여부
};

const initialItems: ManageItem[] = [
  {
    id: 1,
    category: "가구",
    rentalStatus: "대여중",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    purchasedAt: "2026.03.31 구매",
    statusText: "상태.. 어쩌구..",
    price: "331,331원",
    needsCheck: true,
  },
  {
    id: 2,
    category: "가구",
    rentalStatus: "대여중",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    purchasedAt: "2026.03.31 구매",
    statusText: "상태.. 어쩌구..",
    price: "331,331원",
    needsCheck: true,
  },
  {
    id: 3,
    category: "가구",
    rentalStatus: "대여중",
    title: "상품명",
    school: "연세대학교",
    tags: ["태그", "태그", "태그"],
    purchasedAt: "2026.03.31 구매",
    statusText: "상태.. 어쩌구..",
    price: "331,331원",
    needsCheck: false,
  },
];

const categoryOptions = ["가구", "소품", "의상"];
const tagOptions = ["빈티지", "고풍스러운", "현대", "전통", "공포", "판타지", "시대극", "코미디"];
const rentalStatusOptions: ManageItem["rentalStatus"][] = ["대여중", "거래완"];

type ViewMode = "list" | "detail" | "edit";

export default function ManageScreen({
  onAddClick,
  onDetailModeChange,
}: ManageScreenProps) {
  const [items, setItems] = useState<ManageItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<string>("전체");

  const [view, setView] = useState<ViewMode>("list");
  const [selectedItem, setSelectedItem] = useState<ManageItem | null>(null);
  const [editingItem, setEditingItem] = useState<ManageItem | null>(null);

  const [query, setQuery] = useState("");

  // 필터 바텀시트 상태
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

  // 뷰가 리스트가 아닐 때 AppHeader 숨기기
  useEffect(() => {
    if (onDetailModeChange) {
      onDetailModeChange(view !== "list");
    }
  }, [view, onDetailModeChange]);

  // 필터 chip 활성 여부
  const isFilterActive =
    !!categoryFilter || tagFilter.length > 0 || !!rentalStatusFilter;

  // 실제 리스트에 적용되는 필터
  const filteredItems = items.filter((item) => {
    if (query.trim().length > 0) {
      const q = query.trim();
      if (
        !(
          item.title.includes(q) ||
          item.tags.some((t) => t.includes(q)) ||
          item.school.includes(q)
        )
      ) {
        return false;
      }
    }
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (rentalStatusFilter && item.rentalStatus !== rentalStatusFilter)
      return false;
    if (tagFilter.length > 0) {
      const hasAny = tagFilter.some((tag) => item.tags.includes(tag));
      if (!hasAny) return false;
    }

    if (activeFilter === "대여중" && item.rentalStatus !== "대여중") {
      return false;
    }
    if (activeFilter === "거래완" && item.rentalStatus !== "거래완") {
      return false;
    }
    // 나머지 필터는 데모라 그냥 통과
    return true;
  });

  const checkItems = items.filter((i) => i.needsCheck);
  const checkCount = checkItems.length;

  // 상세 열기
  const openDetail = (item: ManageItem) => {
    setSelectedItem(item);
    setView("detail");
  };

  // 상세에서 뒤로
  const backToList = () => {
    setView("list");
    setSelectedItem(null);
    setEditingItem(null);
  };

  // 수정 열기
  const openEdit = () => {
    if (!selectedItem) return;
    setEditingItem({ ...selectedItem });
    setView("edit");
  };

  // 수정 취소 → 다시 상세
  const cancelEdit = () => {
    setView("detail");
    setEditingItem(null);
  };

  // 수정 완료
  const saveEdit = () => {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? editingItem : it)),
    );
    setSelectedItem(editingItem);
    setView("detail");
  };

  // 필터 바텀시트 열기
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

  // ---------- 뷰 전환 ----------

  if (view === "detail" && selectedItem) {
    return (
      <ManageItemDetailView
        item={selectedItem}
        onBack={backToList}
        onEdit={openEdit}
      />
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

  // ---------- 리스트 화면 ----------

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="no-scrollbar flex-1 overflow-y-auto pb-4">
        {/* 검색 + 카메라 : padding-x 24px */}
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
              <Image
                src="/icons/camera.svg"
                alt="카메라"
                width={22}
                height={20}
              />
            </button>
          </div>

          {/* 필터 버튼 한 줄 - padding-x 24px */}
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

          {/* 점검 필요한 물품들 카드 */}
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
                    <div className="h-12 w-12 rounded-[10px] bg-[#B2B2B2]" />
                    <div className="flex flex-col">
                      <span className="text-[16px] text-[#1A1A1A]">
                        {item.title}
                      </span>
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

        {/* 리스트 : padding-x 12px */}
        <div className="mt-4 space-y-3 px-3 pb-24">
          {filteredItems.map((item) => (
            <ManageItemRow key={item.id} item={item} onClick={() => openDetail(item)} />
          ))}
        </div>
      </div>

      {/* 플로팅 + 버튼 (이미지로) */}
      <button
        type="button"
        onClick={onAddClick}
        className="fixed bottom-20 right-6 h-12 w-12"
      >
        <Image
          src="/icons/fab-plus.svg" // 네가 준비할 이미지 경로
          alt="물품 추가"
          width={48}
          height={48}
        />
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
                        onClick={() =>
                          setDraftRentalStatus(selected ? null : status)
                        }
                        className={`rounded-full px-4 py-2 text-sm ${
                          selected
                            ? "bg-[#0EBC81] text-white"
                            : "bg-slate-50 text-slate-700"
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

/* ---------------- 리스트 아이템 ---------------- */

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
      {/* 썸네일 */}
      <div className="h-12 w-12 flex-shrink-0 rounded-[10px] bg-[#B2B2B2]" />

      {/* 정보 */}
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

        <p className="text-[12px] text-[#A7A7A7]">
          {item.tags.join(" · ")}
        </p>
        <p className="text-[12px] text-[#A7A7A7]">{item.purchasedAt}</p>

        <p className="mt-1 text-[16px] text-[#1A1A1A]">{item.statusText}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-[#B5BBC1]" />
    </button>
  );
}

/* ---------------- 상세 페이지 (사진4) ---------------- */

type DetailProps = {
  item: ManageItem;
  onBack: () => void;
  onEdit: () => void;
};

function ManageItemDetailView({ item, onBack, onEdit }: DetailProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* 자체 헤더 (AppHeader 숨겨져 있음) */}
      <header className="flex h-14 items-center justify-between px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
        </button>
        <span className="text-[16px] font-semibold text-[#1A1A1A]">
          물건명
        </span>
        <div className="w-5" /> {/* 가운데 정렬용 더미 */}
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4">
        {/* 이미지 영역 */}
        <div className="mt-2 h-64 w-full rounded-none bg-[#DFDFDF]" />
        {/* 인디케이터 점 */}
        <div className="mt-4 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-white" />
        </div>

        {/* 카테고리 + 수정 버튼 */}
        <div className="mt-6 flex items-center justify-between">
          <span className="inline-flex rounded-[5px] bg-[#E7F8F2] px-3 py-1 text-[14px] font-bold text-[#0EBC81]">
            {item.category}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-[8px] bg-[#F2F2F2] px-4 py-1 text-[14px] text-[#4F4F4F]"
          >
            수정
          </button>
        </div>

        <p className="mt-4 text-[16px] font-bold text-[#1A1A1A]">
          {item.title}
        </p>
        <p className="mt-2 text-[12px] text-[#A7A7A7]">
          {item.school} · 26.03.31
        </p>
        <p className="mt-1 text-[12px] text-[#A7A7A7]">
          {item.tags.join(" · ")}
        </p>

        <p className="mt-6 text-[16px] leading-relaxed text-[#1A1A1A]">
          상품 설명 글 상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글상품 설명 글
          상품 설명 글상품 설명 글상품 설명 글상품 설명 글
        </p>

        <p className="mt-8 text-[20px] font-semibold text-[#1A1A1A]">
          {item.price}
        </p>

        {/* 아래 버튼 2개 : border-radius 10px, gap 8px */}
        <div className="mt-6 mb-8 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-[10px] bg-[#1976FF] py-3 text-center text-[14px] font-semibold text-white"
          >
            대여로 이동
          </button>
          <button
            type="button"
            className="flex-1 rounded-[10px] bg-[#0EBC81] py-3 text-center text-[14px] font-semibold text-white"
          >
            거래로 이동
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 수정 페이지 (사진5) ---------------- */

type EditProps = {
  item: ManageItem;
  onChange: (item: ManageItem) => void;
  onBack: () => void;
  onSave: () => void;
};

function ManageItemEditView({
  item,
  onChange,
  onBack,
  onSave,
}: EditProps) {
  const handleFieldChange = (field: keyof ManageItem, value: string) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
        </button>
        <span className="text-[16px] font-semibold text-[#1A1A1A]">
          물건명
        </span>
        <button
          type="button"
          onClick={onSave}
          className="rounded-[8px] bg-[#E7F8F2] px-3 py-1 text-[14px] font-semibold text-[#0EBC81]"
        >
          완료
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4">
        {/* 이미지 영역 */}
        <div className="mt-2 h-64 w-full bg-[#DFDFDF]" />
        <div className="mt-4 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-[#B3B3B3]" />
          <span className="h-2 w-2 rounded-full bg-white" />
        </div>

        {/* 카테고리 (드롭다운 모양만) */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-[10px] border border-[#E0E0E0] px-4 py-2 text-[14px] text-[#4F4F4F]"
          >
            가구
            <ChevronRight className="h-4 w-4 rotate-90 text-[#B5BBC1]" />
          </button>
        </div>

        {/* 제목 */}
        <input
          className="mt-6 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[16px] text-[#1A1A1A] outline-none"
          value={item.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
        />

        {/* 학교 + 날짜 */}
        <input
          className="mt-3 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={`${item.school} · 26.03.31`}
          onChange={(e) => {
            // 데모라 school 부분만 대충 업데이트
            handleFieldChange("school", e.target.value);
          }}
        />

        {/* 태그 */}
        <input
          className="mt-3 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          value={item.tags.join(" · ")}
          onChange={(e) =>
            onChange({
              ...item,
              tags: e.target.value.split("·").map((s) => s.trim()),
            })
          }
        />

        {/* 설명 */}
        <textarea
          className="mt-4 h-40 w-full rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none"
          placeholder="상품 설명을 적어주세요"
        />

        {/* 가격 */}
        <div className="mt-6 flex items-center gap-4">
          <input
            className="flex-1 rounded-[12px] border border-[#E0E0E0] px-4 py-3 text-[16px] text-[#1A1A1A] outline-none"
            value={item.price.replace("원", "")}
            onChange={(e) =>
              handleFieldChange("price", `${e.target.value}원`)
            }
          />
          <span className="text-[16px] text-[#1A1A1A]">원</span>
        </div>
      </div>
    </div>
  );
}
