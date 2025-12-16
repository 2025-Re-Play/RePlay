"use client";

import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { loginApi, signupApi, SignupReq } from "../lib/authApi";

type PendingAction = null | (() => void);
type AuthScreen = "none" | "login" | "signupRole" | "signupForm";

type AuthContextValue = {
  token: string | null;
  isLoggedIn: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (body: SignupReq) => Promise<void>;
  logout: () => void;

  requireLogin: (action: () => void) => void;

  authScreen: AuthScreen;

  openLogin: () => void;
  openSignupRole: () => void;
  openSignupForm: () => void;

  closeAuth: () => void;
  goBackAuth: () => void; // ✅ 뒤로(직전 화면)

  needLoginOpen: boolean;
  closeNeedLogin: () => void;
  goLoginFromModal: () => void;

  signupRole: "USER" | "ADMIN";
  setSignupRole: (r: "USER" | "ADMIN") => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window === "undefined" ? null : localStorage.getItem("replay_token"),
  );
  const isLoggedIn = !!token;

  // ✅ auth 화면 스택 (뒤로가기용)
  const [authStack, setAuthStack] = useState<AuthScreen[]>(["none"]);
  const authScreen = authStack[authStack.length - 1];

  const pendingRef = useRef<PendingAction>(null);
  const [needLoginOpen, setNeedLoginOpen] = useState(false);

  const [signupRole, setSignupRole] = useState<"USER" | "ADMIN">("USER");

  const pushAuth = (next: AuthScreen) => {
    setAuthStack((prev) => {
      const cur = prev[prev.length - 1];
      if (cur === next) return prev;
      return [...prev, next];
    });
  };

  const closeAuth = () => setAuthStack(["none"]);

  const goBackAuth = () => {
    setAuthStack((prev) => {
      if (prev.length <= 1) return ["none"];
      const next = prev.slice(0, prev.length - 1);
      return next.length ? next : ["none"];
    });
  };

  const login = async (email: string, password: string) => {
    const t = await loginApi({ email, password });
    setToken(t);
    localStorage.setItem("replay_token", t);

    const act = pendingRef.current;
    pendingRef.current = null;

    closeAuth();
    setNeedLoginOpen(false);

    if (act) act();
  };

  const signup = async (body: SignupReq) => {
    const t = await signupApi(body);
    setToken(t);
    localStorage.setItem("replay_token", t);

    const act = pendingRef.current;
    pendingRef.current = null;

    closeAuth();
    setNeedLoginOpen(false);

    if (act) act();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("replay_token");
  };

  const requireLogin = (action: () => void) => {
    if (isLoggedIn) {
      action();
      return;
    }
    pendingRef.current = action;
    setNeedLoginOpen(true);
  };

  const openLogin = () => pushAuth("login");
  const openSignupRole = () => pushAuth("signupRole");
  const openSignupForm = () => pushAuth("signupForm");

  const closeNeedLogin = () => setNeedLoginOpen(false);
  const goLoginFromModal = () => {
    setNeedLoginOpen(false);
    openLogin();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isLoggedIn,
      login,
      signup,
      logout,
      requireLogin,

      authScreen,
      openLogin,
      openSignupRole,
      openSignupForm,
      closeAuth,
      goBackAuth,

      needLoginOpen,
      closeNeedLogin,
      goLoginFromModal,

      signupRole,
      setSignupRole,
    }),
    [token, isLoggedIn, authScreen, needLoginOpen, signupRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("AuthProvider로 감싸야 함");
  return v;
}
