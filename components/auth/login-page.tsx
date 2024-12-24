"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F68E5F]">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-[900] uppercase text-[#0D324D] font-condensed">
            SCHEDULE
          </h1>
          
          <Button 
            onClick={() => loginWithRedirect()}
            className="w-full bg-[#0081A7] hover:bg-[#0081A7]/90 transition-all duration-150 px-8 py-6 text-lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}