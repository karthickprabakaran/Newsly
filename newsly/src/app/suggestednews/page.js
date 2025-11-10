"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../util/supabase";

export default function SuggestedNewsPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  if (isCheckingAuth) return null;

  return (
    <div className="p-6">
      <h2 className="font-semibold text-lg mb-4">Suggested News</h2>
      <p className="text-gray-600">Suggested news content will appear here.</p>
    </div>
  );
}

