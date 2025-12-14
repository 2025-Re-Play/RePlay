"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Search, MapPin, Plus, Star } from "lucide-react";
import Image from "next/image";

type PerformanceCalendarScreenProps = {
  onBack: () => void; 
  onDetailModeChange?: (isDetail: boolean) => void; // HomeScreen AppHeader 숨김용
};


type View = "list" | "detail" | "create";

type Performance = {
  id: number;
  title: string; // 공연명
  genre: string; // 공연 장르
  city: string; // 공연 위치(서울/부산...)
  place: string; // 공연 장소
  dateRange: string; // 공연 일시 "2025.02.15-02.17"
  description: string; // 공연 소개
  university: string; // 학교(또는 주최)
  image: string; // 썸네일/포스터 경로
  isMine: boolean; // 내 공연 여부
};

const cityOptions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "기타",
];

export default function PerformanceCalendarScreen({
  onDetailModeChange,
}: PerformanceCalendarScreenProps) {
  const [view, setView] = useState<View>("list");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 위치 드롭다운
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [city, setCity] = useState<string | null>(null);

  // 검색
  const [query, setQuery] = useState("");

  // 후기 바텀시트
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // ✅ 더미 공연 데이터 (이미지 경로는 너가 나중에 파일만 맞춰 넣으면 됨)
  const [performances, setPerformances] = useState<Performance[]>([
    {
      id: 1,
      title: "우리들의 여름",
      genre: "로맨스 / 드라마",
      city: "서울",
      place: "연세대학교 학생회관 대강당",
      dateRange: "2025.02.15-02.17",
      description:
        "졸업을 앞둔 대학생들이 마지막 여름을 보내며 겪는 사랑과 이별, 그리고 성장에 대한 이야기입니다. 현실적인 대사와 감정선 중심의 현대극입니다.",
      university: "연세대학교",
      image: "/performances/our-summer.png",
      isMine: false,
    },
    {
      id: 2,
      title: "햄릿: 변주",
      genre: "클래식 / 비극",
      city: "서울",
      place: "대학로 소극장 예그린",
      dateRange: "2025.03.01-03.03",
      description:
        "셰익스피어의 고전 비극 햄릿을 현대적으로 재해석한 작품입니다. 무대 장치와 조명을 최소화해 인물의 내면에 집중했습니다.",
      university: "서울대학교",
      image: "/performances/hamlet.png",
      isMine: false,
    },
    {
      id: 3,
      title: "웃음의 기술",
      genre: "코미디",
      city: "부산",
      place: "부산문화회관 소극장",
      dateRange: "2025.03.22-03.23",
      description:
        "웃음이 사라진 사회에서 웃음을 되찾기 위한 사람들의 소동을 그린 블랙 코미디입니다. 빠른 전개와 과장된 연출이 특징입니다.",
      university: "부산예술대학교",
      image: "/performances/comedy-skill.png",
      isMine: true,
    },
  ]);

  const selected = useMemo(() => {
    if (selectedId === null) return null;
    return performances.find((p) => p.id === selectedId) ?? null;
  }, [selectedId, performances]);

  // ✅ list가 아니면 AppHeader 숨김 (HomeScreen에서 headerHidden으로 받음)
  useEffect(() => {
    if (!onDetailModeChange) return;
    onDetailModeChange(view !== "list");
  }, [view, onDetailModeChange]);

  // 리스트 필터링
  const filtered = useMemo(() => {
    return performances.filter((p) => {
      const okCity = city ? p.city === city : true;

      const q = query.trim();
      const okQuery = q
        ? p.title.includes(q) ||
          p.university.includes(q) ||
          p.genre.includes(q) ||
          p.place.includes(q)
        : true;

      return okCity && okQuery;
    });
  }, [performances, city, query]);


  // 리스트 전용 헤더 (가운데 타이틀)
  const ListHeader = () => {
    return (
      <div className="flex h-14 items-center bg-white px-4">
        <ChevronLeft className="h-5 w-5 text-[#A7A7A7]" />
        <p className="mx-auto items-center text-[16px] font-bold text-[#1A1A1A]">
          대학 공연 일정
        </p>
      </div>
    );
  };

  // 상세/등록 공통 헤더: "< 대학 공연 일정"
  const BackToListHeader = ({ rightSlot }: { rightSlot?: React.ReactNode }) => {
    return (
      <div className="flex h-14 items-center bg-white px-4">
        <button
          type="button"
          onClick={() => {onBack}

          }
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-5 w-5 text-[#A7A7A7]" />
        </button>

        <div className="ml-auto">{rightSlot ?? <div className="w-10" />}</div>
      </div>
    );
  };

  /* ====================== 1) 리스트 화면 ====================== */
  if (view === "list") {
    return (
      <div className="relative flex h-full flex-col bg-white">
        <ListHeader />

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24 pt-4">
          {/* 검색 */}
          <div className="flex items-center gap-2 rounded-3xl bg-slate-100 px-6 py-3">
            <Search className="h-5 w-5 text-[#D1D6DB]" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#D1D6DB]"
              placeholder="공연명 또는 학교 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 위치 드롭다운 */}
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setShowCityMenu((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                ${
                  city
                    ? "border border-[#0EBC81] bg-[#E7FFF6] text-[#0EBC81]"
                    : "bg-slate-100 text-[#4F4F4F]"
                }`}
            >
              <MapPin className="h-4 w-4" />
              <span>{city ?? "위치"}</span>
            </button>

            {showCityMenu && (
              <div className="absolute left-0 top-12 z-20 w-40 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.17)]">
                <div className="space-y-1">
                  {cityOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setCity(opt);
                        setShowCityMenu(false);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-slate-100"
                    >
                      {opt}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setCity(null);
                      setShowCityMenu(false);
                    }}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-[#A7A7A7] hover:bg-slate-100"
                  >
                    전체 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 리스트 */}
          <div className="mt-6 space-y-4">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedId(p.id);
                  setView("detail");
                }}
                className="flex w-full gap-3 rounded-2xl bg-white p-3 text-left shadow-sm"
              >
                {/* 썸네일 */}
                <div className="relative h-[96px] w-[96px] overflow-hidden rounded-[10px] bg-[#B2B2B2]">
                  {/* 이미지 파일 너가 나중에 넣으면 자동 표시됨 */}
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center space-y-1">
                  <p className="text-[16px] font-bold text-[#1A1A1A]">
                    {p.title}
                  </p>
                  <p className="text-[14px] text-[#0EBC81]">{p.university}</p>
                  <p className="text-[14px] text-[#A7A7A7]">{p.city}</p>
                  <p className="text-[14px] text-[#A7A7A7]">{p.dateRange}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* + 버튼 */}
        <button
          type="button"
          onClick={() => setView("create")}
          className="fixed bottom-24 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#0EBC81] shadow-lg"
        >
          <Plus className="h-7 w-7 text-white" />
        </button>
      </div>
    );
  }

  /* ====================== 2) 상세 화면 ====================== */
  if (view === "detail" && selected) {
    return (
      <PerformanceDetail
        header={<BackToListHeader />}
        performance={selected}
        onBack={() => {
          setSelectedId(null);
          setView("list");
        }}
        onSave={(next) => {
          setPerformances((prev) =>
            prev.map((p) => (p.id === next.id ? next : p))
          );
        }}
        onOpenReview={() => setShowReviewSheet(true)}
        showReviewSheet={showReviewSheet}
        onCloseReview={() => setShowReviewSheet(false)}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
      />
    );
  }

  /* ====================== 3) 새 공연 등록 화면 ====================== */
  if (view === "create") {
    return (
      <PerformanceCreate
        header={<BackToListHeader />}
        onBack={() => setView("list")}
        onCreate={(created) => {
          setPerformances((prev) => [created, ...prev]);
          setView("list");
        }}
      />
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* 상세 (내 공연이면 수정 가능 / 남 공연이면 후기 등록) */
/* ------------------------------------------------------------------ */
function PerformanceDetail(props: {
  header: React.ReactNode;
  performance: Performance;
  onBack: () => void;
  onSave: (next: Performance) => void;
  onOpenReview: () => void;

  showReviewSheet: boolean;
  onCloseReview: () => void;
  reviewRating: number;
  setReviewRating: (n: number) => void;
  reviewText: string;
  setReviewText: (s: string) => void;
}) {
  const {
    header,
    performance,
    onSave,
    onOpenReview,
    showReviewSheet,
    onCloseReview,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
  } = props;

  const [isEdit, setIsEdit] = useState(false);

  const [title, setTitle] = useState(performance.title);
  const [place, setPlace] = useState(performance.place);
  const [dateRange, setDateRange] = useState(performance.dateRange);
  const [desc, setDesc] = useState(performance.description);

  const commit = () => {
    onSave({
      ...performance,
      title,
      place,
      dateRange,
      description: desc,
    });
    setIsEdit(false);
  };

  return (
    <div className="relative h-full bg-white">
      {header}

      {/* 이미지 */}
      <div className="relative h-[320px] bg-[#D9D9D9]">
        <Image
          src={performance.image}
          alt={performance.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="no-scrollbar h-[calc(100%-320px-56px)] overflow-y-auto px-6 py-5 space-y-4">
        <div className="flex items-start justify-between">
          {isEdit ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[140px] rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[16px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
              placeholder="공연명"
            />
          ) : (
            <p className="text-[16px] font-bold text-[#1A1A1A]">{title}</p>
          )}

          {performance.isMine && (
            <button
              type="button"
              onClick={() => {
                if (isEdit) commit();
                else setIsEdit(true);
              }}
              className="rounded-[10px] bg-[#E7F8F2] px-4 py-2 text-[14px] font-bold text-[#0EBC81]"
            >
              {isEdit ? "등록" : "수정"}
            </button>
          )}
        </div>

        {isEdit ? (
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="공연 장소"
          />
        ) : (
          <p className="text-[14px] text-[#A7A7A7]">{place}</p>
        )}

        {isEdit ? (
          <input
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="공연 일시"
          />
        ) : (
          <p className="text-[14px] text-[#A7A7A7]">{dateRange}</p>
        )}

        <p className="pt-6 text-[16px] font-bold text-[#1A1A1A]">공연 소개</p>

        {isEdit ? (
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="h-[140px] w-full rounded-[12px] border border-[#D1D6DB] p-4 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
            placeholder="공연 소개를 적어주세요"
          />
        ) : (
          <p className="text-[14px] text-[#1A1A1A]">{desc}</p>
        )}
      </div>

      {!performance.isMine && (
        <button
          type="button"
          onClick={onOpenReview}
          className="fixed bottom-20 left-4 right-4 rounded-[12px] bg-[#0EBC81] py-4 text-[16px] font-bold text-white"
        >
          비공개로 후기 등록
        </button>
      )}

      {/* 후기 바텀시트 */}
      {showReviewSheet && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={onCloseReview}>
          <div
            className="absolute bottom-0 w-full rounded-t-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[16px] font-bold text-[#1A1A1A]">
              공연 후기를 남겨주세요
            </p>

            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  onClick={() => setReviewRating(n)}
                  className={`h-10 w-10 ${
                    reviewRating >= n
                      ? "fill-[#0EBC81] text-[#0EBC81]"
                      : "text-[#D1D6DB]"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="후기를 작성해주세요"
              className="mt-4 h-32 w-full rounded-[12px] border border-[#D1D6DB] p-4 text-[14px] outline-none placeholder:text-[#D1D6DB]"
            />

            <button
              type="button"
              onClick={onCloseReview}
              className="mt-4 w-full rounded-[12px] bg-[#0EBC81] py-4 text-[16px] font-bold text-white"
            >
              등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 새 공연 등록 */
/* ------------------------------------------------------------------ */
function PerformanceCreate(props: {
  header: React.ReactNode;
  onBack: () => void;
  onCreate: (p: Performance) => void;
}) {
  const { header, onCreate } = props;

  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState("");
  const [city, setCity] = useState("서울");
  const [place, setPlace] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [genre, setGenre] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    const newOne: Performance = {
      id: Date.now(),
      title: title || "공연명",
      genre: genre || "장르",
      city: city || "서울",
      place: place || "공연 장소",
      dateRange: dateRange || "공연 일시",
      description: desc || "",
      university: university || "학교",
      image: "/performances/new-performance.jpg", // 너가 나중에 교체
      isMine: true,
    };
    onCreate(newOne);
  };

  return (
    <div className="relative h-full bg-white">
      {header}

      <div className="h-[320px] bg-[#D9D9D9]" />

      <div className="px-6 py-5 space-y-4">
        <div className="flex items-start justify-between">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공연명"
            className="w-[140px] rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[16px] font-bold text-[#1A1A1A] outline-none placeholder:text-[#D1D6DB]"
          />

          <button
            type="button"
            onClick={submit}
            className="rounded-[10px] bg-[#E7F8F2] px-4 py-2 text-[14px] font-bold text-[#0EBC81]"
          >
            등록
          </button>
        </div>

        <input
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="학교"
          className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="공연 위치(서울/부산...)"
          className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />

        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="공연 장소"
          className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />

        <input
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          placeholder="공연 일시"
          className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />

        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="공연 장르"
          className="w-full rounded-[12px] border border-[#D1D6DB] px-4 py-3 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="공연 소개를 적어주세요"
          className="h-[160px] w-full rounded-[12px] border border-[#D1D6DB] p-4 text-[14px] outline-none placeholder:text-[#D1D6DB]"
        />
      </div>
    </div>
  );
}
