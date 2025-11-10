"use client";
import React, { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllNews() {
      setLoading(true);
      try {
        const res = await fetch("/api/getallnews");
        if (!res.ok) throw new Error("Failed to fetch news");
        const { news } = await res.json();
        setNews(news || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllNews();
  }, []);

  if (loading) return <div className="p-6">Loading news...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="font-semibold text-lg mb-4">Latest News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {news.map((item, idx) => (
          <NewsCard
            key={item.link || idx}
            imageUrl={item.imageUrl}
            title={item.title}
            content={item.content}
            author={item.source}
            pubDate={item.pubDate}
            link={item.link}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}
