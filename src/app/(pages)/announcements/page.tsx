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

  return (
    <div className="min-h-[150px] max-h-[650px] bg-white w-full p-6 rounded-xl overflow-auto">
      {announcements.map((announcement, index) => (
        <Announcement
          key={index}
          headline={announcement.headline}
          date={announcement.date}
        />
      ))}
    </div>
  );
}
