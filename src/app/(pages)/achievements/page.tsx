"use client";
import Achievement from "@/components/Achievement";
import { useState } from "react";

export default function Achievements() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(
    "Athletics, Recreation, & Wellness"
  );

  function getCategoryIndex(categoryName, options) {
    return options.findIndex((option) => option.category === categoryName);
  }

  const options = [
    {
      category: "Athletics, Recreation, & Wellness",
      achievements: [
        {
          headline: "National Basketball Championship Winners",
          description:
            "The school’s basketball team secured the championship title in the National Collegiate League, showcasing outstanding teamwork and skill.",
          image_path: "images/basketball_team.png",
        },
        {
          headline: "Track and Field Gold Medalists",
          description:
            "Sci-Tech's track and field athletes dominated the inter-school athletics meet, bringing home multiple gold medals in various events.",
          image_path: "images/track_field.png",
        },
      ],
    },
    {
      category: "Robotics",
      achievements: [
        {
          headline: "International Robotics Olympiad Finalists",
          description:
            "The Sci-Tech Robotics Team advanced to the finals of the International Robotics Olympiad, competing against top schools worldwide.",
          image_path: "images/robotics_team.png",
        },
        {
          headline: "Best Innovation Award - Tech Expo 2025",
          description:
            "The school's AI-powered robotic assistant won the Best Innovation Award at the annual Tech Expo, recognizing its cutting-edge design and functionality.",
          image_path: "images/tech_expo.png",
        },
      ],
    },
    {
      category: "Journalism",
      achievements: [
        {
          headline: "Best School Publication Award",
          description:
            "The Sci-Tech Gazette was recognized as the Best School Publication for its in-depth reporting and student-driven journalism.",
          image_path: "images/journalism_award.png",
        },
        {
          headline: "Editorial Writing Competition Winner",
          description:
            "A senior student won first place in the National Editorial Writing Contest, showcasing exceptional writing and analytical skills.",
          image_path: "images/editorial_writing.png",
        },
      ],
    },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIndex(0);
    setCategoryIndex(getCategoryIndex(option, options));
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
    <div className="bg-white flex w-full min-h-[650px] rounded-xl p-4 flex-col">
      <div className="relative inline-block text-left">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition"
        >
          Select Achievement: {selectedOption}
        </button>

        {/* Dropdown Menu */}
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

      {/* Carousel Container */}
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

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          &#10094;
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 bg-gray-800/50 text-white p-3 rounded-full hover:bg-gray-900 transition"
        >
          &#10095;
        </button>
      </div>

      {/* Indicators */}
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
    </div>
  );
}
