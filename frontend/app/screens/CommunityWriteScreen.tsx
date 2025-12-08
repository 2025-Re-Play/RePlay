"use client";

import { Camera } from "lucide-react";
import { useState } from "react";

type CommunityWriteScreenProps = {
  onBack: () => void; // 지금은 안 쓰이지만 타입만 유지
};

const boards = ["일반 게시판", "소품 요청"];

export default function CommunityWriteScreen({ onBack }: CommunityWriteScreenProps) {
  const [board, setBoard] = useState<string>("일반 게시판");

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* 글쓰기 내용 전체 스크롤 영역 */}
      <main className="no-scrollbar flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-6">
        {/* 게시판 선택 */}
        <section className="space-y-2">
          <p className="text-xs font-semibold text-slate-900">게시판 선택</p>
          <div className="flex gap-6 text-xs">
            {boards.map((name) => {
              const active = board === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setBoard(name)}
                  className="flex items-center gap-2"
                >
                  {/* 동그라미 라디오 */}
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      active
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={
                      active ? "text-emerald-600" : "text-slate-600"
                    }
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 제목 */}
        <section className="space-y-2">
          <Label>제목</Label>
          <Input placeholder="제목을 입력하세요" />
        </section>

        {/* 내용 */}
        <section className="space-y-2">
          <Label>내용</Label>
          <Textarea placeholder="내용을 입력하세요" rows={6} />
        </section>

        {/* 사진 (0/3) */}
        <section className="space-y-2">
          <p className="text-xs font-semibold text-slate-900">사진 (0/3)</p>
          <button className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
            <Camera className="h-5 w-5 text-slate-400" />
            <span>추가</span>
          </button>
        </section>
      </main>
    </div>
  );
}

/* ---- 공통 인풋 컴포넌트 ---- */

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-slate-900">{children}</p>;
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
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 ${props.className ?? ""}`}
    />
  );
}
