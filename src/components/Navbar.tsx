"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
    <div className="sticky top-0 mx-auto container z-10">
      <div className="py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src="images/MNSTS_logo.jpg"
            className="w-16 h-16 rounded-full"
            alt="MNSTS Logo"
          />
          <h1
            className="text-3xl ml-4 text-white font-serif"
            style={{ fontFamily: "Times New Roman, serif" }}
          >
            Medellin National Science and Technology School
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 rounded-2xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[rgb(9,116,68)]"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
            <Search size={16} className="text-gray-500 mr-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-4xl flex relative w-full">
        <ul className="flex w-full justify-between relative">
          {/* Moving Background Indicator */}
          <div
            className="absolute bottom-0 h-full bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] transition-all duration-300 rounded-full"
            style={{
              width: `calc(100% / ${menuItems.length})`,
              left: `calc(${activeIndex} * (100% / ${menuItems.length}))`,
            }}
          />

          {menuItems.map((item, index) => (
            <li key={index} className="relative flex-1 text-center">
              <button
                className={`px-4 py-2 w-full transition-colors duration-300 ${
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
