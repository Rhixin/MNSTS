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
          headline: "Robotics Champion 2025",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
        },
        {
          headline: "Robotics Champion 2024",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
        },
      ],
    },
    {
      category: "Robotics",
      achievements: [
        {
          headline: "Robotics Champion 2025",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
        },
        {
          headline: "Robotics Champion 2024",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
        },
      ],
    },
    {
      category: "Journalism",
      achievements: [
        {
          headline: "Robotics Champion 2025",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
        },
        {
          headline: "Robotics Champion 2024",
          description: "blah bla blblalbalblabl",
          image_path: "images/school_image.png",
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
    setIndex(
      (prev) =>
        (prev + 1) %
        options[getCategoryIndex(selectedOption, options)].achievements.length
    );
  };

  const prevSlide = () => {
    setIndex(
      (prev) =>
        (prev -
          1 +
          options[getCategoryIndex(selectedOption, options)].achievements
            .length) %
        options[getCategoryIndex(selectedOption, options)].achievements.length
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

      {/* Carousel */}
      <div className="flex-row flex p-16">
        <Achievement
          title={options[categoryIndex].achievements[index].headline}
          description={options[categoryIndex].achievements[index].description}
          image_path={options[categoryIndex].achievements[index].image_path}
        />
      </div>
    </div>
  );
}
