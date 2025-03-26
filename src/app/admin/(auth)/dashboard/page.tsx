"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewsDashboard from "@/components/NewsDashboard";
import AnnouncementsDashboard from "@/components/AnnouncementsDashboard";
import OrganizationsDashboard from "@/components/OrganizationsDashboard";
import AchievementsDashboard from "@/components/AchievementsDashboard";
import EventsDashboard from "@/components/EventsDashboard";
import InquiriesDashboard from "@/components/InquiriesDashboard";
import SubscribersDashboard from "@/components/SubscribersDashboard";
export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("News");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const sections = [
    "News",
    "Announcements",
    "Organizations",
    "Achievements",
    "Events",
    "Inquiries",
    "Subscribers",
  ];

  useEffect(() => {
    // Check for token when component mounts
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // No token found, redirect to login page
        router.push("/admin");
        return;
      }

      // Verify token validity (check if it's a valid JWT)
      try {
        // This only decodes the token to check its structure, not validating signature
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          // Token is expired
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/");
          return;
        }

        // Token is valid
        setIsLoading(false);
      } catch (error) {
        // Invalid token format
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/");
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[780px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen flex justify-center items-center ">
      <div className="flex min-h-[90vh] bg-gray-100 rounded-2xl w-full">
        {/* Left Sidebar Menu */}
        <div className="w-64 bg-white shadow-lg p-4 rounded-l-2xl flex flex-col">
          <h2 className="text-lg font-bold mb-4">Dashboard</h2>
          <ul className="flex-1">
            {sections.map((section) => (
              <li
                key={section}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedSection === section
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-auto p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log Out
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-x-auto">
          <h1 className="text-2xl font-bold">{selectedSection}</h1>
          {selectedSection === "News" ? (
            <NewsDashboard />
          ) : selectedSection === "Announcements" ? (
            <AnnouncementsDashboard />
          ) : selectedSection === "Organizations" ? (
            <OrganizationsDashboard />
          ) : selectedSection === "Achievements" ? (
            <AchievementsDashboard />
          ) : selectedSection === "Events" ? (
            <EventsDashboard />
          ) : selectedSection === "Inquiries" ? (
            <InquiriesDashboard />
          ) : selectedSection === "Subscribers" ? (
            <SubscribersDashboard />
          ) : (
            <p className="text-gray-600 mt-2">
              Content for {selectedSection}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
