"use client";
import Achievement from "@/components/Achievement";
import { useState, useEffect } from "react";

export default function Achievements() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("http://localhost:3000/api/achievements");
      const data = await res.json();
      if (data.success) {
        organizeData(data.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  }

  function organizeData(achievements) {
    const grouped = achievements.reduce((acc, achievement) => {
      const category = achievement.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    }, {});

    const formattedOptions = Object.keys(grouped).map((category) => ({
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
    setIndex((prev) => (prev + 1) % options[categoryIndex].achievements.length);
  };

  const prevSlide = () => {
    setIndex(
      (prev) =>
        (prev - 1 + options[categoryIndex].achievements.length) %
        options[categoryIndex].achievements.length
    );
  };

  return (
    <div className="bg-white flex w-full min-h-[650px] rounded-xl p-4 flex-col transition-opacity">
      <div
        className={`duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition"
          >
            Select Achievement: {selectedOption || "Loading..."}
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-2">
              <ul className="py-2">
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(option.category)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option.category}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {options.length > 0 && (
          <div className="relative flex items-center justify-center overflow-hidden w-full min-w-[500px] mx-auto mt-8">
            <div
              className="flex transition-transform duration-500 w-full"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {options[categoryIndex].achievements.map((achievement, i) => (
                <div key={i} className="w-full flex-shrink-0 flex">
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
              className="absolute left-0 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-900 transition"
            >
              &#10094;
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-900 transition"
            >
              &#10095;
            </button>
          </div>
        )}

        {/* Indicators */}
        {options.length > 0 && options[categoryIndex] && (
          <div className="flex justify-center mt-4">
            {options[categoryIndex].achievements.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 mx-1 rounded-full ${
                  index === i ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}