"use client";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/schedule");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Schedule</h1>
        <button
          onClick={() => loginWithRedirect()}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold 
                   hover:bg-blue-700 transition-colors duration-200 shadow-lg"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
