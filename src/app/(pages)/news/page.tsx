"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [highlightedNews, setHighlightedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/news");
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

  if (loading) return <p>Loading news...</p>;
  if (!newsData.length) return <p>No news available.</p>;

  return (
    <div className="bg-white flex w-full max-h-[650px] rounded-xl">
      {/* Highlighted News */}
      <div className="flex-3 justify-center items-center p-4">
        {highlightedNews && (
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
        )}
      </div>

      {/* News List */}
      <div className="relative flex-1 overflow-y-auto">
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

        {/* Bottom Fade Effect */}
        <div className="sticky bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
