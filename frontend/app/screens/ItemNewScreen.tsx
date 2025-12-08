"use client";

import { Camera, ChevronLeft, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

const typeOptions = ["대가구", "소가구", "의상", "소품", "조명", "음향", "기타"];
const conditionOptions = ["새 제품", "거의 새것", "양호", "보통", "사용감 있음"];

const defaultTags = [
  "#빈티지",
  "#학교",
  "#고풍스러운",
  "#현대",
  "#전통",
  "#로맨틱",
  "#공포",
  "#판타지",
];

type ItemNewScreenProps = {
  onBack: () => void;
};

export default function ItemNewScreen({ onBack }: ItemNewScreenProps) {
  // 드롭다운 상태
  const [typeOpen, setTypeOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);

  // 태그
  const [tags, setTags] = useState(defaultTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 토글
  const [sellEnabled, setSellEnabled] = useState(true);
  const [rentEnabled, setRentEnabled] = useState(true);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    const tag = value.startsWith("#") ? value : `#${value}`;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
  };

  return (
    // HomeScreen의 <main> 안에 들어가는 영역
    <div className="relative flex h-full flex-col bg-slate-50">
      {/* 이 div 안만 스크롤되게 */}
      <main className="no-scrollbar flex-1 overflow-y-auto bg-slate-50 px-4 py-4 space-y-4">
        {/* 상단 뒤로가기 버튼 (헤더 대신) */}
        <button
          type="button"
          className="mb-2 inline-flex items-center text-xs text-slate-400"
          onClick={onBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          <span>뒤로</span>
        </button>

        {/* 사진 업로드 박스 */}
        <section className="space-y-2">
          <p className="text-xs font-medium text-slate-700">사진 (0/5)</p>
          <button className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
            <Camera className="h-5 w-5 text-slate-400" />
            <span>추가</span>
          </button>
        </section>

        {/* 물품명 */}
        <section className="space-y-1">
          <Label>물품명 *</Label>
          <Input placeholder="물품 이름을 입력하세요" />
        </section>

        {/* 종류 / 상태 */}
        <section className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>종류 *</Label>
            <Dropdown
              open={typeOpen}
              onOpenChange={setTypeOpen}
              placeholder="선택"
              value={type}
              options={typeOptions}
              onSelect={(v) => {
                setType(v);
                setTypeOpen(false);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label>상태 *</Label>
            <Dropdown
              open={conditionOpen}
              onOpenChange={setConditionOpen}
              placeholder="선택"
              value={condition}
              options={conditionOptions}
              onSelect={(v) => {
                setCondition(v);
                setConditionOpen(false);
              }}
            />
          </div>
        </section>

        {/* 크기 */}
        <section className="space-y-1">
          <Label>크기</Label>
          <Input placeholder="예: 가로 50cm x 세로 30cm" />
        </section>

        {/* 설명 */}
        <section className="space-y-1">
          <Label>설명</Label>
          <Textarea placeholder="물품에 대한 상세 설명을 입력하세요" />
        </section>

        {/* 태그 */}
        <section className="space-y-2">
          <Label>태그</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    active
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="직접 입력"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* 거래 옵션 */}
        <section className="mt-2 space-y-4">
          <p className="text-xs font-semibold text-slate-900">거래 옵션</p>

          {/* 판매 */}
          <div className="space-y-3">
            <ToggleRow
              label="판매"
              description="물품을 판매합니다"
              checked={sellEnabled}
              onChange={setSellEnabled}
            />
            {sellEnabled && (
              <div className="px-3">
                <Label>판매 가격</Label>
                <Input type="number" className="mt-1" defaultValue={0} />
              </div>
            )}
          </div>

          {/* 대여 */}
          <div className="space-y-3">
            <ToggleRow
              label="대여"
              description="물품을 대여합니다"
              checked={rentEnabled}
              onChange={setRentEnabled}
            />
            {rentEnabled && (
              <div className="px-3">
                <Label>일일 대여료</Label>
                <Input type="number" className="mt-1" defaultValue={0} />
              </div>
            )}
          </div>
        </section>

        <button className="mb-6 mt-2 w-full rounded-full bg-emerald-500 py-2.5 text-sm font-semibold text-white">
          등록하기
        </button>
      </main>
    </div>
  );
}

/* ------- 아래 공통 컴포넌트들은 그대로 사용 ------- */

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-slate-700">{children}</p>;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${props.className ?? ""}`}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={4}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${props.className ?? ""}`}
    />
  );
}

type DropdownProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
  value: string | null;
  options: string[];
  onSelect: (value: string) => void;
};

function Dropdown({
  open,
  onOpenChange,
  placeholder,
  value,
  options,
  onSelect,
}: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700"
      >
        <span className={value ? "" : "text-slate-400"}>
          {value ?? placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-sm shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`flex w-full items-center px-3 py-2 text-left ${
                value === opt
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
