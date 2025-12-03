"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../../util/supabase";
import { useRouter } from "next/navigation";

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleSessionTimeout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSessionStartTime(null);
    // Clear cookie on logout
    if (typeof window !== 'undefined') {
      document.cookie = 'user-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
    router.push("/login");
  }, [router]);

  const resetSessionTimer = useCallback(() => {
    setSessionStartTime(Date.now());
  }, []);

  const checkSessionTimeout = useCallback(() => {
    const now = Date.now();
    if (sessionStartTime && now - sessionStartTime > SESSION_TIMEOUT) {
      handleSessionTimeout();
      return true;
    }
    return false;
  }, [sessionStartTime, handleSessionTimeout]);

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error || !session) {
      handleSessionTimeout();
      return false;
    }
    resetSessionTimer();
    return true;
  };

  const handleActivity = useCallback(() => {
    if (!checkSessionTimeout()) {
      resetSessionTimer();
    }
  }, [checkSessionTimeout, resetSessionTimer]);

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        resetSessionTimer();
        // Set a cookie for middleware to check
        if (typeof window !== 'undefined') {
          document.cookie = 'user-logged-in=true; path=/; max-age=86400; SameSite=Lax';
        }
      } else {
        // Clear cookie on logout
        if (typeof window !== 'undefined') {
          document.cookie = 'user-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      }
      setLoading(false);
    };

    initializeSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        resetSessionTimer();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSessionStartTime(null);
        // Clear cookie on sign out
        if (typeof window !== 'undefined') {
          document.cookie = 'user-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [resetSessionTimer]);

  useEffect(() => {
    if (!user || !sessionStartTime) return;

    const checkInterval = setInterval(() => {
      const isExpired = checkSessionTimeout();
      if (isExpired) {
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(checkInterval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, sessionStartTime, checkSessionTimeout, handleActivity]);

  const value = {
    user,
    loading,
    sessionStartTime,
    refreshSession,
    resetSessionTimer,
    checkSessionTimeout,
    handleSessionTimeout
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};