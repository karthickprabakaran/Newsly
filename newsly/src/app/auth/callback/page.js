"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../util/supabase";
import { useSession } from "@/context/SessionContext";

const AuthCallback = () => {
  const router = useRouter();
  const { resetSessionTimer } = useSession();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        router.push("/login");
        return;
      }

      if (data.session) {
        resetSessionTimer();
        router.push("/news");
      } else {
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router, resetSessionTimer]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;