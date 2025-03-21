"use client";
import { useEffect, useState } from "react";

export default function AchievementsDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      const data = await response.json();

      if (data.success) {
        organizeData(data.data);
      } else {
        console.error("Failed to fetch achievements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setError("Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  function organizeData(achievements) {
    const grouped = achievements.reduce((acc, achievement) => {
      const category = achievement.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    }, {});

    const formattedOptions = Object.keys(grouped).map((category) => ({
      category,
      achievements: grouped[category],
    }));

    setAchievements(formattedOptions);
  }

  const handleAddAchievement = async () => {
    if (!newTitle || !newCategory || !newCategory || !newImage) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/achievements/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newCategory,
          headline: newTitle,
          description: newDescription,
          image_path: newImage,
        }),
      });

      if (!res.ok) throw new Error("Failed to add Achievement");

      setShowModal(false);
      setNewCategory("");
      setNewTitle("");
      setNewDescription("");
      setNewImage("");

      // Refetch announcements after adding a new one
      fetchAchievements();
    } catch (err) {
      alert("Error adding achievements");
    }
  };

  const confirmDelete = (id) => {
    setSelectedAchievementId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAchievementId) return;

    try {
      const res = await fetch(
        `/api/achievements/delete?id=${selectedAchievementId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete achievement");

      setShowDeleteModal(false);
      setAchievements(
        achievements.filter((item) => item._id !== selectedAchievementId)
      );
      fetchAchievements();
    } catch (err) {
      alert("Failed to delete achievement");
    }
  };

  if (loading) return <p>Loading achievements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {achievements.length === 0 && (
        <p className="text-gray-500">No achievements available.</p>
      )}

      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded "
          onClick={() => setShowModal(true)}
        >
          Add Achievement
        </button>
      </div>

      {achievements.map((category, categoryIndex) => (
        <div key={category.category} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{category.category}</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Image</th>
                <th className="border p-2">Headline</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {category.achievements.map((achievement, achievementIndex) => (
                <tr key={achievement._id} className="text-center">
                  <td className="border p-2">
                    <img
                      src={achievement.image_path}
                      alt={achievement.headline}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="border p-2">{achievement.headline}</td>
                  <td className="border p-2">{achievement.description}</td>
                  <td className="border p-2">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => confirmDelete(achievement._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {category.achievements.length === 0 && (
                <tr>
                  <td colSpan={4} className="border p-2 text-gray-500">
                    No achievements in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this news article?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Achievement</h2>

            <input
              type="text"
              placeholder="Category"
              className="w-full p-2 border rounded mb-2"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded mb-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded mb-2"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Image Path"
              className="w-full p-2 border rounded mb-2"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded bg-[#0a4d2e]"
                onClick={handleAddAchievement}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
