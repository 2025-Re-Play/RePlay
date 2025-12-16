"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";

type School = { id: number; name: string };
type Club = { id: number; name: string };

const SCHOOL_DUMMY: School[] = [
  { id: 1, name: "연세대학교 신촌" },
  { id: 2, name: "연세대학교 원주" },
];

const CLUB_DUMMY: Club[] = [
  { id: 10, name: "동아리명1" },
  { id: 11, name: "동아리명2" },
];

export default function SignupFormScreen() {
  const { signupRole, signup, goBackAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [adminCode, setAdminCode] = useState("");

  const [schoolQuery, setSchoolQuery] = useState("");
  const [clubQuery, setClubQuery] = useState("");

  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number | null>(null);

  // ✅ 리스트 열림/닫힘 상태
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schoolList = useMemo(() => {
    const q = schoolQuery.trim();
    if (!q) return SCHOOL_DUMMY;
    return SCHOOL_DUMMY.filter((s) => s.name.includes(q));
  }, [schoolQuery]);

  const clubList = useMemo(() => {
    const q = clubQuery.trim();
    if (!q) return CLUB_DUMMY;
    return CLUB_DUMMY.filter((c) => c.name.includes(q));
  }, [clubQuery]);

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
      >
        <ChevronLeft className="h-6 w-6 text-[#9E9E9E]" />
      </button>

      <p className="mt-6 text-center text-[22px] font-medium text-[#1A1A1A]">
        기본 정보를 작성해주세요
      </p>

      {/* 이메일/비번/이름 */}
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

      {/* 관리자 코드 */}
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
          placeholder="학교명 검색"
          value={schoolQuery}
          onChange={(e) => {
            setSchoolQuery(e.target.value);
            setSchoolId(null);
            setSchoolOpen(true);
            // 학교 바꾸면 동아리도 초기화
            setClubId(null);
            setClubQuery("");
          }}
          onFocus={() => {
            if (schoolId === null) setSchoolOpen(true);
          }}
          onBlur={() => {
            // 리스트 버튼 클릭이 먼저 먹고 닫히도록 약간 딜레이
            setTimeout(() => setSchoolOpen(false), 120);
          }}
        />

        {/* ✅ focus 중 && 아직 선택 전일 때만 회색 리스트 보여줌 */}
        {schoolOpen && schoolId === null ? (
          <div className="mt-3 rounded-[12px] bg-[#F7F7F7] px-6 py-5">
            <div className="space-y-4">
              {schoolList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSchoolId(s.id);
                    setSchoolQuery(s.name);
                    setSchoolOpen(false); // ✅ 선택하면 닫힘
                    // 동아리 입력 가능해지게
                    setClubOpen(true);
                  }}
                  className="block w-full text-left text-[14px] font-medium text-[#4F4F4F]"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* 동아리 */}
      <div className="mt-6">
        <input
          className="w-full rounded-[12px] border border-[#F2F2F2] px-6 py-4 text-[14px] text-[#4F4F4F] font-medium outline-none"
          placeholder="동아리 검색"
          value={clubQuery}
          onChange={(e) => {
            setClubQuery(e.target.value);
            setClubId(null);
            if (schoolId !== null) setClubOpen(true);
          }}
          onFocus={() => {
            if (schoolId !== null && clubId === null) setClubOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setClubOpen(false), 120);
          }}
          disabled={schoolId === null}
        />

        {/* ✅ focus 중 && 아직 선택 전일 때만 회색 리스트 */}
        {clubOpen && clubId === null && schoolId !== null ? (
          <div className="mt-3 rounded-[12px] bg-[#F7F7F7] px-6 py-5">
            <div className="space-y-4">
              {clubList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setClubId(c.id);
                    setClubQuery(c.name);
                    setClubOpen(false); // ✅ 선택하면 닫힘
                  }}
                  className="block w-full text-left text-[14px] font-medium text-[#4F4F4F]"
                >
                  {c.name}
                </button>
              ))}
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
