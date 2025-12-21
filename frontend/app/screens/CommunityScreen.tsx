"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, X } from "lucide-react";

type CommunityScreenProps = {
  onCalendarClick: () => void;
  onHeaderHiddenChange?: (hidden: boolean) => void;
  tabNonce?: number;
};

type BoardKey = "일반 게시판" | "소품 요청 게시판";
const BOARDS: BoardKey[] = ["일반 게시판", "소품 요청 게시판"];

type Post = {
  id: number;
  board: BoardKey;
  title: string;
  preview: string;
  content: string;
  createdAgo: string;
  likeCount: number;
  commentCount: number;
  hasImage?: boolean;
  liked?: boolean;
  images?: string[];
};

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
};

type PickedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const mockPosts: Post[] = [
  {
    id: 101,
    board: "일반 게시판",
    title: "단편영화 촬영용 카메라 추천 부탁드려요",
    preview: "이번 학기 단편영화 찍는데 예산이 많지 않아서요...",
    content:
      "이번 학기 단편영화 찍는데 예산이 많지 않아서요.\n미러리스 기준으로 영상용 가성비 좋은 카메라 추천해주실 수 있을까요?\n렌즈 조합도 같이 알려주시면 감사하겠습니다.",
    createdAgo: "11분 전",
    likeCount: 28,
    commentCount: 3,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 102,
    board: "일반 게시판",
    title: "대학로 근처 소극장 대관 후기 궁금해요",
    preview: "졸업공연 준비 중인데 대학로 소극장 학생 할인...",
    content:
      "졸업공연 준비 중인데 대학로 소극장들 중에 학생 할인이나 연습실 같이 빌려주는 곳 있을까요?\n실제 써보신 분들 후기 듣고 싶어요.",
    createdAgo: "2시간 전",
    likeCount: 41,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 103,
    board: "일반 게시판",
    title: "연출 의견이 계속 갈리는데 어떻게 조율하시나요?",
    preview: "연출 2명 체제로 가고 있는데 해석 방향이 계속...",
    content:
      "연출 2명 체제로 가고 있는데 해석 방향이 계속 달라져서 고민이에요.\n다들 동아리에서는 이런 상황에서 어떻게 조율하시는지 궁금합니다.",
    createdAgo: "어제",
    likeCount: 19,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 104,
    board: "일반 게시판",
    title: "단편영화 배우 어디서 구하시나요?",
    preview: "주변에 연기 전공 친구가 없어서 캐스팅이 너무...",
    content:
      "주변에 연기 전공 친구가 없어서 배우 캐스팅이 너무 어렵네요.\n다들 보통 어디서 배우 구하시는지, 커뮤니티나 카페 추천해주시면 감사해요.",
    createdAgo: "3일 전",
    likeCount: 33,
    commentCount: 3,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 105,
    board: "일반 게시판",
    title: "공연 직전에 부원들 분위기 관리 어떻게 하세요",
    preview: "공연 일주일 전부터 다들 예민해져서 팀 분위기가...",
    content:
      "공연 일주일 전부터 다들 예민해져서 팀 분위기가 좀 안 좋아지네요.\n공연 앞두고 팀 분위기 유지하는 팁 있으면 공유 부탁드려요!",
    createdAgo: "1주 전",
    likeCount: 22,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },

  {
    id: 201,
    board: "소품 요청 게시판",
    title: "현대극에 쓸 소형 식탁 구합니다",
    preview: "2인용 정도 되는 소형 식탁이 필요합니다...",
    content:
      "현대극 공연 준비 중인데 2인용 정도 되는 소형 식탁이 필요합니다.\n구매보다는 대여 선호하고, 서울 지역이면 좋겠습니다.\n보유하고 계신 분이나 대여처 아시면 알려주세요!",
    createdAgo: "방금 전",
    likeCount: 12,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 202,
    board: "소품 요청 게시판",
    title: "시대극 초대 소품 어디서 구할 수 있을까요?",
    preview: "중세 분위기의 초대가 필요한데 제작할 시간이 부족...",
    content:
      "중세 분위기의 '초대' 소품이 필요합니다.\n직접 제작하기엔 시간이 부족해서 대여 가능한 분이나 추천 장소 부탁드립니다.",
    createdAgo: "45분 전",
    likeCount: 17,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 203,
    board: "소품 요청 게시판",
    title: "학교 배경 연극에 쓸 교복 구합니다",
    preview: "고등학교 배경 연극이라 교복이 필요합니다...",
    content:
      "고등학교 배경 연극이라 교복이 필요합니다.\n남/여 상관 없고, 사이즈는 보통 체형이면 괜찮습니다.\n혹시 대여 가능하신 분 계신가요?",
    createdAgo: "2일 전",
    likeCount: 9,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 204,
    board: "소품 요청 게시판",
    title: "판타지 극 소품용 책 여러 권 필요해요",
    preview: "마법서처럼 보일 책 소품이 여러 권 필요합니다...",
    content:
      "판타지 연극에서 마법서처럼 보일 책 소품이 여러 권 필요합니다.\n실제 책이어도 괜찮고, 커버만 빈티지하게 해도 됩니다.\n빌려주실 수 있는 분 댓글 부탁드려요!",
    createdAgo: "5일 전",
    likeCount: 14,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
  {
    id: 205,
    board: "소품 요청 게시판",
    title: "단편영화 촬영용 빈티지 전화기 구해요",
    preview: "80~90년대 배경 촬영에 사용할 다이얼 전화기를...",
    content:
      "80~90년대 배경 단편영화 촬영에 사용할 다이얼 전화기를 찾고 있습니다.\n작동 여부는 상관없고 외형이 중요해요.\n대여 가능하신 분 연락 주세요!",
    createdAgo: "1주 전",
    likeCount: 21,
    commentCount: 2,
    hasImage: false,
    liked: false,
    images: [],
  },
];

export default function CommunityScreen({
  onCalendarClick,
  onHeaderHiddenChange,
  tabNonce,
}: CommunityScreenProps) {
  const [activeBoard, setActiveBoard] = useState<BoardKey>("일반 게시판");
  const [mode, setMode] = useState<"list" | "detail" | "write">("list");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const [draftBoard, setDraftBoard] = useState<BoardKey>("일반 게시판");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");

  const [draftImages, setDraftImages] = useState<PickedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({
    101: [
      { id: 1001, author: "cinema_dong", date: "26.03.31", text: "소니 a6400 많이 쓰는 편이에요. 영상 AF 안정적이고 중고도 많아요." },
      { id: 1002, author: "hyun_pd", date: "26.03.31", text: "예산 적으면 캐논 EOS R10도 괜찮아요. 색감 무난해서 후보정 부담 적어요." },
    ],
    201: [
      { id: 2001, author: "prop_owner", date: "26.03.31", text: "연세대 동아리방에 소형 원목 식탁 하나 있어요. 대여 가능합니다!" },
    ],
  });

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) ?? null;
  }, [selectedPostId, posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim();
    return posts
      .filter((p) => p.board === activeBoard)
      .filter((p) => {
        if (!q) return true;
        return p.title.includes(q) || p.preview.includes(q) || p.content.includes(q);
      });
  }, [posts, activeBoard, query]);

  useEffect(() => {
    onHeaderHiddenChange?.(mode === "detail" || mode === "write");
  }, [mode, onHeaderHiddenChange]);

  useEffect(() => {
    setMode("list");
    setSelectedPostId(null);

    setDraftTitle("");
    setDraftContent("");

    setDraftImages((prev) => {
      prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      return [];
    });

    onHeaderHiddenChange?.(false);
  }, [tabNonce]);

  const openDetail = (postId: number) => {
    setSelectedPostId(postId);
    setMode("detail");
  };

  const closeDetail = () => {
    setSelectedPostId(null);
    setMode("list");
  };

  const openWrite = () => {
    setDraftBoard(activeBoard);
    setDraftTitle("");
    setDraftContent("");

    setDraftImages((prev) => {
      prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      return [];
    });

    setMode("write");
  };

  const closeWrite = () => {
    setDraftImages((prev) => {
      prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      return [];
    });
    setMode("list");
  };

  const submitWrite = () => {
    const t = draftTitle.trim();
    const c = draftContent.trim();
    if (!t) return;

    const newPost: Post = {
      id: Date.now(),
      board: draftBoard,
      title: t,
      preview: c.slice(0, 20) || "글 미리보기 한 줄",
      content: c || "글 내용",
      createdAgo: "방금 전",
      likeCount: 0,
      commentCount: 0,
      hasImage: draftImages.length > 0,
      liked: false,
      images: draftImages.map((x) => x.previewUrl),
    };

    setPosts((prev) => [newPost, ...prev]);
    setActiveBoard(draftBoard);
    setMode("list");

    // 글 목록에서 계속 보이게 URL 유지하려면 revoke하면 안됨
    setDraftImages([]);
  };

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = !!p.liked;
        return {
          ...p,
          liked: !liked,
          likeCount: liked ? p.likeCount - 1 : p.likeCount + 1,
        };
      }),
    );
  };

  const addComment = (postId: number, text: string) => {
    const v = text.trim();
    if (!v) return;

    const newComment: Comment = {
      id: Date.now(),
      author: "햄릿",
      date: "26.03.31",
      text: v,
    };

    setCommentsByPost((prev) => {
      const arr = prev[postId] ?? [];
      return { ...prev, [postId]: [newComment, ...arr] };
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p)),
    );
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // ✅ 글쓰기 사진 선택
  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setDraftImages((prev) => {
      const remain = Math.max(0, 4 - prev.length);
      const take = files.slice(0, remain);

      const next: PickedImage[] = take.map((f) => ({
        id: `${f.name}-${f.size}-${f.lastModified}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));

      return [...prev, ...next];
    });

    // 같은 파일 다시 선택 가능하게
    e.target.value = "";
  };

  // ✅ 글쓰기 사진 삭제
  const onRemoveImage = (id: string) => {
    setDraftImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  if (mode === "detail" && selectedPost) {
    return (
      <CommunityDetail
        post={selectedPost}
        comments={commentsByPost[selectedPost.id] ?? []}
        onBack={closeDetail}
        onToggleLike={() => toggleLike(selectedPost.id)}
        onAddComment={(text) => addComment(selectedPost.id, text)}
      />
    );
  }

  if (mode === "write") {
    return (
      <CommunityWrite
        board={draftBoard}
        title={draftTitle}
        content={draftContent}
        onBack={closeWrite}
        onChangeBoard={setDraftBoard}
        onChangeTitle={setDraftTitle}
        onChangeContent={setDraftContent}
        onSubmit={submitWrite}
        fileInputRef={fileInputRef}
        images={draftImages}
        onOpenFilePicker={openFilePicker}
        onPickFiles={onPickFiles}
        onRemoveImage={onRemoveImage}
      />
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-24 pt-6 space-y-4">
        {/* 검색 */}
        <div className="flex items-center gap-2 rounded-[20px] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[#F2F2F2]">
          <Image src="/icons/search.svg" alt="검색" width={20} height={20} />
          <input
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#D1D6DB]"
            placeholder="게시글 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 대학 공연 일정 확인 */}
        <button
          type="button"
          onClick={onCalendarClick}
          className="flex w-full items-center justify-between rounded-[24px] bg-[#DFF8EE] px-6 py-5"
        >
          <div className="flex items-center gap-3">
            <Image src="/icons/calendar.svg" alt="캘린더" width={24} height={24} />
            <span className="text-[16px] font-bold text-[#1A1A1A]">대학 공연 일정 확인</span>
          </div>
          <Image src="/icons/arrow-right.svg" alt="이동" width={24} height={24} />
        </button>

        {/* 게시판 탭 */}
        <div className="flex gap-3">
          {BOARDS.map((b) => {
            const active = activeBoard === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setActiveBoard(b)}
                className={`flex-1 rounded-[12px] py-3 text-center text-[16px] font-bold
                  ${
                    active
                      ? "bg-white text-[#1A1A1A] shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[#F2F2F2]"
                      : "bg-white text-[#D1D6DB] shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-[#F2F2F2]"
                  }`}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* 리스트 */}
        <div className="space-y-6 pt-2">
          {filteredPosts.map((p) => (
            <PostRow key={p.id} post={p} onClick={() => openDetail(p.id)} />
          ))}
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      <button type="button" onClick={openWrite} className="fixed bottom-20 right-2 flex items-center justify-center">
        <Image src="/icons/pencil.svg" alt="글쓰기" width={96} height={96} />
      </button>
    </div>
  );
}

function PostRow({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 text-left">
      <div className="flex-1">
        <p className="text-[16px] font-bold text-[#1A1A1A]">{post.title}</p>
        <p className="mt-1 text-[14px] text-[#9E9E9E]">{post.preview}</p>

        <div className="mt-2 flex items-center gap-3 text-[14px] text-[#9E9E9E]">
          <div className="flex items-center gap-1">
            <Image src="/icons/like.svg" alt="좋아요" width={20} height={20} />
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/icons/comment.svg" alt="댓글" width={20} height={20} />
            <span>{post.commentCount}</span>
          </div>
          <span className="text-[#9E9E9E]">|</span>
          <span>{post.createdAgo}</span>
        </div>
      </div>
    </button>
  );
}

function CommunityDetail({
  post,
  comments,
  onBack,
  onToggleLike,
  onAddComment,
}: {
  post: Post;
  comments: Comment[];
  onBack: () => void;
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
}) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 커스텀 헤더 */}
      <div className="flex h-20 items-center px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pt-2 pb-[140px]">
        <div className="flex items-start justify-between">
          <p className="text-[20px] font-bold text-[#1A1A1A]">{post.title}</p>
          <span className="pt-2 text-[14px] font-medium text-[#9E9E9E]">{post.createdAgo}</span>
        </div>

        <p className="mt-6 whitespace-pre-line text-[16px] font-medium text-[#1A1A1A] leading-[1.6]">
          {post.content}
        </p>

        {/* ✅ 이미지 없으면 아예 안보임 */}
        {post.images && post.images.length > 0 && post.images[0] ? (
          <div className="mt-6 relative h-[260px] w-full overflow-hidden rounded-[20px]">
            <Image src={post.images[0]} alt="post" fill className="object-cover" unoptimized />
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-b border-[#F2F2F2] pb-4">
          <button type="button" onClick={onToggleLike} className="flex items-center gap-2 text-[14px]">
            <Image src={post.liked ? "/icons/like.svg" : "/icons/like-gray.svg"} alt="공감" width={20} height={20} />
            <span className={post.liked ? "text-[#0EBC81]" : "text-[#9E9E9E]"}>공감 {post.likeCount}</span>
          </button>

          <div className="flex items-center gap-2 text-[14px] text-[#9E9E9E]">
            <Image src="/icons/comment-gray.svg" alt="댓글" width={20} height={20} />
            <span>댓글 {post.commentCount}</span>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              {/* ✅ 회색 원 -> my.svg */}
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
                <Image src="/icons/my.svg" alt="profile" fill className="object-contain" sizes="48px" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#1A1A1A]">{c.author}</span>
                  <span className="text-[14px] text-[#D1D6DB]">{c.date}</span>
                </div>
                <p className="mt-2 text-[14px] font-medium text-[#1A1A1A]">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 입력창 */}
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
              if (!commentText.trim()) return;
              onAddComment(commentText);
              setCommentText("");
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

function CommunityWrite({
  board,
  title,
  content,
  onBack,
  onChangeBoard,
  onChangeTitle,
  onChangeContent,
  onSubmit,
  fileInputRef,
  images,
  onOpenFilePicker,
  onPickFiles,
  onRemoveImage,
}: {
  board: BoardKey;
  title: string;
  content: string;
  onBack: () => void;
  onChangeBoard: (v: BoardKey) => void;
  onChangeTitle: (v: string) => void;
  onChangeContent: (v: string) => void;
  onSubmit: () => void;

  fileInputRef: React.RefObject<HTMLInputElement | null>;
  images: PickedImage[];
  onOpenFilePicker: () => void;
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 커스텀 헤더 */}
      <div className="flex h-20 items-center justify-between px-6">
        <button type="button" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="rounded-[10px] bg-[#E7F8F2] px-4 py-2 text-[14px] font-bold text-[#0EBC81]"
        >
          등록
        </button>
      </div>

      {/* ✅ 파일 인풋 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onPickFiles}
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-24 pt-4">
        {/* 게시판 선택 */}
        <div className="mb-6 flex gap-2">
          {BOARDS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onChangeBoard(b)}
              className={`rounded-full px-4 py-2 text-[14px] font-bold ${
                board === b ? "bg-[#0EBC81] text-white" : "bg-[#F2F2F2] text-[#9E9E9E]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* 제목 */}
        <input
          className="w-full text-[24px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />

        {/* ✅ 사진 추가 + 미리보기 */}
        <div className="mt-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenFilePicker}
              disabled={images.length >= 4}
              className={`rounded-[10px] px-4 py-2 text-[14px] font-bold ${
                images.length >= 4 ? "bg-[#F2F2F2] text-[#9E9E9E]" : "bg-[#E7F8F2] text-[#0EBC81]"
              }`}
            >
              사진 추가
            </button>
          </div>

          {images.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-24 w-24 overflow-hidden rounded-[16px] border border-[#F2F2F2] bg-white"
                >
                  {/* objectURL은 next/image가 막는 경우가 있어서 img가 제일 확실 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.previewUrl} alt="preview" className="h-full w-full object-cover" />

                  <button
                    type="button"
                    onClick={() => onRemoveImage(img.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* 내용 */}
        <textarea
          className="mt-8 h-[240px] w-full resize-none text-[16px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
          placeholder="자유롭게 얘기해보세요"
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
        />
      </div>
    </div>
  );
}
