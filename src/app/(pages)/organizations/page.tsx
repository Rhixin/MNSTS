"use client";
import Club from "@/components/Club";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Organization() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelect = (option: number) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options = [
    {
      clubName: "Math Club",
      description:
        "The Math Club fosters a love for mathematics through problem-solving, competitions, and logic games.",
      president: "Alice Johnson",
      adviser: "Dr. Robert Smith",
      activities:
        "Math Olympiad, Puzzle Challenges, Weekly Problem Solving Sessions",
      projects: "School Calculator App, Peer Tutoring Program",
      image_path: "images/school_image.png",
      logo_path: "images/school_image.png",
    },
    {
      clubName: "English Club",
      description:
        "The English Club enhances students' communication and literary skills through interactive activities.",
      president: "David Carter",
      adviser: "Ms. Emily Brown",
      activities:
        "Debate Competitions, Poetry Readings, Public Speaking Workshops",
      projects: "Annual School Magazine, Book Donation Drive",
      image_path: "images/school_image.png",
      logo_path: "images/school_image.png",
    },
    {
      clubName: "Science Club",
      description:
        "The Science Club promotes curiosity and discovery through hands-on experiments and science fairs.",
      president: "Sophia Martinez",
      adviser: "Dr. William Green",
      activities:
        "Science Fair, Astronomy Night, Environmental Awareness Campaigns",
      projects: "Eco-Friendly Campus Initiative, School Hydroponic Garden",
      image_path: "images/school_image.png",
      logo_path: "images/school_image.png",
    },
    {
      clubName: "Step Club",
      description:
        "The Step Club is dedicated to dance, movement, and rhythm, performing at school events and competitions.",
      president: "Michael Lee",
      adviser: "Mr. Daniel White",
      activities: "Hip-Hop Dance Battles, Choreography Sessions, Talent Shows",
      projects: "School Dance Showcase, Community Dance Outreach",
      image_path: "images/school_image.png",
      logo_path: "images/school_image.png",
    },
  ];

  return (
    <div className="bg-white flex w-full min-h-[650px] rounded-xl p-4 flex-col">
      <div className="relative inline-block text-left">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition"
        >
          Select Organization: {options[selectedOption].clubName}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-2">
            <ul className="py-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(index)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.clubName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-row flex">
        <motion.div
          key={selectedOption} // Triggers animation on change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Club
            clubName={options[selectedOption].clubName}
            description={options[selectedOption].description}
            president={options[selectedOption].president}
            adviser={options[selectedOption].adviser}
            activities={options[selectedOption].activities}
            projects={options[selectedOption].projects}
            image_path={options[selectedOption].image_path}
            logo_path={options[selectedOption].logo_path}
          />
        </motion.div>
      </div>
    </div>
  );
}
