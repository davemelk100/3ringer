"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function EnterSiteButton() {
  const router = useRouter();
  const { login } = useAuth();

  const handleClick = () => {
    login();
    router.push("/schedule");
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F68E5F] mx-auto mb-4">
        <Calendar className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-[900] uppercase text-[#0D324D] font-condensed mb-8">
        SCHEDULE
      </h1>
      <Button 
        onClick={handleClick}
        className="bg-[#0081A7] hover:bg-[#0081A7]/90 transition-all duration-150 px-8 py-6 text-lg"
      >
        Enter Site
      </Button>
    </div>
  );
}