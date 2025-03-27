import { useEffect, useState } from "react";
import Counter from "./Counter";

export default function SchoolStatistics() {
  const [statistics, setStatistics] = useState({
    teaching: 0,
    nonteaching: 0,
    students: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/statistics");
      const data = await response.json();

      if (data.success) {
        setStatistics(data.data[0]);
      } else {
        console.error("Failed to fetch statistics:", data.message);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <>
      <Counter end={statistics.teaching} label="Teaching" />
      <Counter end={statistics.nonteaching} label="Non-Teaching" />
      <Counter end={statistics.students} label="Students" />
    </>
  );
}
