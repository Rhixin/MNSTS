"use client";
import { useState } from "react";
import HighlightNews from "@/components/HighlightNews";
import PreviewNews from "@/components/PreviewNews";

export default function News() {
  const newsData = [
    {
      title: "Sci-Tech Wins Again",
      date: "March 18, 2025",
      description:
        "Sci-Tech secures another championship in the annual inter-school robotics competition, proving their excellence in innovation and technology.",
      image_path: "images/school_image.png",
    },
    {
      title: "New Science Lab Inaugurated",
      date: "March 18, 2025",
      description:
        "The school's latest state-of-the-art science laboratory was officially opened, providing students with advanced learning facilities.",
      image_path: "images/school_image.png",
    },
    {
      title: "Students Launch Eco-Friendly Project",
      date: "March 18, 2025",
      description:
        "A group of students initiated a sustainable project that aims to reduce plastic waste in the campus and surrounding communities.",
      image_path: "images/school_image.png",
    },
    {
      title: "Athletics Team Secures Gold",
      date: "March 18, 2025",
      description:
        "The school's athletics team brought home the gold medal in the national sports championship, dominating various track and field events.",
      image_path: "images/school_image.png",
    },
    {
      title: "Tech Fair Showcases Student Innovations",
      date: "March 18, 2025",
      description:
        "The annual tech fair displayed a range of innovative student projects, including AI-powered tools and automation systems.",
      image_path: "images/school_image.png",
    },
    {
      title: "Journalism Club Wins Best Publication Award",
      date: "March 18, 2025",
      description:
        "The school's journalism club received recognition for its outstanding publication, highlighting impactful stories from students and faculty.",
      image_path: "images/school_image.png",
    },
    {
      title: "Robotics Team Prepares for International Contest",
      date: "March 18, 2025",
      description:
        "The robotics team is gearing up for an international competition, aiming to showcase their cutting-edge creations on a global stage.",
      image_path: "images/school_image.png",
    },
  ];

  // State to track the highlighted news
  const [highlightedNews, setHighlightedNews] = useState(newsData[0]);

  // Handle preview news click
  const handleNewsClick = (news) => {
    setHighlightedNews(news);
  };

  return (
    <div className="bg-white flex w-full max-h-[650px] rounded-xl">
      {/* Highlighted News */}
      <div className="flex-3 justify-center items-center p-4">
        <HighlightNews
          title={highlightedNews.title}
          description={highlightedNews.description}
          date={highlightedNews.date}
          image_path={highlightedNews.image_path}
        />
      </div>

      {/* News List */}
      <div className="relative flex-1 overflow-y-auto">
        <div>
          {newsData.map((news, index) => (
            <PreviewNews
              key={index}
              title={news.title}
              date={news.date}
              image_path={news.image_path}
              onClick={() => handleNewsClick(news)}
            />
          ))}
        </div>

        {/* Bottom Fade Effect */}
        <div className="sticky bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
