"use client";

import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>(() => ({
  isAuthenticated: true,
  login: () => {},
  logout: () => {}
}));