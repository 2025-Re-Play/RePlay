"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/app/lib/auth";

export default function SignupRoleScreen() {
  const { signupRole, setSignupRole, openSignupForm, goBackAuth } = useAuth();

  // ✅ 네가 준비할 svg 파일들 (원하는 파일명으로 바꿔도 됨)
  const ADMIN_ICON_OFF = "/signup/admin-off.svg";
  const ADMIN_ICON_ON = "/signup/admin-on.svg";
  const USER_ICON_OFF = "/signup/user-off.svg";
  const USER_ICON_ON = "/signup/user-on.svg";

  return (
    <div className="flex h-full flex-col bg-white px-6 pb-10 pt-16">
      {/* 뒤로(직전 화면) */}
      <button
        type="button"
        onClick={goBackAuth}
        className="mb-8 inline-flex items-center justify-start"
        aria-label="뒤로"
      >
        <ChevronLeft className="h-6 w-6 text-[#9E9E9E]" />
      </button>

      <p className="mt-10 text-center text-[22px] font-medium text-[#1A1A1A]">
        당신의 역할을 골라주세요
      </p>

      <div className="mt-10 grid grid-cols-2 items-start gap-4">
        {/* 관리자 */}
        <button
            type="button"
            onClick={() => setSignupRole("ADMIN")}
            className="flex flex-col rounded-[20px] p-4"
        >
            <div className="relative h-[180px] w-full overflow-hidden rounded-[16px]">
            <Image
                src={signupRole === "ADMIN" ? ADMIN_ICON_ON : ADMIN_ICON_OFF}
                alt="관리자"
                fill
                className="object-contain"
                priority
            />
            </div>

            {/* ✅ 텍스트 영역 높이 고정 */}
            <div className="mt-3 min-h-[48px]">
            <p className="text-center text-[16px] font-medium text-[#1A1A1A]">관리자</p>
            <p className="text-center text-[16px] font-medium text-[#1A1A1A]">(극단장, 극회장 등)</p>
            </div>
        </button>

        {/* 이용자 */}
        <button
            type="button"
            onClick={() => setSignupRole("USER")}
            className="flex flex-col rounded-[20px] p-4"
        >
            <div className="relative h-[180px] w-full overflow-hidden rounded-[16px]">
            <Image
                src={signupRole === "USER" ? USER_ICON_ON : USER_ICON_OFF}
                alt="이용자"
                fill
                className="object-contain"
                priority
            />
            </div>

            {/* ✅ 관리자랑 같은 높이를 맞추기 위해 2줄 구조 유지 */}
            <div className="mt-3 min-h-[48px]">
            <p className="text-center text-[16px] font-medium text-[#1A1A1A]">이용자</p>
            <p className="text-center text-[16px] font-medium text-transparent">.</p>
            </div>
        </button>
        </div>


      <button
        type="button"
        onClick={openSignupForm}
        className="mt-auto w-full rounded-[16px] bg-[#0EBC81] py-4 text-[16px] font-bold text-white"
      >
        다음으로
      </button>
    </div>
  );
}
