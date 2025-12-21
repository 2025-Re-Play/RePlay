"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/auth";

type Performance = {
  id: number;
  title: string;
  period: string;
  image: string;
};

type Review = {
  id: number;
  playTitle: string;
  rating: number;
  date: string;
  content: string;
};

type MyPageProfile = {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | string;
  school_id: number;
  club_id: number;
};

type School = { id: number; name: string; region: string; code: string };
type Club = { id: number; school_id: number; name: string; description: string; genre: string };

type MyPageScreenProps = {
  onDetailModeChange?: (isDetail: boolean) => void;
  tabNonce?: number;
  onLoggedOut?: () => void;
};

const performances: Performance[] = [
  {
    id: 3,
    title: "웃음의 기술",
    period: "2025.03.22-03.23",
    image: "/performances/comedy-skill.png",
  },
];

const mockReviews: Review[] = [
  { id: 1, playTitle: "웃음의 기술", rating: 4, date: "25.03.23", content: "와 재밌네요ㅋㅋㅋ" },
  { id: 2, playTitle: "웃음의 기술", rating: 5, date: "25.03.22", content: "너무 웃겨서 배꼽 잡고 봤네요 ㅋㅋㅋ" },
  { id: 3, playTitle: "웃음의 기술", rating: 3, date: "25.03.22", content: "재밌긴 함" },
];

function extractArray<T>(parsed: any): T[] {
  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object" && "data" in parsed) {
    const d = (parsed as any).data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object" && Array.isArray(d.items)) return d.items;
  }

  if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)) {
    return (parsed as any).items;
  }

  return [];
}

async function getProfile(auth: Record<string, string>): Promise<MyPageProfile> {
  const res = await fetch("/api/v1/mypage/profile", {
    method: "GET",
    headers: { Accept: "application/json", ...auth },
    credentials: "include",
    cache: "no-store",
  });

  const txt = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`PROFILE_${res.status}:${txt}`);

  return JSON.parse(txt) as MyPageProfile;
}

async function logoutRequest(auth: Record<string, string>): Promise<void> {
  const res = await fetch("/api/v1/auth/logout", {
    method: "POST",
    headers: { Accept: "application/json", ...auth },
    credentials: "include",
  });

  const txt = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`LOGOUT_${res.status}:${txt}`);
}

async function getSchools(): Promise<School[]> {
  const res = await fetch("/api/v1/schools", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const txt = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`SCHOOLS_${res.status}:${txt}`);

  const parsed = JSON.parse(txt);
  return extractArray<School>(parsed);
}

async function getClubs(schoolId: number): Promise<Club[]> {
  const res = await fetch(`/api/v1/schools/${schoolId}/clubs`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const txt = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`CLUBS_${res.status}:${txt}`);

  const parsed = JSON.parse(txt);
  return extractArray<Club>(parsed);
}

function roleLabel(role: string) {
  if (role === "USER") return "이용자";
  if (role === "ADMIN") return "관리자";
  return role;
}

