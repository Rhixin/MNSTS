"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

// Skeleton Loading Components
const SkeletonHighlight = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
  </div>
);

const SkeletonPreview = () => (
  <div className="animate-pulse flex items-start p-4 border-b border-gray-100">
    <div className="w-24 h-24 bg-gray-200 rounded-md mr-4"></div>
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
  const [error, setError] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for filtering (to be dynamically generated from news data)
  const [categories, setCategories] = useState(["all"]);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news");
        const data = await response.json();

        if (data.success) {
          setNewsData(data.data);
          setHighlightedNews(data.data[0]); // Set first news as highlight

          // Extract unique categories from news data
          const uniqueCategories = [
            "all",
            ...new Set(data.data.map((item) => item.category).filter(Boolean)),
          ];
          setCategories(uniqueCategories);
        } else {
          setError(data.message || "Failed to fetch news");
          console.error("Failed to fetch news:", data.message);
        }
      } catch (error) {
        setError("Error connecting to news service");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on category and search query
  const filteredNews = newsData.filter((news) => {
    const matchesCategory =
      filteredCategory === "all" || news.category === filteredCategory;
    const matchesSearch =
      searchQuery === "" ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (news.content &&
        news.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Separate featured and regular news
  const featuredNews = filteredNews.slice(0, 1);
  const secondaryNews = filteredNews.slice(1, 3);
  const regularNews = filteredNews.slice(3);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Handle news click
  const handleNewsClick = (news) => {
    setSelectedArticle(news);
    setShowModal(true);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Render error state
  if (error)
    return (
      <div className="bg-white p-6 rounded-xl text-center shadow-md">
        <svg
          className="w-16 h-16 mx-auto text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Unable to load news
        </h3>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="bg-white w-full shadow-sm">
      {/* Masthead / Header */}
      <div className="bg-green-800 text-white py-3 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Sci-Tech News</h1>
          </div>
          <div className="text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Navigation / Categories */}
      <div className="border-b border-gray-200 sticky top-0 bg-white  shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-3 gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilteredCategory(category)}
                className={`px-4 py-1 mx-1 text-sm font-medium border-b-2 transition ${
                  filteredCategory === category
                    ? "border-blue-500 text-blue-800"
                    : "border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                {category === "all"
                  ? "All News"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SkeletonHighlight />
          </div>
          <div className="md:col-span-1 space-y-4">
            <SkeletonPreview />
            <SkeletonPreview />
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="container mx-auto p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery ? "No matching news found" : "No news available"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery
              ? `We couldn't find any news matching "${searchQuery}"`
              : "We couldn't find any news articles at this time."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          {/* Featured Section */}
          {featuredNews.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Breaking News
                </h2>
                <div className="ml-3 h-0.5 flex-grow bg-gray-200"></div>
              </div>
              <div className="relative group overflow-hidden rounded-lg shadow-lg">
                <div className="relative h-96 overflow-hidden bg-gray-900">
                  <img
                    src={
                      featuredNews[0].images?.[0] || "/images/placeholder.png"
                    }
                    alt={featuredNews[0].title}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold uppercase rounded-sm mb-3 inline-block">
                      {featuredNews[0].category || "Feature"}
                    </span>
                    <h2 className="text-3xl font-bold mb-2">
                      {featuredNews[0].title}
                    </h2>
                    <p className="mb-3 text-gray-200 line-clamp-2">
                      {featuredNews[0].content}
                    </p>
                    <div className="flex items-center text-sm text-gray-300">
                      <span>{featuredNews[0].author || "Staff Reporter"}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(featuredNews[0].createdAt).toDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNewsClick(featuredNews[0])}
                  className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  aria-label={`Read more about ${featuredNews[0].title}`}
                />
              </div>
            </div>
          )}

          {/* Top Stories Section */}
          {secondaryNews.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top Stories</h2>
                <div className="ml-3 h-0.5 flex-grow bg-gray-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryNews.map((news) => (
                  <div
                    key={news._id}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={news.images?.[0] || "/images/placeholder.png"}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 m-3">
                        <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold uppercase rounded-sm">
                          {news.category || "News"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {news.content}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{news.author || "Staff Reporter"}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(news.createdAt).toDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNewsClick(news)}
                      className="absolute inset-0 w-full h-full cursor-pointer z-10"
                      aria-label={`Read more about ${news.title}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Latest News Section */}
          {regularNews.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                <div className="ml-3 h-0.5 flex-grow bg-gray-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {regularNews.map((news) => (
                  <div
                    key={news._id}
                    className="flex flex-col relative border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={news.images?.[0] || "/images/placeholder.png"}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 m-2">
                        <span className="bg-gray-800 text-white px-2 py-0.5 text-xs font-medium rounded-sm">
                          {news.category || "News"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {news.content}
                      </p>
                    </div>
                    <div className="px-4 pb-4 text-xs text-gray-500 mt-auto">
                      <span>{new Date(news.createdAt).toDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleNewsClick(news)}
                      className="absolute inset-0 w-full h-full cursor-pointer z-10"
                      aria-label={`Read more about ${news.title}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* News Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="relative">
              <div className="h-96 md:h-120 w-full overflow-hidden">
                <img
                  src={selectedArticle.images?.[0] || "/images/placeholder.png"}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute -bottom-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold uppercase rounded-full shadow-md">
                  {selectedArticle.category || "News"}
                </span>
              </div>
            </div>

            <div className="p-6 pt-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center text-gray-500 mb-6">
                <div className="flex items-center">
                  <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <span className="text-sm font-semibold text-gray-600">
                      {(selectedArticle.author || "Staff")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedArticle.author || "Staff Reporter"}
                  </span>
                </div>
                <span className="mx-2">•</span>
                <span className="text-sm">
                  {new Date(selectedArticle.createdAt).toDateString()}
                </span>
                <span className="mx-2">•</span>
                <span className="text-sm">
                  {new Date(selectedArticle.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}