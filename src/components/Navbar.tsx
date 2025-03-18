"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const menuItems = [
    "Home",
    "News",
    "Announcements",
    "Achievements",
    "Events",
    "Organizations",
    "About",
  ];

  const handleNavigation = (index, name) => {
    setActiveIndex(index);
    router.push(`/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="sticky top-0 mx-auto container">
      <div className="py-4 flex items-center">
        <img
          src="images/MNSTS_logo.jpg"
          className="w-16 h-16 rounded-full"
          alt="MNSTS Logo"
        />
        <h1 className="text-3xl ml-4">
          Medellin National Science and Technology School
        </h1>
      </div>

      <div className="bg-gray-200 rounded-4xl flex relative">
        <ul className="flex w-full justify-between relative">
          {/* Moving Background Indicator */}
          <div
            className="absolute bottom-0 h-full bg-[#097444] transition-all duration-300 rounded-full"
            style={{
              width: `calc(100% / ${menuItems.length})`,
              left: `calc(${activeIndex} * (100% / ${menuItems.length}))`,
            }}
          />

          {menuItems.map((item, index) => (
            <li key={index} className="relative w-full text-center">
              <button
                className={`px-4 py-2 block transition-colors duration-300 w-full ${
                  activeIndex === index
                    ? "text-white font-bold"
                    : "hover:text-[#097444]"
                }`}
                onClick={() => handleNavigation(index, item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
