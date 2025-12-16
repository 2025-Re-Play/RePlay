import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "리플레이",
  description: "대학 공연 소품 순환 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen justify-center bg-slate-100">
        {/* 폰 프레임 */}
        <div className="w-full max-w-[420px] h-screen bg-slate-50 shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

