"use client";
import { FaChevronDown, FaSearch, FaRegBookmark } from "react-icons/fa";
import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../util/supabase";
import { useCategory } from "@/context/CategoryContext";

const Header = ({ transparent = false }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { selectedCategories, toggleCategory, clearCategories } = useCategory();

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

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const { categories } = await res.json();
      setCategories(categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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
          {(!loadingUser && user) && (
            <nav className="hidden md:flex gap-6 text-gray-800 text-[16px]">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 font-medium hover:text-orange-600 transition cursor-pointer"
                >
                  Categories <FaChevronDown className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  {selectedCategories.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-semibold">Filter by Category</span>
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={clearCategories}
                          className="text-xs text-purple-600 hover:text-purple-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="p-2">
                      {categories.length === 0 ? (
                        <div className="text-sm text-gray-500 p-2">Loading categories...</div>
                      ) : (
                        categories.map((category) => {
                          const isSelected = selectedCategories.includes(category);
                          return (
                            <label
                              key={category}
                              className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleCategory(category)}
                                className="mr-2 accent-orange-600"
                              />
                              <span className="text-sm capitalize">{category}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/news" className="hover:text-orange-600 transition font-medium cursor-pointer">News</Link>
              <Link href="/suggestednews" className="hover:text-orange-600 transition font-medium cursor-pointer">Suggested</Link>
              <Link href="/contact" className="hover:text-orange-600 transition font-medium cursor-pointer">Contact Newsly</Link>
            </nav>
          )}
        </div>
        {/* Center: Fills whitespace (optional for future features) */}
        <div className="flex-1" />
        {/* Right section */}
        <div className="flex items-center gap-4">
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