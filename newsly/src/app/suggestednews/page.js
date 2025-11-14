"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import StandardNewsCard from "@/components/StandardNewsCard";

export default function SuggestedNewsPage() {
  const router = useRouter();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [suggestedNews, setSuggestedNews] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    fetchSuggestedNews();
  }, [user, router]);

  const fetchSuggestedNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user's suggested categories from profile
      const profileResponse = await fetch(`/api/profile?user_id=${user.id}`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const profileData = await profileResponse.json();
      const categories = profileData.user?.suggested_news || [];
      setSuggestedCategories(categories);

      // If no suggested categories, show empty state
      if (categories.length === 0) {
        setSuggestedNews([]);
        setLoading(false);
        return;
      }

      // Fetch news specifically for user's categories
      const categoriesString = categories.join(',');
      const newsResponse = await fetch(`/api/suggestednews?categories=${encodeURIComponent(categoriesString)}`);
      if (!newsResponse.ok) {
        throw new Error('Failed to fetch suggested news');
      }
      
      const newsData = await newsResponse.json();
      
      if (newsData.error) {
        throw new Error(newsData.error);
      }

      setSuggestedNews(newsData.news || []);

    } catch (error) {
      console.error('Error fetching suggested news:', error);
      setError('Failed to load suggested news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-primary">Loading suggested news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Suggested News</h2>
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Suggested News</h2>
        
        {suggestedCategories.length > 0 && (
          <div className="mb-6">
            <p className="text-text-primary mb-4">Showing news for your suggested categories:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedCategories.map((category, index) => (
                <span 
                  key={index}
                  className="category-tag"
                >
                  {category}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              News fetched from category-specific sources for better relevance
            </p>
          </div>
        )}

        {suggestedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-4">No Suggested Categories</h3>
              <p className="text-text-primary mb-6">
                You haven't set up any suggested news categories yet. Update your profile to see personalized news here.
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="btn-primary"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : suggestedNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-4">No News Found</h3>
              <p className="text-text-primary">
                No news articles found for your suggested categories at the moment. Check back later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedNews.map((article, index) => (
              <StandardNewsCard 
                key={article.id || index}
                title={article.title}
                content={article.content}
                link={article.link}
                category={article.category}
                imageUrl={article.imageUrl}
                author={article.source}
                pubDate={article.pubDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}