"use client";
import { FaChevronDown, FaSearch, FaRegBookmark } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../util/supabase";

const Header = ({ transparent = false }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoadingUser(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className={`w-full ${transparent ? 'bg-transparent shadow-none' : 'bg-white shadow-sm'} px-8 transition-colors duration-300`}>
      <div className="max-w-[1440px] mx-auto flex items-center h-16 justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/" className="text-orange-600 font-bold text-xl">Newsly</Link>
          <nav className="hidden md:flex gap-6 text-gray-800 text-[16px]">
            <div className="relative group cursor-pointer flex items-center gap-1 font-medium">
              Categories <FaChevronDown className="text-xs" />
            </div>
            <Link href="/news" className="hover:text-orange-600 transition font-medium cursor-pointer">News</Link>
            <Link href="/suggestednews" className="hover:text-orange-600 transition font-medium cursor-pointer">Suggested</Link>
            <Link href="/contact" className="hover:text-orange-600 transition font-medium cursor-pointer">Contact Newsly</Link>
          </nav>
        </div>
        {/* Center: Fills whitespace (optional for future features) */}
        <div className="flex-1" />
        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search box - show only when logged in */}
          {!loadingUser && user && (
            <div className="bg-gray-100 flex items-center rounded-xl px-4 py-1 w-[220px] max-w-xs">
              <input
                type="text"
                placeholder="Search Anything"
                className="bg-gray-100 outline-none flex-1 text-sm py-1"
              />
              <FaSearch className="text-xl text-gray-700 ml-2" />
            </div>
          )}
          {/* User card or auth buttons */}
          {loadingUser ? null : user ? (
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-xl">
              <img
                src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.full_name || user.email || "User")}
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-sm font-medium text-gray-900 px-1">{user?.user_metadata?.full_name || user.email}</span>
              <button onClick={handleLogout} className="text-xs text-purple-600 underline ml-2">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Sign up
              </Link>
            </div>
          )}
          {/* Bookmark icon - only for logged in users */}
          {!loadingUser && user && (
            <div className="bg-gray-100 p-2 rounded-xl flex items-center cursor-pointer">
              <FaRegBookmark className="text-xl text-gray-700" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;