"use client";
import { motion } from "framer-motion";
import Announcement from "@/components/Announcement";
import { useEffect, useState } from "react";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/announcements");
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        // Sort announcements by date (newest first)
        const sorted = data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(sorted);
      } else {
        throw new Error(data.message || "Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError(error.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // Format date to word format and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Format date in words (Month Day, Year)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  // Get filtered announcements
  const filteredAnnouncements = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    switch (filter) {
      case "week":
        return announcements.filter(a => new Date(a.createdAt) >= oneWeekAgo);
      case "month":
        return announcements.filter(a => new Date(a.createdAt) >= oneMonthAgo);
      default:
        return announcements;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className="min-h-[650px] bg-white w-full p-6 rounded-xl shadow-md overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-4 animate-pulse">
            <div className="w-full h-24 bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[650px] bg-white w-full p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to load announcements</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button 
          onClick={fetchAnnouncements} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  // Render empty state
  if (!announcements.length) {
    return (
      <div className="min-h-[650px] bg-white w-full p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        <Bell size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No announcements yet</h2>
        <p className="text-gray-600 text-center max-w-md">
          There are currently no announcements to display. Check back later for updates.
        </p>
      </div>
    );
  }

  // Render announcements
  return (
    <div className="min-h-[650px] bg-white w-full p-6 rounded-xl shadow-md overflow-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-1 pb-4 z-10">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Bell size={24} className="mr-2 text-blue-600" />
          Announcements
          <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {announcements.length}
          </span>
        </h1>
        
        <div className="flex space-x-2">
          {/* <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="month">Past Month</option>
            <option value="week">Past Week</option>
          </select> */}
          
          <button 
            onClick={fetchAnnouncements}
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-label="Refresh announcements"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredAnnouncements().map((announcement, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="transition-all hover:transform hover:scale-[1.01] hover:shadow-md"
          >
            <Announcement
              headline={announcement.content}
              date={formatDate(announcement.createdAt)}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {filteredAnnouncements().length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No announcements found for the selected time period.</p>
          <button 
            onClick={() => setFilter("all")} 
            className="mt-2 text-blue-600 hover:underline"
          >
            View all announcements
          </button>
        </div>
      )}
    </div>
  );
}