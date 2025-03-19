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
    <div className="sticky top-0 w-full z-10 bg-[#0a4d2e] py-2 px-4 shadow-lg">
      <div className="py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src="images/MNSTS_logo.jpg"
            className="w-16 h-16 rounded-full border-2 border-white shadow-md"
            alt="MNSTS Logo"
          />
          <h1
            className="text-3xl ml-4 text-white font-serif font-bold"
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
            className="w-64 px-4 py-2 rounded-2xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#14c278]"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search size={18} className="text-[#0a4d2e]" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-full flex relative w-full shadow-inner mt-2">
        <ul className="flex w-full justify-between relative">
          {/* Moving Background Indicator */}
          <div
            className="absolute bottom-0 h-full bg-gradient-to-r from-[#097444] to-[#14c278] transition-all duration-300 rounded-full shadow-md"
            style={{
              width: `calc(100% / ${menuItems.length})`,
              left: `calc(${activeIndex} * (100% / ${menuItems.length}))`,
            }}
          />

          {menuItems.map((item, index) => (
            <li key={index} className="relative flex-1 text-center z-10">
              <button
                className={`px-4 py-3 w-full transition-colors duration-300 font-medium ${
                  activeIndex === index
                    ? "text-white font-bold"
                    : "text-[#0a4d2e] hover:text-[#14c278]"
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