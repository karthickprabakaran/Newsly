"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../util/supabase"; // client anon key

const PREDEFINED_CATEGORIES = [
  "sports",
  "economics", 
  "politics",
  "international",
  "state",
  "gold",
  "finance",
  "technology",
  "entertainment",
  "health",
  "education",
  "business",
  "science",
  "weather",
  "lifestyle",
  "travel"
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser(authUser);

      const res = await fetch(`/api/profile?user_id=${authUser.id}`);
      if (res.ok) {
        const { user: profile } = await res.json();
        setName(profile.name || authUser.user_metadata?.full_name || "");
        setSelectedCategories(profile.suggested_news || []);
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("Not logged in");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_id: user.id, 
        name: name.trim(), 
        suggested_news: selectedCategories 
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown" }));
      setMessage(err.error || "Failed to update profile");
    } else {
      const { user: updated } = await res.json();
      setName(updated.name || name);
      setSelectedCategories(updated.suggested_news || []);
      setMessage("Profile updated successfully");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
      {!user && <div>Please login to view your profile.</div>}
      {user && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Categories Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your News Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PREDEFINED_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Select at least one category to receive personalized news
              </p>
            )}
            {selectedCategories.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {selectedCategories.length} category{selectedCategories.length > 1 ? 'ies' : ''} selected
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center space-x-4">
            <button 
              type="submit"
              disabled={saving} 
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes("success") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}