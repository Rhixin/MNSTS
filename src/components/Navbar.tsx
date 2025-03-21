"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = [
    "Home",
    "News",
    "Announcements",
    "Achievements",
    "Events",
    "Organizations",
    "About",
  ];

  // Load index from localStorage or default to 0
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("activeIndex")) || 0;
    }
    return 0;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const currentPath = pathname.replace("/", "").replace(/-/g, " ");
    const index = menuItems.findIndex(
      (item) => item.toLowerCase() === currentPath
    );
    if (index !== -1) {
      setActiveIndex(index);
      localStorage.setItem("activeIndex", index); // Save to localStorage
    }
  }, [pathname]);

  const handleNavigation = (index, name) => {
    setActiveIndex(index);
    localStorage.setItem("activeIndex", index); // Save to localStorage
    setIsMenuOpen(false);
    router.push(`/${name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sticky top-0 w-full z-10 bg-transparent pt-2 mb-4">
      <div className="py-2 flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center w-full justify-between md:justify-start">
          <div className="flex items-center">
            <img
              src="images/MNSTS_logo.jpg"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-md"
              alt="MNSTS Logo"
            />
            <h1 className="text-xl sm:text-xl md:text-2xl ml-2 md:ml-4 text-white font-bold">
              <span className="hidden sm:inline">
                Medellin National Science and Technology School
              </span>
              <span className="sm:hidden">MNSTS</span>
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Bar - Hidden on small screens, visible on medium and up */}
        <div className="relative mt-4 md:mt-0 hidden md:block">
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

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-white rounded-full relative w-full shadow-inner mt-2">
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
                className={`px-2 py-3 w-full transition-colors duration-300 font-medium ${
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white rounded-lg mt-2 shadow-lg overflow-hidden transition-all duration-300">
          <ul className="flex flex-col w-full">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="relative w-full border-b border-gray-100 last:border-b-0"
              >
                <button
                  className={`px-4 py-3 w-full text-left transition-colors duration-300 font-medium ${
                    activeIndex === index
                      ? "bg-gradient-to-r from-[#097444] to-[#14c278] text-white font-bold"
                      : "text-[#0a4d2e] hover:bg-gray-50"
                  }`}
                  onClick={() => handleNavigation(index, item)}
                >
                  {item}
                </button>
              </li>
            ))}

            {/* Search Bar in Mobile Menu */}
            <li className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-2xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#14c278]"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search size={18} className="text-[#0a4d2e]" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
