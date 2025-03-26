"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DeleteModal from "./DeleteModal";

export default function SubscribersDashboard() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', or 'done'

  useEffect(() => {
    fetchData();
  });

  // Fetch subscribers from the API
  async function fetchData() {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscribers");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      setSubscribers(data.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const confirmDelete = (id) => {
    setSelectedSubscriberId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedSubscriberId) return;

    try {
      const res = await fetch(
        `/api/subscribers/delete?id=${selectedSubscriberId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete achievement");

      setShowDeleteModal(false);
      setSelectedSubscriberId(0);
      fetchData();
    } catch (err) {
      alert("Failed to delete achievement");
    }
  };

  if (isLoading && subscribers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-sm text-gray-500 mb-4">Manage Subscribers</p>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "No subscribers found"
                : statusFilter === "pending"
                ? "No pending subscribers"
                : "No completed subscribers"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subscriber.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => confirmDelete(subscriber._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            type={"Subscriber"}
          />
        )}
      </div>
    </div>
  );
}
