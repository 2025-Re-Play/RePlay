"use client";

import { useEffect } from "react";

type Notification = {
  id: number;
  section: "물품 점검" | "게시판" | "대여 및 거래";
  text: string;
};

export default function NotificationDrawer({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: Notification[];
}) {
  // ESC로 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sections: Array<Notification["section"]> = ["물품 점검", "게시판", "대여 및 거래"];

  return (
    <div className="fixed inset-0 z-[60]">
      {/* 배경(클릭하면 닫힘) */}
      <button
        type="button"
        aria-label="알림 닫기"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* 오른쪽 패널 */}
      <aside className="absolute right-0 top-20 h-[620px] w-[78%] max-w-[360px] bg-white shadow-xl">
        <div className="h-0" /> {/* AppHeader 높이만큼 띄우기 */}

        <div className="px-6 pt-6">
          {sections.map((sec) => {
            const list = items.filter((x) => x.section === sec);
            if (list.length === 0) return null;

            return (
              <section key={sec} className="mb-8">
                <p className="text-[16px] font-bold text-[#D1D6DB]">{sec}</p>

                <div className="mt-4 space-y-3">
                  {list.map((n) => (
                    <p key={n.id} className="text-[16px] font-medium text-[#1A1A1A]">
                      {n.text}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
