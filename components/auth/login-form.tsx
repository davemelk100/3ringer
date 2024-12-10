"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function LoginForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/schedule");
    }
  }, [mounted, isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a 6-character code");
      return;
    }

    if (code.toUpperCase() === "HOGGIN") {
      login();
      router.push("/schedule");
    } else {
      setError("Invalid code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 6)
      .toUpperCase();
    setCode(value);
    setError("");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F68E5F] mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-[900] uppercase text-[#0D324D] font-condensed">
            SCHEDULE
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter Code"
              value={code}
              onChange={handleChange}
              className="text-center text-2xl tracking-widest h-12"
              maxLength={6}
              aria-label="Enter code"
              autoCapitalize="characters"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0D324D] hover:bg-[#0D324D]/90"
            disabled={code.length !== 6}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}