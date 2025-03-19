'use client';

import { useEffect, useState } from 'react';
import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

export default function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch news articles when component mounts
    const fetchNewsArticles = async () => {
      try {
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNewsArticles(data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsArticles();
  }, []);

  // Get the latest news article for the highlight
  const highlightArticle = newsArticles.length > 0 ? newsArticles[0] : null;
  // Get the rest for the preview list
  const previewArticles = newsArticles.length > 1 ? newsArticles.slice(1) : [];

  if (loading) {
    return (
      <div className="text-black bg-white flex w-full h-[700px] rounded-xl overflow-hidden shadow-sm justify-center items-center">
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-black bg-white flex w-full h-[700px] rounded-xl overflow-hidden shadow-sm justify-center items-center">
        <p>Error loading news: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex w-full h-[700px] rounded-xl overflow-hidden shadow-sm">
      {/* Main featured news - with more space */}
      <div className="w-2/3 p-6 overflow-hidden flex flex-col">
        {highlightArticle ? (
          <HighlightNews
            title={highlightArticle.title}
            description={highlightArticle.content}
            author={highlightArticle.author}
            date={new Date(highlightArticle.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            image_path={highlightArticle.images && highlightArticle.images.length > 0 
              ? highlightArticle.images[0] 
              : "images/school_image.png"}
          />
        ) : (
          <p>No featured news available</p>
        )}
      </div>

      {/* News list - with equal spacing */}
      <div className="w-1/3 border-l border-gray-200">
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col divide-y divide-gray-200">
            {previewArticles.length > 0 ? (
              previewArticles.map((article) => (
                <PreviewNews
                  key={article._id}
                  title={article.title}
                  date={new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  image_path={article.images && article.images.length > 0 
                    ? article.images[0] 
                    : "images/school_image.png"}
                />
              ))
            ) : (
              <p className="p-4 text-black">No additional news articles available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}