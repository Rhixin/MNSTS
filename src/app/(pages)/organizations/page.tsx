"use client";
import Club from "@/components/Club";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Organization() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizations from API
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        const data = await response.json();

        if (data.success) {
          setClubs(data.data);
        } else {
          console.error("Failed to fetch organizations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSelect = (index) => {
    setSelectedOption(index);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside 
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if the click is on the dropdown button or the dropdown menu
      const dropdownElement = document.getElementById('organization-dropdown');
      const dropdownMenuElement = document.getElementById('dropdown-menu');
      
      if (isOpen && 
          dropdownElement && 
          !dropdownElement.contains(event.target) && 
          dropdownMenuElement && 
          !dropdownMenuElement.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="bg-white w-full min-h-[650px] rounded-xl p-2 md:p-4 flex flex-col">
      {/* Dropdown Menu - with better mobile handling */}
      <div className="relative z-10 mb-4">
        {loading ? (
          <div className="w-full sm:w-48 h-10 bg-gray-200 animate-pulse rounded-md" />
        ) : (
          <div className="relative inline-block text-left w-full sm:w-auto">
            <button
              id="organization-dropdown"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition text-sm md:text-base truncate"
            >
              {clubs.length > 0
                ? `Select Organization: ${clubs[selectedOption]?.clubName}`
                : "No organizations available"}
            </button>

            {isOpen && clubs.length > 0 && (
              <div 
                id="dropdown-menu"
                className="absolute left-0 mt-2 w-full sm:w-64 bg-white border border-gray-300 rounded-md shadow-lg z-20"
              >
                <ul className="py-2 max-h-60 overflow-y-auto">
                  {clubs.map((club, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(index)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm md:text-base truncate"
                    >
                      {club.clubName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Club Display - with loading state and mobile optimization */}
      <div className="w-full overflow-x-hidden">
        {loading ? (
          <div className="flex flex-col md:flex-row animate-pulse">
            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-lg"></div>
            <div className="w-full md:w-1/2 p-4 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : clubs.length > 0 ? (
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Club
              clubName={clubs[selectedOption]?.clubName}
              description={clubs[selectedOption]?.description}
              officers={clubs[selectedOption]?.officers}
              adviser={clubs[selectedOption]?.adviser}
              activities={clubs[selectedOption]?.activities}
              image_path={clubs[selectedOption]?.image_path}
              logo_path={clubs[selectedOption]?.logo_path}
            />
          </motion.div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No organizations available
          </div>
        )}
      </div>
    </div>
  );
}