"use client";
import { FaChevronDown } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useCategory } from "@/context/CategoryContext";

const Header = ({ transparent = false }) => {
  const router = useRouter();
  const { user, loading: loadingUser, handleSessionTimeout } = useSession();
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { selectedCategories, toggleCategory, clearCategories } = useCategory();

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const { categories } = await res.json();
      setCategories(categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleLogout = async () => {
    handleSessionTimeout();
  };

  return (
    <header
      className={`w-full  bg-surface shadow-sm transition-colors duration-300 top-0 z-50`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="text-primary font-bold text-xl">
            Newsly
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Navigation - visible to logged in users */}
          {!loadingUser && user && (
            <nav className="hidden lg:flex items-center gap-6">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 font-medium text-text-primary hover:text-primary transition cursor-pointer"
                >
                  Categories{" "}
                  <FaChevronDown
                    className={`text-xs transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                  {selectedCategories.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-default rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-default flex justify-between items-center">
                      <span className="text-sm font-semibold text-text-primary">
                        Filter by Category
                      </span>
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={clearCategories}
                          className="text-xs text-primary hover:text-primary-dark"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="p-2">
                      {categories.length === 0 ? (
                        <div className="text-sm text-text-secondary p-2">
                          Loading categories...
                        </div>
                      ) : (
                        categories.map((category) => {
                          const isSelected =
                            selectedCategories.includes(category);
                          return (
                            <label
                              key={category}
                              className="flex items-center p-2 hover:bg-background cursor-pointer rounded"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleCategory(category)}
                                className="mr-2 accent-primary"
                              />
                              <span className="text-sm capitalize text-text-primary">
                                {category}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/news"
                className="text-text-primary hover:text-primary transition font-medium cursor-pointer"
              >
                News
              </Link>
              <Link
                href="/suggestednews"
                className="text-text-primary hover:text-primary transition font-medium cursor-pointer"
              >
                Suggested
              </Link>
              <Link
                href="/contact"
                className="text-text-primary hover:text-primary transition font-medium cursor-pointer"
              >
                Contact
              </Link>
            </nav>
          )}

          {/* Contact link - visible to all users when not logged in */}
          {loadingUser || !user ? (
            <Link
              href="/contact"
              className="text-sm font-medium text-text-primary hover:text-primary"
            >
              Contact
            </Link>
          ) : null}

          {/* User card or auth buttons */}
          {loadingUser ? null : user ? (
            <div
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl cursor-pointer hover:shadow-md transition-all"
            >
              <img
                src={
                  user?.user_metadata?.avatar_url ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      user?.user_metadata?.full_name || user.email || "User",
                    )
                }
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-sm font-medium text-text-primary px-1">
                {user?.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="text-xs text-primary hover:text-primary-dark ml-2 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary"
              >
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-surface z-50 pt-16">
          <div className="p-4 space-y-4">
            {!loadingUser && user && (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 font-medium text-text-primary hover:text-primary transition cursor-pointer w-full justify-between"
                  >
                    Categories{" "}
                    <FaChevronDown
                      className={`text-xs transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    />
                    {selectedCategories.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-default rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-default flex justify-between items-center">
                        <span className="text-sm font-semibold text-text-primary">
                          Filter by Category
                        </span>
                        {selectedCategories.length > 0 && (
                          <button
                            onClick={clearCategories}
                            className="text-xs text-primary hover:text-primary-dark"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="p-2">
                        {categories.length === 0 ? (
                          <div className="text-sm text-text-secondary p-2">
                            Loading categories...
                          </div>
                        ) : (
                          categories.map((category) => {
                            const isSelected =
                              selectedCategories.includes(category);
                            return (
                              <label
                                key={category}
                                className="flex items-center p-2 hover:bg-background cursor-pointer rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleCategory(category)}
                                  className="mr-2 accent-primary"
                                />
                                <span className="text-sm capitalize text-text-primary">
                                  {category}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/news"
                  className="block text-text-primary hover:text-primary transition font-medium cursor-pointer py-2"
                >
                  News
                </Link>
                <Link
                  href="/suggestednews"
                  className="block text-text-primary hover:text-primary transition font-medium cursor-pointer py-2"
                >
                  Suggested
                </Link>
                <Link
                  href="/contact"
                  className="block text-text-primary hover:text-primary transition font-medium cursor-pointer py-2"
                >
                  Contact
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