export default function MyPageScreen({ onDetailModeChange, tabNonce, onLoggedOut }: MyPageScreenProps) {
  const auth = useAuth();

  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);

  const [profile, setProfile] = useState<MyPageProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [schools, setSchools] = useState<School[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setSelectedPerformance(null);
    onDetailModeChange?.(false);
  }, [tabNonce]);

  useEffect(() => {
    onDetailModeChange?.(!!selectedPerformance);
  }, [selectedPerformance, onDetailModeChange]);

  // 프로필
  useEffect(() => {
    let alive = true;

    async function run() {
      if (!auth.isLoggedIn) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await getProfile(auth.authHeader());
        if (!alive) return;
        setProfile(data);
      } catch (e: any) {
        if (!alive) return;
        console.error("프로필 조회 실패:", e);
        setProfile(null);
        setProfileError(e?.message ?? "프로필 조회 실패");
      } finally {
        if (!alive) return;
        setLoadingProfile(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [tabNonce, auth.isLoggedIn]); // 로그인 바뀌면 재조회

  // 학교/동아리 목록 (프로필에 school_id가 있어야 clubs 호출)
  useEffect(() => {
    let alive = true;

    async function run() {
      if (!auth.isLoggedIn) {
        setSchools([]);
        setClubs([]);
        return;
      }

      try {
        const s = await getSchools();
        if (!alive) return;
        setSchools(s);
      } catch (e) {
        if (!alive) return;
        setSchools([]);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [auth.isLoggedIn]);

  useEffect(() => {
    let alive = true;

    async function run() {
      const sid = profile?.school_id;
      if (!auth.isLoggedIn || !sid) {
        setClubs([]);
        return;
      }

      try {
        const c = await getClubs(sid);
        if (!alive) return;
        setClubs(c);
      } catch (e) {
        if (!alive) return;
        setClubs([]);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [auth.isLoggedIn, profile?.school_id]);

  const schoolName = useMemo(() => {
    if (!profile?.school_id) return "";
    const s = schools.find((x) => x.id === profile.school_id);
    return s?.name ?? "";
  }, [schools, profile?.school_id]);

  const clubName = useMemo(() => {
    if (!profile?.club_id) return "";
    const c = clubs.find((x) => x.id === profile.club_id);
    return c?.name ?? "";
  }, [clubs, profile?.club_id]);

  const metaLine = useMemo(() => {
    const parts: string[] = [];
    if (schoolName) parts.push(schoolName);
    if (clubName) parts.push(clubName);
    return parts.join(" ");
  }, [schoolName, clubName]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logoutRequest(auth.authHeader());
      auth.logout();

      if (onLoggedOut) {
        onLoggedOut();
        return;
      }
      window.location.reload();
    } catch (e: any) {
      alert("로그아웃 실패: " + (e?.message ?? ""));
    } finally {
      setLoggingOut(false);
    }
  }

  if (!auth.isLoggedIn) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white px-6">
        <p className="text-[16px] font-medium text-[#1A1A1A]">로그인이 필요합니다.</p>
        <button
          type="button"
          onClick={auth.openLogin}
          className="mt-4 w-full rounded-[16px] bg-[#0EBC81] py-4 text-[16px] font-bold text-white"
        >
          로그인 하러가기
        </button>
      </div>
    );
  }

  if (selectedPerformance) {
    return (
      <div className="flex h-full flex-col bg-white">
        <header className="flex h-20 items-center px-4 shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedPerformance(null)}
            className="mr-2 flex h-9 w-9 items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-[#9E9E9E]" />
          </button>
          <p className="flex-1 text-center text-[16px] font-semibold text-[#1A1A1A]">
            {selectedPerformance.title} 리뷰 확인
          </p>
          <div className="h-9 w-9" />
        </header>

        <main className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          <section className="mt-4 mb-6 px-4">
            <p className="text-[16px] font-medium text-[#9E9E9E]">후기 (3) · 평균 4점</p>
          </section>

          <section className="space-y-6">
            {mockReviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </section>
        </main>
      </div>
    );
  }

  const name = loadingProfile ? "불러오는 중..." : profile?.name ?? "test01";
  const role = loadingProfile ? "" : roleLabel(profile?.role ?? "");

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4 pt-4">
        <section className="mb-10">
          <p className="mb-4 text-[16px] font-medium text-[#9E9E9E]">프로필</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-[48px] w-[48px] overflow-hidden bg-white">
                <Image src="/icons/my.svg" alt="my profile" fill className="object-contain" sizes="64px" priority />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-medium text-[#1A1A1A]">{name}</p>

                {metaLine ? (
                  <p className="text-[14px] font-medium text-[#9E9E9E]">{metaLine}</p>
                ) : (
                  <p className="text-[14px] font-medium text-[#9E9E9E]">
                    {loadingProfile ? "" : "학교/동아리 정보 없음"}
                  </p>
                )}

                {role ? <p className="text-[14px] font-medium text-[#9E9E9E]">{role}</p> : null}

                {profileError ? <p className="text-[12px] text-red-500">{profileError}</p> : null}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-[5px] bg-[#F7F7F7] px-2 py-1 text-[14px] font-bold text-[#4F4F4F] disabled:opacity-60"
            >
              {loggingOut ? "로그아웃중..." : "로그아웃"}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-[16px] font-medium text-[#9E9E9E]">우리 공연 관리</p>

          <div className="space-y-4">
            {performances.map((pf) => (
              <PerformanceRow key={pf.id} performance={pf} onClickReview={() => setSelectedPerformance(pf)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type PerformanceRowProps = {
  performance: Performance;
  onClickReview: () => void;
};

function PerformanceRow({ performance, onClickReview }: PerformanceRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-[84px] w-[84px] overflow-hidden rounded-[10px] bg-[#B2B2B2]">
          <Image src={performance.image} alt={performance.title} fill className="object-cover" sizes="84px" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-medium text-[#1A1A1A]">{performance.title}</p>
          <p className="text-[14px] font-medium text-[#9E9E9E]">{performance.period}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClickReview}
        className="rounded-[5px] bg-[#F7F7F7] px-2 py-1 text-[14px] font-bold text-[#4F4F4F]"
      >
        리뷰확인
      </button>
    </div>
  );
}

type ReviewRowProps = {
  review: Review;
};

function ReviewRow({ review }: ReviewRowProps) {
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-[36px] w-[36px] rounded-full bg-[#D1D6DB]" />

          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-medium text-[#1A1A1A]">{review.playTitle}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < review.rating;
                return (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${filled ? "text-[#0EBC81] fill-[#0EBC81]" : "text-[#D1D6DB] fill-[#D1D6DB]"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[14px] font-medium text-[#D1D6DB]">{review.date}</p>
      </div>

      <p className="mt-2 text-[14px] font-medium text-[#1A1A1A]">{review.content}</p>
    </div>
  );
}
