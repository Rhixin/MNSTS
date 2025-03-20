"use client";
import Club from "@/components/Club";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Organization() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/organizations");
        const data = await response.json();

        if (data.success) {
          setClubs(data.data);
        } else {
          console.error("Failed to fetch news:", data.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setIsOpen(false);
  };

  if (loading) return <p>Loading clubs...</p>;
  if (!clubs.length) return <p>No clubs available.</p>;

  return (
    <div className="bg-white flex w-full min-h-[650px] rounded-xl p-4 flex-col">
      {/* Dropdown Menu */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gradient-to-b from-[rgb(9,116,68)] to-[rgb(14,175,103)] text-white rounded-md shadow-md transition"
        >
          {clubs.length > 0
            ? `Select Organization: ${clubs[selectedOption]?.clubName}`
            : "Loading..."}
        </button>

        {isOpen && clubs.length > 0 && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-2">
            <ul className="py-2">
              {clubs.map((club, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(index)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {club.clubName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Club Display */}
      <div className="flex-row flex">
        {clubs.length > 0 && (
          <motion.div
            key={selectedOption} // Triggers animation on change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Club
              clubName={clubs[selectedOption]?.clubName}
              description={clubs[selectedOption]?.description}
              president={clubs[selectedOption]?.president}
              adviser={clubs[selectedOption]?.adviser}
              activities={clubs[selectedOption]?.activities}
              projects={clubs[selectedOption]?.projects}
              image_path={clubs[selectedOption]?.image_path}
              logo_path={clubs[selectedOption]?.logo_path}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
