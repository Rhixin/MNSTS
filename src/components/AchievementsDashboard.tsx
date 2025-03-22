"use client";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import LoadingSpinner from "./LoadingSpinner";
import Achievement from "./Achievement";

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
  const [newImage, setNewImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type (only PNG and JPG)
    if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
      setError("Only PNG and JPG images are allowed");
      e.target.value = null;
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      e.target.value = null;
      return;
    }

    setError(""); // Clear any previous errors
    setNewImage(file);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

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

    // First upload the image to Cloudinary
    let imageUrl;

    try {
      imageUrl = await uploadImageToCloudinary(newImage);
      if (!imageUrl) throw new Error("Failed to upload image");
    } catch (err) {
      setError("Error uploading image: " + err.message);
      setSubmitting(false);
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
          image_path: imageUrl,
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

  const handleModalClose = () => {
    if (!submitting) {
      setShowModal(false);
    }
  };
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {achievements.length === 0 && !loading && (
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

      {loading ? (
        <LoadingSpinner />
      ) : (
        achievements.map((category, categoryIndex) => (
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
        ))
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          type={"Achievement"}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Add Achievement
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                onClick={handleModalClose}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Enter Achievement category"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement
                </label>
                <input
                  type="text"
                  placeholder="Enter Achievement"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter achievement content"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  rows="4"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={submitting}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (PNG or JPG only)
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
                {newImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {newImage.name} (
                    {(newImage.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                {imageUploading && (
                  <div className="flex items-center mt-2">
                    <div className="animate-spin h-4 w-4 border-t-2 border-[#0a4d2e] rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Uploading image...
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                  onClick={handleModalClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#0a4d2e] text-white rounded hover:bg-[#083d23] transition-colors flex items-center justify-center min-w-20 disabled:opacity-50"
                  onClick={handleAddAchievement}
                  disabled={submitting || imageUploading}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Add Achievement"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
