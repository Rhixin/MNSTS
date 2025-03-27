"use client";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import LoadingSpinner from "./LoadingSpinner";

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState({
    _id: "",
    teaching: 0,
    nonteaching: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setStatistics({ ...statistics, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  async function updateStatistics() {
    setLoading(true);
    const id = "67e499b0e6d8e476600bf789"; // Replace with the actual ID
    try {
      const response = await fetch(`/api/statistics/update?id=${id}`, {
        method: "PATCH", // ✅ Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // ✅ Specify JSON content type
        },
        body: JSON.stringify({
          teaching: statistics.teaching, // ✅ Pass data in body
          nonteaching: statistics.nonteaching,
          students: statistics.students,
        }),
      });

      console.log(response);

      fetchStatistics();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Teaching</th>
              <th className="border p-2">Non-Teaching</th>
              <th className="border p-2">Students</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border p-2">
                <input
                  type="number"
                  name="teaching"
                  value={statistics.teaching}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  name="nonteaching"
                  value={statistics.nonteaching}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  name="students"
                  value={statistics.students}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                />
              </td>

              <td className="border p-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={updateStatistics}
                >
                  Save
                </button>
              </td>
            </tr>

            {!statistics && (
              <tr>
                <td colSpan={4} className="border p-2 text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
