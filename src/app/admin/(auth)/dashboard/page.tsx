"use client";
import { useState } from "react";
import NewsDashboard from "@/components/NewsDashboard";
import AnnouncementsDashboard from "@/components/AnnouncementsDashboard";
import OrganizationsDashboard from "@/components/OrganizationsDashboard";

export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("News");

  const sections = ["News", "Announcements", "Organizations", "Achievements"];

  return (
    <div className="flex max-h-[650px] bg-gray-100 rounded-2xl">
      {/* Left Sidebar Menu */}
      <div className="w-64 bg-white shadow-lg p-4 rounded-l-2xl">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <ul>
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-x-scroll">
        <h1 className="text-2xl font-bold">{selectedSection}</h1>
        {selectedSection === "News" ? (
          <NewsDashboard />
        ) : selectedSection === "Announcements" ? (
          <AnnouncementsDashboard />
        ) : selectedSection === "Organizations" ? (
          <OrganizationsDashboard />
        ) : (
          <p className="text-gray-600 mt-2">Content for {selectedSection}...</p>
        )}
      </div>
    </div>
  );
}
