"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../util/supabase";
import StandardNewsCard from "@/components/StandardNewsCard";
import SimpleNewsCard from "@/components/SimpleNewsCard";

const PAGE_SIZE = 20;

export default function NewsPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    if (isCheckingAuth) return;
    async function fetchAllNews(pageNum) {
      setLoading(true);
      try {
        const res = await fetch(`/api/getallnews?page=${pageNum}&limit=${PAGE_SIZE}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const { news, totalPages: tp } = await res.json();
        setNews(news || []);
        setTotalPages(tp || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllNews(page);
  }, [page, isCheckingAuth]);

  const filteredNews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return news;
    return news.filter((item) =>
      [item.title, item.content, item.source, item.category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [news, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isCheckingAuth) return null;
  if (loading) return <div className="p-6">Loading news...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="font-semibold text-lg">Latest News</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search news by title, source, or keywords"
          className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {filteredNews.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No news matched your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNews.map((item, idx) =>
            item.source === "Times of India" ? (
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
            )
          )}
        </div>
      )}
      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-3 py-1 rounded disabled:bg-gray-200 bg-gray-100 font-bold text-black"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="font-medium">{page} / {totalPages}</span>
        <button
          className="px-3 py-1 rounded disabled:bg-gray-200 bg-gray-100 font-bold text-black"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
