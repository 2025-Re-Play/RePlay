"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

type CommunityScreenProps = {
  onCalendarClick: () => void;
  onHeaderHiddenChange?: (hidden: boolean) => void;
};

type BoardKey = "일반 게시판" | "소품 요청 게시판";

type Post = {
  id: number;
  board: BoardKey;
  title: string;
  preview: string;
  content: string;
  createdAgo: string; // "11분 전"
  likeCount: number;
  commentCount: number;
  hasImage: boolean;
};

type Comment = {
  id: number;
  author: string;
  date: string; // "26.03.31"
  text: string;
};

type ViewMode = "list" | "detail" | "write";

const BOARDS: BoardKey[] = ["일반 게시판", "소품 요청 게시판"];

export default function CommunityScreen({
  onCalendarClick,
  onHeaderHiddenChange,
}: CommunityScreenProps) {
  const [activeBoard, setActiveBoard] = useState<BoardKey>("일반 게시판");
  const [query, setQuery] = useState("");

  const [mode, setMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ mock 게시글(사진2 느낌)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      board: "일반 게시판",
      title: "글 제목",
      preview: "글 미리보기 한 줄",
      content:
        "글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용",
      createdAgo: "11분 전",
      likeCount: 31,
      commentCount: 3,
      hasImage: true,
    },
    {
      id: 2,
      board: "일반 게시판",
      title: "글 제목",
      preview: "글 미리보기 한 줄",
      content:
        "글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용",
      createdAgo: "11분 전",
      likeCount: 31,
      commentCount: 3,
      hasImage: false,
    },
    {
      id: 3,
      board: "일반 게시판",
      title: "글 제목",
      preview: "글 미리보기 한 줄",
      content:
        "글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용글 내용",
      createdAgo: "11분 전",
      likeCount: 31,
      commentCount: 3,
      hasImage: true,
    },
  ]);

  // ✅ 상세/글등록일 때 헤더 숨기기
  useEffect(() => {
    const hidden = mode !== "list";
    onHeaderHiddenChange?.(hidden);
    return () => onHeaderHiddenChange?.(false);
  }, [mode, onHeaderHiddenChange]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return posts.filter((p) => {
      if (p.board !== activeBoard) return false;
      if (!q) return true;
      return (
        p.title.includes(q) ||
        p.preview.includes(q) ||
        p.content.includes(q)
      );
    });
  }, [posts, activeBoard, query]);

  const selectedPost = useMemo(() => {
    if (selectedId == null) return null;
    return posts.find((p) => p.id === selectedId) ?? null;
  }, [posts, selectedId]);

  const openDetail = (id: number) => {
    setSelectedId(id);
    setMode("detail");
  };

  const openWrite = () => {
    setMode("write");
  };

  const goBackToList = () => {
    setMode("list");
    setSelectedId(null);
  };

  const goBackToDetail = () => {
    setMode("detail");
  };

  // ---------- 라우팅(내부 상태) ----------
  if (mode === "detail" && selectedPost) {
    return (
      <CommunityDetail
        post={selectedPost}
        onBack={goBackToList}
        onLike={() => {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === selectedPost.id
                ? { ...p, likeCount: p.likeCount + 1 }
                : p
            )
          );
        }}
        onAddComment={() => {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === selectedPost.id
                ? { ...p, commentCount: p.commentCount + 1 }
                : p
            )
          );
        }}
      />
    );
  }

  if (mode === "write") {
    return (
      <CommunityWrite
        onBack={goBackToList}
        onSubmit={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
          setMode("list");
        }}
      />
    );
  }

  // ---------- 리스트 화면(사진2) ----------
  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pt-4 pb-24">
        {/* 검색 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex flex-1 items-center gap-2 rounded-3xl border border-[#F7F7F7] bg-white px-6 py-3 text-xs text-slate-500 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <Image src="/icons/search.svg" alt="검색" width={24} height={24} />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-300"
                placeholder="어떤 소품을 찾으시나요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
        </div>

        {/* 대학 공연 일정 확인 카드 */}
        <button
          type="button"
          onClick={onCalendarClick}
          className="mb-4 flex w-full items-center justify-between rounded-[24px] bg-[#DFF8EF] px-5 py-5"
        >
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center px-2">
              <Image src="/icons/calendar.svg" alt="캘린더" width={24} height={24} />
            </div>
            <div className="text-left">
              <p className="text-[16px] font-bold text-[#4F4F4F]">
                대학 공연 일정 확인
              </p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-[#0EBC81]" />
        </button>

        {/* 게시판 탭 */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          {BOARDS.map((b) => {
            const active = activeBoard === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setActiveBoard(b)}
                className={`h-[44px] rounded-[12px] text-[14px] font-bold ${
                  active
                    ? "bg-white text-[#1A1A1A] shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                    : "bg-white/60 text-[#D1D6DB]"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* 리스트 */}
        <div className="space-y-5">
          {filtered.map((p, idx) => (
            <PostRow key={p.id} post={p} onClick={() => openDetail(p.id)} big={idx === 0} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={openWrite}
        className="fixed bottom-20 right-2 flex items-center justify-center"
      >
        <Image src="/icons/pencil.svg" alt="글쓰기" width={96} height={96} />
      </button>
    </div>
  );
}

/* ----------------- 리스트 아이템 ----------------- */

function PostRow({
  post,
  onClick,
  big,
}: {
  post: Post;
  onClick: () => void;
  big?: boolean;
}) {
  if (big) {
    // ✅ 사진2 첫 번째 카드형(썸네일 있는 버전)
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="flex gap-4">
          <div className="h-[72px] w-[72px] rounded-[12px] bg-[#D1D6DB]" />
          <div className="flex-1">
            <p className="text-[16px] font-bold text-[#1A1A1A]">{post.title}</p>
            <p className="mt-1 text-[14px] text-[#9E9E9E]">{post.preview}</p>

            <div className="mt-2 flex items-center gap-2 text-[14px] text-[#9E9E9E]">
              <div className="flex items-center gap-1">
                <Image src="/icons/like.svg" alt="좋아요" width={18} height={18} />
                <span>{post.likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/icons/comment.svg" alt="댓글" width={18} height={18} />
                <span>{post.commentCount}</span>
              </div>
              <span className="px-1">|</span>
              <span>{post.createdAgo}</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  // ✅ 사진2 텍스트형 줄
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <p className="text-[16px] font-bold text-[#1A1A1A]">{post.title}</p>
      <p className="mt-1 text-[14px] text-[#9E9E9E]">{post.preview}</p>

      <div className="mt-2 flex items-center gap-2 text-[14px] text-[#9E9E9E]">
        <div className="flex items-center gap-1">
          <Image src="/icons/like.svg" alt="좋아요" width={18} height={18} />
          <span>{post.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image src="/icons/comment.svg" alt="댓글" width={18} height={18} />
          <span>{post.commentCount}</span>
        </div>
        <span className="px-1">|</span>
        <span>{post.createdAgo}</span>
      </div>
    </button>
  );
}

/* ----------------- 상세(사진3) ----------------- */

function CommunityDetail({
  post,
  onBack,
  onLike,
  onAddComment,
}: {
  post: Post;
  onBack: () => void;
  onLike: () => void;
  onAddComment: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: "햄릿", date: "26.03.31", text: "댓글 내용" },
    { id: 2, author: "햄릿", date: "26.03.31", text: "댓글 내용" },
    { id: 3, author: "햄릿", date: "26.03.31", text: "댓글 내용" },
  ]);
  const [commentText, setCommentText] = useState("");

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 상단(앱헤더 대신 자체 상단바) */}
      <div className="flex h-20 items-center justify-between px-6 bg-white shadow-sm">
        <button type="button" onClick={onBack} className="flex items-center">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="w-6" />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pt-6 pb-28">
        <div className="flex items-start justify-between">
          <p className="text-[24px] font-bold text-[#1A1A1A]">{post.title}</p>
          <p className="text-[14px] text-[#9E9E9E]">{post.createdAgo}</p>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-[16px] leading-7 text-[#1A1A1A]">
          {post.content}
        </p>

        {/* 이미지 */}
        <div className="mt-6 h-[260px] w-full rounded-[16px] bg-[#D1D6DB]" />

        {/* 좋아요/댓글 카운트 */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F2F2F2] py-4">
          <button
            type="button"
            onClick={onLike}
            className="flex items-center gap-2 text-[14px] text-[#9E9E9E]"
          >
            <Image src="/icons/like-gray.svg" alt="공감" width={20} height={20} />
            <span>공감 {post.likeCount}</span>
          </button>

          <div className="flex items-center gap-2 text-[14px] text-[#9E9E9E]">
            <Image src="/icons/comment-gray.svg" alt="댓글" width={20} height={20} />
            <span>댓글 {post.commentCount}</span>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-[#D1D6DB]" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold text-[#1A1A1A]">{c.author}</p>
                  <p className="text-[14px] text-[#D1D6DB]">{c.date}</p>
                </div>
                <p className="mt-2 text-[16px] text-[#1A1A1A]">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="fixed bottom-20 left-0 right-0 bg-white px-6 py-3 border-t border-[#F2F2F2]">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-[12px] border border-[#F2F2F2] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              const t = commentText.trim();
              if (!t) return;
              setComments((prev) => [
                { id: Date.now(), author: "햄릿", date: "26.03.31", text: t },
                ...prev,
              ]);
              setCommentText("");
              onAddComment();
            }}
            className="rounded-[12px] bg-[#0EBC81] px-4 py-3 text-[14px] font-bold text-white"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- 글 등록(사진4) ----------------- */

function CommunityWrite({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (post: Post) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit = title.trim().length > 0;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-20 items-center justify-between px-6 bg-white shadow-sm">
        <button type="button" onClick={onBack} className="flex items-center">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            const newPost: Post = {
              id: Date.now(),
              board: "일반 게시판",
              title: title.trim(),
              preview: content.trim().slice(0, 20) || "글 미리보기 한 줄",
              content: content.trim() || "내용 없음",
              createdAgo: "방금 전",
              likeCount: 0,
              commentCount: 0,
              hasImage: true,
            };
            onSubmit(newPost);
          }}
          className={`rounded-[10px] px-4 py-2 text-[14px] font-bold ${
            canSubmit ? "bg-[#E7F8F2] text-[#0EBC81]" : "bg-[#F2F2F2] text-[#D1D6DB]"
          }`}
        >
          등록
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pt-6">
        <input
          className="w-full text-[24px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="mt-6">
          <button
            type="button"
            className="mx-auto block rounded-[16px] bg-[#0EBC81] px-10 py-4 text-[16px] font-bold text-white"
          >
            사진 추가
          </button>
        </div>

        <textarea
          className="mt-8 min-h-[240px] w-full resize-none text-[16px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
          placeholder="자유롭게 얘기해보세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}
