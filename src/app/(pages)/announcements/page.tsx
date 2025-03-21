"use client";
import { motion } from "framer-motion";
import Announcement from "@/components/Announcement";
import { useEffect, useState } from "react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/announcements");
        const data = await response.json();

        if (data.success) {
          setAnnouncements(data.data);
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

  // Variants for stacking animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between items
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <p>Loading announcements...</p>;
  if (!announcements.length) return <p>No announcements available.</p>;

  return (
    <motion.div
      className=" min-h-[650px] bg-white w-full p-6 rounded-xl overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {announcements.map((announcement, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Announcement
            headline={announcement.content}
            date={announcement.createdAt}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
