"use client";
import React, { useEffect, useState } from "react";
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

  if (isCheckingAuth) return null;
  if (loading) return <div className="p-6">Loading news...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="font-semibold text-lg mb-4">Latest News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {news.map((item, idx) => 
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
