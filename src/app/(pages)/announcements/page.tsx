"use client";
import { motion } from "framer-motion";
import Announcement from "@/components/Announcement";

export default function Announcements() {
  const announcements = [
    {
      headline: "School Year 2025-2026 Enrollment Now Open!",
      date: "March 20, 2025",
    },
    {
      headline: "Campus Maintenance Scheduled for April 5-10",
      date: "March 18, 2025",
    },
    {
      headline: "Sci-Tech Career Fair - Explore Opportunities",
      date: "March 15, 2025",
    },
    {
      headline: "Midterm Exams Scheduled for Next Month",
      date: "March 10, 2025",
    },
    {
      headline: "Library Now Open 24/7 for Exam Period",
      date: "March 5, 2025",
    },
  ];

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
            headline={announcement.headline}
            date={announcement.date}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
