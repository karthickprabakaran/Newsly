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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading suggested news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="font-semibold text-lg mb-4">Suggested News</h2>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-semibold text-2xl mb-4">Suggested News</h2>
        
        {suggestedCategories.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Showing news for your suggested categories:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full capitalize"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {suggestedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Suggested Categories</h3>
              <p className="text-gray-600 mb-4">
                You haven't set up any suggested news categories yet. Update your profile to see personalized news here.
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : suggestedNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No News Found</h3>
              <p className="text-gray-600">
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