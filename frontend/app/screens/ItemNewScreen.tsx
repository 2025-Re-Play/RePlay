"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronDown } from "lucide-react";

type ItemNewScreenProps = {
  onBack: () => void;
  onHeaderHiddenChange?: (hidden: boolean) => void;
};

const CATEGORY_OPTIONS = ["가구", "소품", "의상", "조명"];
const SCHOOL_OPTIONS = [
  "연세대학교",
  "서울대학교",
  "고려대학교",
  "서강대학교",
  "이화여자대학교",
];

type PickedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export default function ItemNewScreen({
  onBack,
  onHeaderHiddenChange,
}: ItemNewScreenProps) {
  useEffect(() => {
    onHeaderHiddenChange?.(true);
    return () => onHeaderHiddenChange?.(false);
  }, [onHeaderHiddenChange]);

  const [category, setCategory] = useState<string>("가구");
  const [title, setTitle] = useState("");
  const [school, setSchool] = useState("연세대학교");
  const [tagsText, setTagsText] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dailyRentPrice, setDailyRentPrice] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [needsCheck, setNeedsCheck] = useState(false);

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);

  const [images, setImages] = useState<PickedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!description.trim()) return false;
    if (!price.trim()) return false;
    return true;
  }, [title, description, price]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setImages((prev) => {
      const remain = Math.max(0, 4 - prev.length);
      const take = files.slice(0, remain);

      const next: PickedImage[] = take.map((f) => ({
        id: `${f.name}-${f.size}-${f.lastModified}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));

      return [...prev, ...next];
    });

    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const submit = () => {
    if (!canSubmit) return;
    // TODO: API 업로드 (images.map(x => x.file))
    onBack();
  };

  const mainPreview = images[0]?.previewUrl ?? null;

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
        <button type="button" onClick={onBack} className="flex items-center">
          <ChevronLeft className="h-6 w-6 text-[#9E9E9E]" />
        </button>

        <p className="text-[16px] font-semibold text-[#1A1A1A]">물건 등록</p>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={`rounded-[12px] px-4 py-2 text-[14px] font-bold
            ${
              canSubmit
                ? "bg-[#E7F8F2] text-[#0EBC81]"
                : "bg-[#F2F2F2] text-[#D1D6DB]"
            }`}
        >
          등록
        </button>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onPickFiles}
      />

      {/* 스크롤 */}
      <main className="no-scrollbar flex-1 overflow-y-auto pb-24">
        {/* 이미지 섹션 */}
        <section className="bg-[#D9D9D9]">
          <div className="relative h-[260px] w-full overflow-hidden bg-[#D9D9D9]">
            {mainPreview ? (
              <Image
                src={mainPreview}
                alt="preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-[#D9D9D9]" />
            )}

            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === Math.min(images.length, 4) - 1 ? "bg-white" : "bg-[#B3B3B3]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="mt-4 flex items-center justify-center">

              <button
                type="button"
                onClick={openFilePicker}
                disabled={images.length >= 4}
                className={`rounded-[10px] px-4 py-2 text-[14px] font-bold
                  ${
                    images.length >= 4
                      ? "bg-white/50 text-[#9E9E9E]"
                      : "bg-white/70 text-[#1A1A1A]"
                  }`}
              >
                사진 추가
              </button>
            </div>
          </div>
        </section>

        {/* 폼 */}
        <section className="px-6 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative z-20">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryMenu((p) => !p);
                  setShowSchoolMenu(false);
                }}
                className="inline-flex items-center gap-2 rounded-[14px] bg-[#F2F2F2] px-4 py-2 text-[16px] font-bold text-[#4F4F4F]"
              >
                {category}
                <ChevronDown className="h-4 w-4 text-[#9E9E9E]" />
              </button>

              {showCategoryMenu && (
                <div className="absolute left-0 top-12 w-40 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.17)]">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setShowCategoryMenu(false);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-[14px] text-[#1A1A1A] hover:bg-slate-100"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#4F4F4F]">점검 필요</span>
              <button
                type="button"
                onClick={() => setNeedsCheck((p) => !p)}
                className={`h-7 w-12 rounded-full p-1 transition ${
                  needsCheck ? "bg-[#0EBC81]" : "bg-[#D1D6DB]"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition ${
                    needsCheck ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <input
            className="w-full rounded-[14px] border border-[#E0E0E0] px-5 py-4 text-[18px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="상품명"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="relative z-20">
            <button
              type="button"
              onClick={() => {
                setShowSchoolMenu((p) => !p);
                setShowCategoryMenu(false);
              }}
              className="flex w-full items-center justify-between rounded-[14px] border border-[#E0E0E0] px-5 py-4 text-left text-[14px] text-[#1A1A1A]"
            >
              <span className={school ? "text-[#1A1A1A]" : "text-[#D1D6DB]"}>
                {school || "학교/위치를 선택해주세요"}
              </span>
              <ChevronDown className="h-4 w-4 text-[#9E9E9E]" />
            </button>

            {showSchoolMenu && (
              <div className="absolute left-0 right-0 top-[56px] rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.17)]">
                {SCHOOL_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSchool(s);
                      setShowSchoolMenu(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-[14px] text-[#1A1A1A] hover:bg-slate-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            className="w-full rounded-[14px] border border-[#E0E0E0] px-5 py-4 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="태그 · 태그 · 태그"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <input
            className="w-full rounded-[14px] border border-[#E0E0E0] px-5 py-4 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="크기 (예: 가로 120cm × 세로 60cm)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          <input
            className="w-full rounded-[14px] border border-[#E0E0E0] px-5 py-4 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="상태 (예: 양호 / 보통 / 사용감 있음)"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />

          <textarea
            className="h-[160px] w-full rounded-[18px] border border-[#E0E0E0] px-5 py-4 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="상품 설명을 적어주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-[14px] border border-[#E0E0E0] px-5 py-4">
              <input
                className="w-full text-[16px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
                placeholder="가격"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
              />
              <span className="text-[16px] font-bold text-[#1A1A1A]">원</span>
            </div>

            <div className="flex items-center gap-2 rounded-[14px] border border-[#E0E0E0] px-5 py-4">
              <input
                className="w-full text-[16px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
                placeholder="일일 대여료"
                value={dailyRentPrice}
                onChange={(e) => setDailyRentPrice(e.target.value.replace(/[^\d]/g, ""))}
              />
              <span className="text-[16px] font-bold text-[#1A1A1A]">원</span>
            </div>
          </div>

          <div className="h-10" />
        </section>
      </main>

      {(showCategoryMenu || showSchoolMenu) && (
        <button
          type="button"
          onClick={() => {
            setShowCategoryMenu(false);
            setShowSchoolMenu(false);
          }}
          className="fixed inset-0 z-10 cursor-default"
          aria-label="close-menus"
        />
      )}
    </div>
  );
}
