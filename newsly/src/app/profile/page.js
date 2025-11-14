"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../util/supabase"; // client anon key

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [suggested, setSuggested] = useState("");
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
        setSuggested((profile.suggested_news || []).join(", "));
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("Not logged in");
    setSaving(true);

    const catsArray = suggested.split(",").map((s) => s.trim()).filter(Boolean);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, name: name.trim(), suggested_news: catsArray }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown" }));
      setMessage(err.error || "Failed to update profile");
    } else {
      const { user: updated } = await res.json();
      setName(updated.name || name);
      setSuggested((updated.suggested_news || []).join(", "));
      setMessage("Profile updated successfully");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      {!user && <div>Please login to view your profile.</div>}
      {user && (
        <form onSubmit={handleSave} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border p-2 w-full"/>
          <input value={suggested} onChange={(e) => setSuggested(e.target.value)} placeholder="Suggested categories" className="border p-2 w-full"/>
          <button disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded">{saving ? "Saving..." : "Save changes"}</button>
          {message && <div>{message}</div>}
        </form>
      )}
    </div>
  );
}