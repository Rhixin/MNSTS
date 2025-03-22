"use client";
import { useEffect, useState } from "react";
import Announcement from "./Announcement";
import DeleteModal from "./DeleteModal";
import LoadingSpinner from "./LoadingSpinner";

export default function AnnouncementsDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements");
      const data = await response.json();

      if (data.success) {
        setAnnouncements(data.data);
      } else {
        console.error("Failed to fetch announcements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedAnnouncementId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAnnouncementId) return;

    try {
      const res = await fetch(
        `/api/announcements/delete?id=${selectedAnnouncementId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete news");

      setShowDeleteModal(false);
      setSelectedAnnouncementId(
        announcements.filter((item) => item._id !== selectedAnnouncementId)
      );
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to delete annoucement");
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newContent) {
      alert("Content is required!");
      return;
    }

    try {
      const res = await fetch("/api/announcements/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) throw new Error("Failed to add announcement");

      const newAnnouncement = await res.json();
      setNewContent("");
      setShowModal(false);

      // Refetch announcements after adding a new one
      fetchAnnouncements();
    } catch (err) {
      alert("Error adding announcement");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded "
          onClick={() => setShowModal(true)}
        >
          Add Announcement
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Content</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((item) => (
              <tr key={item._id} className="text-center">
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
            {announcements.length === 0 && (
              <tr>
                <td colSpan={3} className="border p-2 text-gray-500">
                  No announcements available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          type={"Announcement"}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Announcement</h2>
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded mb-2"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded bg-[#0a4d2e]"
                onClick={handleAddAnnouncement}
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
