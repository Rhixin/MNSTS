"use client";
import { useState, useEffect, useMemo } from "react";
import Achievement from "@/components/Achievement";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Achievements() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/achievements");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        organizeData(data.data);
      } else {
        setError(data.message || "Failed to load achievements");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Unable to load achievements. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function organizeData(achievements) {
    const grouped = achievements.reduce((acc, achievement) => {
      const category = achievement.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    }, {});

    const formattedOptions = Object.keys(grouped)
      .sort() // Sort categories alphabetically
      .map((category) => ({
        category,
        achievements: grouped[category],
      }));

    setOptions(formattedOptions);
    if (formattedOptions.length > 0) {
      setSelectedOption(formattedOptions[0].category);
      setCategoryIndex(0);
    }
  }

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIndex(0);
    setCategoryIndex(options.findIndex((opt) => opt.category === option));
  };

  const nextSlide = () => {
    if (!currentAchievements.length) return;
    setIndex((prev) => (prev + 1) % currentAchievements.length);
  };

  const prevSlide = () => {
    if (!currentAchievements.length) return;
    setIndex(
      (prev) =>
        (prev - 1 + currentAchievements.length) % currentAchievements.length
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Using useMemo to avoid unnecessary calculations on rerenders
  const currentAchievements = useMemo(() => {
    if (options.length === 0 || categoryIndex >= options.length) return [];
    return options[categoryIndex].achievements || [];
  }, [options, categoryIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentAchievements.length]);

  if (isLoading) {
    return (
      <div className="bg-white flex w-full min-h-[300px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] rounded-xl p-4 flex-col items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-[rgb(14,175,103)] border-r-[rgb(14,175,103)] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white flex w-full min-h-[300px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] rounded-xl p-4 flex-col items-center justify-center">
        <div className="text-red-500 text-lg sm:text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={fetchData}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white flex w-full min-h-[300px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] rounded-xl p-3 sm:p-4 flex-col shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="relative inline-block text-left dropdown-container mb-4 sm:mb-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition hover:opacity-90 flex items-center justify-between"
          >
            <span className="truncate max-w-[200px]">
              {selectedOption || "Select Category"}
            </span>
            <svg
              className="w-4 h-4 ml-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-full sm:w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              <ul className="py-2">
                {options.map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(option.category)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      option.category === selectedOption
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{option.category}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({option.achievements.length})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {currentAchievements.length > 0 ? (
        <>
          <div className="relative flex items-center justify-center overflow-hidden w-full mx-auto mt-2">
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {currentAchievements.map((achievement, i) => (
                <div key={i} className="w-full flex-shrink-0 flex px-2 sm:px-4">
                  <Achievement
                    title={achievement.headline}
                    description={achievement.description}
                    image_path={achievement.image_path}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 sm:left-2 bg-gray-800/30 hover:bg-gray-800/70 text-white p-1 sm:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(14,175,103)]"
              aria-label="Previous achievement"
            >
              <ChevronLeft size={20} className="sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 sm:right-2 bg-gray-800/30 hover:bg-gray-800/70 text-white p-1 sm:p-2 rounded-full transition transform -translate-y-1/2 top-1/2 focus:outline-none focus:ring-2 focus:ring-[rgb(14,175,103)]"
              aria-label="Next achievement"
            >
              <ChevronRight size={20} className="sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-4 sm:mt-6">
            {currentAchievements.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 mx-1 sm:mx-1.5 rounded-full transition-all duration-300 ${
                  index === i
                    ? "bg-[rgb(14,175,103)] scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Go to achievement ${i + 1}`}
              />
            ))}
          </div>

          {/* Achievement counter */}
          <div className="text-center mt-2 sm:mt-4 text-gray-500 text-sm sm:text-base">
            {index + 1} of {currentAchievements.length}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow py-6 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-4">🏆</div>
          <p className="text-lg sm:text-xl text-gray-600 mb-2 text-center">
            No achievements found in this category
          </p>
          <p className="text-gray-500 text-center">
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
}
