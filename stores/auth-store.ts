"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TeacherUser } from "@/lib/types";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: TeacherUser | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: TeacherUser;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => {
        document.cookie = `bo_access_token=${accessToken}; path=/`;
        set({ accessToken, refreshToken, user });
      },
      clearSession: () => {
        document.cookie = "bo_access_token=; Max-Age=0; path=/";
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "backoffice-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
