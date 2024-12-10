"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => {
        Cookies.set("auth", "true", { expires: 1 }); // Expires in 1 day
        set({ isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove("auth");
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);