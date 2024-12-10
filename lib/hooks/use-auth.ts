"use client";

import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: () => {
    Cookies.set("auth", "true", { 
      expires: 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    set({ isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove("auth", { path: "/" });
    set({ isAuthenticated: false });
  }
}));