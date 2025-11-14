"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../util/supabase";
import { useCategory } from "@/context/CategoryContext";
import StandardNewsCard from "@/components/StandardNewsCard";
import SimpleNewsCard from "@/components/SimpleNewsCard";

const PAGE_SIZE = 20;

export default function NewsPage() {
  const router = useRouter();
  const { selectedCategories } = useCategory();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 1️⃣ Auth check
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2️⃣ Fetch all news once
  useEffect(() => {
    if (isCheckingAuth) return;

    async function fetchAllNews() {
      setLoading(true);
      try {
        // Always fetch a large number of articles (e.g., 1000) for client-side pagination
        const res = await fetch(`/api/getallnews?page=1&limit=1000`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const { news: fetchedNews } = await res.json();
        setAllNews(fetchedNews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllNews();
  }, [isCheckingAuth]);

  // 3️⃣ Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategories, searchTerm]);

  // 4️⃣ Filter news client-side
  const filteredNews = useMemo(() => {
    let filtered = allNews;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item.category) return false;
        const itemCategories = item.category
          .toLowerCase()
          .split(",")
          .map((c) => c.trim());
        return selectedCategories.some((selected) =>
          itemCategories.some(
            (cat) => cat.includes(selected) || selected.includes(cat),
          ),
        );
      });
    }

    // Filter by search term
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter((item) =>
        [item.title, item.content, item.source, item.category]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term)),
      );
    }

    return filtered;
  }, [allNews, searchTerm, selectedCategories]);

  // 5️⃣ Client-side pagination
  const paginatedNews = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredNews.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredNews, page]);

  const filteredTotalPages = Math.ceil(filteredNews.length / PAGE_SIZE) || 1;

  if (isCheckingAuth) return null;
  if (loading) return <div className="p-6">Loading news...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="font-semibold text-lg">Latest News</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search news by title, source, or keywords"
          className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* News Grid */}
      {paginatedNews.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          {selectedCategories.length > 0 || searchTerm
            ? "No news matched your filters."
            : "No news available."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedNews.map((item, idx) =>
            item.imageUrl && item.source !== "Economic Times" ? (
              <StandardNewsCard
                key={item.link || idx}
                imageUrl={item.imageUrl}
                title={item.title}
                content={item.content}
                author={item.source}
                pubDate={item.pubDate}
                link={item.link}
                category={item.category}
              />
            ) : (
              <SimpleNewsCard
                key={item.link || idx}
                title={item.title}
                content={item.content}
                author={item.source}
                pubDate={item.pubDate}
                link={item.link}
                category={item.category}
              />
            ),
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredNews.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="px-3 py-1 rounded disabled:bg-gray-200 bg-gray-100 font-bold text-black"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="font-medium">
            {page} / {filteredTotalPages}
          </span>
          <button
            className="px-3 py-1 rounded disabled:bg-gray-200 bg-gray-100 font-bold text-black"
            disabled={page >= filteredTotalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
