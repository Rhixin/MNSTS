"use client";
import { useEffect, useState } from "react";

export default function NewsDashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news");
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
      } else {
        setError("Failed to fetch news: " + data.message);
      }
    } catch (error) {
      setError("Error connecting to server. Please try again later.");
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedNewsId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedNewsId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/news/delete?id=${selectedNewsId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete news");

      setShowDeleteModal(false);
      setNews(news.filter((item) => item._id !== selectedNewsId));
    } catch (err) {
      setError("Failed to delete news. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const resetForm = () => {
    setNewTitle("");
    setNewAuthor("");
    setNewContent("");
    setNewImage(null);
    setError("");
  };

  const handleModalClose = () => {
    if (!submitting) {
      resetForm();
      setShowModal(false);
    }
  };

  const handleAddNews = async () => {
    // Form validation
    if (!newTitle.trim()) {
      setError("Title is required");
      return;
    }
    if (!newAuthor.trim()) {
      setError("Author is required");
      return;
    }
    if (!newContent.trim()) {
      setError("Content is required");
      return;
    }
    if (!newImage) {
      setError("Image is required");
      return;
    }

    setError(""); // Clear any previous errors
    setSubmitting(true);

    try {
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

      // Then create the news item with the Cloudinary URL
      const res = await fetch("/api/news/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
          content: newContent,
          images: [imageUrl],
        }),
      });

      if (!res.ok) throw new Error("Failed to add news");

      // Reset and close
      resetForm();
      setShowModal(false);

      // Refetch news after adding a new one
      fetchNews();
    } catch (err) {
      setError("Error adding news: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a4d2e]"></div>
    </div>
  );

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-semibold text-gray-800">News Dashboard</h1> */}
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded hover:bg-[#083d23] transition-colors disabled:opacity-50"
          onClick={() => setShowModal(true)}
          disabled={submitting}
        >
          Add News
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Image</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Author</th>
                <th className="border p-2">Content</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item._id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="border p-2 font-medium">{item.title}</td>
                  <td className="border p-2">{item.author}</td>
                  <td className="border p-2 text-left truncate max-w-xs">
                    {item.content}
                  </td>
                  <td className="border p-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      onClick={() => confirmDelete(item._id)}
                      disabled={submitting}
                    >
                      {submitting ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border p-6 text-gray-500 text-center"
                  >
                    No news available. Click "Add News" to create your first
                    news item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this News?</p>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add News</h2>
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
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter news title"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="Enter author name"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Enter news content"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  rows="4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
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
                  onClick={handleAddNews}
                  disabled={submitting || imageUploading}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Add News"
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
