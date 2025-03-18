"use client";
import { useState } from "react";

export default function Organization() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Math");
  const options = ["Math", "English", "Science", "Step"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="bg-white flex w-full min-h-[650px] rounded-xl p-4 flex-col">
      <div className="relative inline-block text-left">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition"
        >
          Select Organization: {selectedOption}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-2">
            <ul className="py-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-row flex">
        <div className="flex-1 flex-col">
          <div className="relative w-[720px] h-[540px] flex justify-center items-center overflow-hidden my-4">
            {/* Blurred Background Image */}
            <div
              className="absolute inset-0 bg-center bg-cover blur-xl"
              style={{ backgroundImage: `url(images/school_image.png)` }}
            />

            {/* Sharp Foreground Image */}
            <img
              src="images/school_image.png"
              className="relative max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex-col flex">
          {/* Logo and Club Name */}
          <div className="flex items-center my-4">
            <img
              src="images/MNSTS_logo.jpg"
              className="w-16 h-16 rounded-full"
              alt="MNSTS Logo"
            />
            <h1 className="text-4xl ml-4 text-black font-bold">
              {selectedOption}
            </h1>
          </div>

          {/* Club Information */}
          <div>
            <p className="text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Vestibulum nec felis eget sapien auctor dapibus. Integer
              vel lectus at nulla convallis dictum. Mauris vel risus at enim
              pharetra consectetur. Donec vitae ligula ut odio tincidunt tempor.
              Proin non velit ut elit vestibulum pharetra.
            </p>
          </div>

          <div className="flex flex-col flex-1 justify-around">
            <p className="text-justify">President:</p>

            <p className="text-justify">Adviser:</p>

            <p className="text-justify">Activities:</p>

            <p className="text-justify">Project Implemented:</p>
          </div>
        </div>
      </div>
    </div>
  );
}
