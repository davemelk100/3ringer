"use client";

import { ThemeProvider } from './theme-provider';
import { AuthProvider } from '../auth/auth-provider';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        forcedTheme="light"
        storageKey="schedule-theme"
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}