"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth";
import { ChevronLeft } from "lucide-react";

type School = { id: number; name: string; region: string; code: string };
type Club = {
  id: number;
  school_id: number;
  name: string;
  description: string;
  genre: string;
};

type Paginated<T> = {
  success: boolean;
  data: { items: T[] };
  error?: { code: string; message: string };
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[API ERROR]", path, res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export default function SignupFormScreen() {
  const { signupRole, signup, goBackAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [adminCode, setAdminCode] = useState("");

  // 입력값(타이핑) / 실제 검색어(0.3초 디바운스)
  const [schoolInput, setSchoolInput] = useState("");
  const [clubInput, setClubInput] = useState("");
  const [schoolKeyword, setSchoolKeyword] = useState("");
  const [clubKeyword, setClubKeyword] = useState("");

  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);

  const [schools, setSchools] = useState<School[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [schoolLoading, setSchoolLoading] = useState(false);
  const [clubLoading, setClubLoading] = useState(false);

  // 디바운스: 학교 입력 0.3초 멈추면 keyword 확정
  useEffect(() => {
    const t = setTimeout(() => {
      setSchoolKeyword(schoolInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [schoolInput]);

  // 디바운스: 동아리 입력 0.3초 멈추면 keyword 확정
  useEffect(() => {
    const t = setTimeout(() => {
      setClubKeyword(clubInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [clubInput]);

  // 학교 목록
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setSchoolLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("size", "100");
        if (schoolKeyword) params.set("keyword", schoolKeyword);

        const json = await getJson<Paginated<School>>(
          `/api/v1/schools?${params.toString()}`
        );

        if (!alive) return;
        setSchools(json?.data?.items ?? []);
      } catch {
        if (!alive) return;
        setErr("학교 목록을 불러오지 못했습니다.");
        setSchools([]);
      } finally {
        if (!alive) return;
        setSchoolLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [schoolKeyword]);

  // 동아리 목록 (선택한 학교 기준)
  useEffect(() => {
    let alive = true;

    if (schoolId === null) {
      setClubs([]);
      return;
    }

    const run = async () => {
      setClubLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("size", "100");
        if (clubKeyword) params.set("keyword", clubKeyword);

        const json = await getJson<Paginated<Club>>(
          `/api/v1/schools/${schoolId}/clubs?${params.toString()}`
        );

        if (!alive) return;
        setClubs(json?.data?.items ?? []);
      } catch {
        if (!alive) return;
        setErr("동아리 목록을 불러오지 못했습니다.");
        setClubs([]);
      } finally {
        if (!alive) return;
        setClubLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [schoolId, clubKeyword]);

  const schoolList = useMemo(() => schools, [schools]);
  const clubList = useMemo(() => clubs, [clubs]);

  const canSubmit =
    email.trim() &&
    password.trim() &&
    name.trim() &&
    schoolId !== null &&
    clubId !== null &&
    (signupRole === "USER" ? true : adminCode.trim());

  const submit = async () => {
    if (!canSubmit) return;

    setErr(null);
    setLoading(true);
    try {
      await signup({
        email: email.trim(),
        password: password,
        name: name.trim(),
        role: signupRole,
        admin_code: signupRole === "ADMIN" ? adminCode.trim() : undefined,
        school_id: schoolId!,
        club_id: clubId!,
      });
    } catch {
      setErr("회원가입에 실패했습니다. 입력값을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white px-6 pb-10 pt-16">
      <button
        type="button"
        onClick={goBackAuth}
        className="flex items-left mb-8 text-[14px] font-medium text-[#9E9E9E]"
        aria-label="뒤로"
      >
        <ChevronLeft className="h-6 w-6 text-[#9E9E9E]" />
      </button>

      <p className="mt-6 text-center text-[22px] font-medium text-[#1A1A1A]">
        기본 정보를 작성해주세요
      </p>

      <div className="mt-10 space-y-3">
        <input
          className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {signupRole === "ADMIN" ? (
        <div className="mt-3">
          <input
            className="w-full rounded-[16px] border border-[#F2F2F2] px-5 py-4 text-[14px] outline-none"
            placeholder="관리자 코드"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />
        </div>
      ) : null}

      {/* 학교 */}
      <div className="mt-10">
        <input
          className="w-full rounded-[12px] border border-[#F2F2F2] px-6 py-4 text-[14px] text-[#4F4F4F] font-medium outline-none"
          placeholder={schoolLoading ? "학교 불러오는 중..." : "학교명 검색"}
          value={schoolInput}
          onChange={(e) => {
            setErr(null);

            setSchoolInput(e.target.value);
            setSchoolId(null);
            setSchoolOpen(true);

            // 학교 바꾸면 동아리 초기화
            setClubId(null);
            setClubInput("");
            setClubKeyword("");
            setClubs([]);
          }}
          onFocus={() => {
            if (schoolId === null) setSchoolOpen(true);
          }}
          onBlur={() => setTimeout(() => setSchoolOpen(false), 120)}
        />

        {schoolOpen && schoolId === null ? (
          <div className="mt-3 rounded-[12px] bg-[#F7F7F7] px-6 py-5">
            {/* ✅ 리스트만 스크롤 */}
            <div className="max-h-[240px] overflow-y-auto pr-1">
              <div className="space-y-4">
                {schoolList.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSchoolId(s.id);
                      setSchoolInput(s.name);
                      setSchoolKeyword(s.name); // 선택은 즉시 확정
                      setSchoolOpen(false);

                      setClubOpen(true);
                      setClubInput("");
                      setClubKeyword("");
                      setClubId(null);
                    }}
                    className="block w-full text-left text-[14px] font-medium text-[#4F4F4F]"
                  >
                    {s.name}
                  </button>
                ))}

                {!schoolLoading && schoolList.length === 0 ? (
                  <p className="text-[13px] text-[#9E9E9E]">
                    검색 결과가 없습니다.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 동아리 */}
      <div className="mt-6">
        <input
          className="w-full rounded-[12px] border border-[#F2F2F2] px-6 py-4 text-[14px] text-[#4F4F4F] font-medium outline-none"
          placeholder={
            schoolId === null
              ? "학교를 먼저 선택하세요"
              : clubLoading
              ? "동아리 불러오는 중..."
              : "동아리 검색"
          }
          value={clubInput}
          onChange={(e) => {
            setErr(null);
            setClubInput(e.target.value);
            setClubId(null);
            if (schoolId !== null) setClubOpen(true);
          }}
          onFocus={() => {
            if (schoolId !== null && clubId === null) setClubOpen(true);
          }}
          onBlur={() => setTimeout(() => setClubOpen(false), 120)}
          disabled={schoolId === null}
        />

        {clubOpen && clubId === null && schoolId !== null ? (
          <div className="mt-3 rounded-[12px] bg-[#F7F7F7] px-6 py-5">
            {/* ✅ 리스트만 스크롤 */}
            <div className="max-h-[240px] overflow-y-auto pr-1">
              <div className="space-y-4">
                {clubList.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClubId(c.id);
                      setClubInput(c.name);
                      setClubKeyword(c.name); // 선택은 즉시 확정
                      setClubOpen(false);
                    }}
                    className="block w-full text-left text-[14px] font-medium text-[#4F4F4F]"
                  >
                    {c.name}
                  </button>
                ))}

                {!clubLoading && clubList.length === 0 ? (
                  <p className="text-[13px] text-[#9E9E9E]">
                    검색 결과가 없습니다.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {err ? <p className="mt-4 text-[12px] text-red-500">{err}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit || loading}
        className={`mt-auto w-full rounded-[16px] py-4 text-[16px] font-bold text-white ${
          !canSubmit || loading ? "bg-[#0EBC81]/50" : "bg-[#0EBC81]"
        }`}
      >
        {loading ? "가입 중..." : "시작하기"}
      </button>
    </div>
  );
}
