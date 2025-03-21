"use client";
import { useEffect, useState } from "react";

export default function NewsDashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/news");
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
      } else {
        console.error("Failed to fetch news:", data.message);
      }
    } catch (error) {
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
      const res = await fetch(
        `http://localhost:3000/api/news/delete?id=${selectedNewsId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete news");

      setShowDeleteModal(false);
      setNews(news.filter((item) => item._id !== selectedNewsId));
    } catch (err) {
      alert("Failed to delete news");
    }
  };

  const handleAddNews = async () => {
    if (!newTitle || !newAuthor || !newContent || !newImage) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/news/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
          content: newContent,
          images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOCcGIGpz4NSuGCYODV1rdRFZ5RKdls6MorA&s",
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed to add news");

      setShowModal(false);
      setNewTitle("");
      setNewAuthor("");
      setNewContent("");
      setNewImage("");

      // Refetch announcements after adding a new one
      fetchNews();
    } catch (err) {
      alert("Error adding news");
    }
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded "
          onClick={() => setShowModal(true)}
        >
          Add News
        </button>
      </div>

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
            <tr key={item._id} className="text-center">
              <td className="border p-2">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 object-cover mx-auto"
                />
              </td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.author}</td>
              <td className="border p-2">{item.content}</td>
              <td className="border p-2">{item.createdAt}</td>
              <td className="border p-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => confirmDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {news.length === 0 && (
            <tr>
              <td colSpan={6} className="border p-2 text-gray-500">
                No news available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
            <h2 className="text-lg font-bold mb-4">Add News</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded mb-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              className="w-full p-2 border rounded mb-2"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded mb-2"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
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
                onClick={handleAddNews}
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
