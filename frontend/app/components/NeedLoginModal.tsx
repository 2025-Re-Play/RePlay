// app/components/NeedLoginModal.tsx
"use client";

export default function NeedLoginModal({
  open,
  onClose,
  onGoLogin,
}: {
  open: boolean;
  onClose: () => void;
  onGoLogin: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-5">
        <p className="text-[16px] font-bold text-[#1A1A1A]">
          로그인이 필요한 기능입니다.
          <br />
          로그인하시겠습니까?
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#F2F2F2] py-3 text-[14px] font-bold text-[#9E9E9E]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onGoLogin}
            className="flex-1 rounded-xl bg-[#0EBC81] py-3 text-[14px] font-bold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
