// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import HomeScreen from "@/app/screens/HomeScreen";
import SplashScreen from "@/app/screens/SplashScreen";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return <SplashScreen onSkip={() => setShowSplash(false)} />;
  }

  return <HomeScreen />;
}
