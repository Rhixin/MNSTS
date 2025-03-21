"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

// Skeleton Loading Components
const SkeletonHighlight = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-4"></div>
    <div className="h-24 bg-gray-200 rounded-md"></div>
  </div>
);

const SkeletonPreview = () => (
  <div className="animate-pulse flex items-center p-4 border-b border-gray-100">
    <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
    </div>
  </div>
);

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [highlightedNews, setHighlightedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();

        if (data.success) {
          setNewsData(data.data);
          setHighlightedNews(data.data[0]); // Set first news as highlight
        } else {
          console.error("Failed to fetch news:", data.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Handle preview news click
  const handleNewsClick = (news) => {
    setHighlightedNews(news);
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!newsData.length && !loading) return (
    <div className="bg-white p-6 rounded-xl text-center">
      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No news available</h3>
      <p className="mt-2 text-sm text-gray-500">We couldn't find any news articles at this time.</p>
    </div>
  );

  return (
    <div className="bg-white flex w-full max-h-[650px] rounded-xl">
      {/* Highlighted News */}
      <div className="flex-3 justify-center items-center p-4">
        {loading ? (
          <SkeletonHighlight />
        ) : (
          highlightedNews && (
            <motion.div
              key={highlightedNews._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <HighlightNews
                title={highlightedNews.title}
                description={highlightedNews.content}
                date={new Date(highlightedNews.createdAt).toDateString()}
                image_path={
                  highlightedNews.images?.[0] || "images/placeholder.png"
                }
                author={highlightedNews.author}
              />
            </motion.div>
          )
        )}
      </div>

      {/* News List */}
      <div className="relative flex-1 overflow-y-auto">
        {loading ? (
          Array(5).fill().map((_, index) => (
            <SkeletonPreview key={index} />
          ))
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="show">
            {newsData.map((news) => (
              <motion.div key={news._id} variants={itemVariants}>
                <PreviewNews
                  title={news.title}
                  date={new Date(news.createdAt).toDateString()}
                  image_path={news.images?.[0] || "images/placeholder.png"}
                  onClick={() => handleNewsClick(news)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom Fade Effect */}
        <div className="sticky bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}