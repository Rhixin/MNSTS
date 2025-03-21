"use client";
import { useEffect, useState } from "react";

export default function OrganizationsDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [newOrganization, setNewOrganization] = useState({
    clubName: "",
    description: "",
    president: "",
    adviser: "",
    activities: "",
    projects: "",
    image_path: "",
    logo_path: "",
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/organizations");
      const data = await response.json();

      if (data.success) {
        setOrganizations(data.data);
      } else {
        console.error("Failed to fetch organizations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedOrganizationId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrganizationId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/organizations/delete?id=${selectedOrganizationId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete organization");

      setShowDeleteModal(false);
      setOrganizations(
        organizations.filter((item) => item._id !== selectedOrganizationId)
      );
    } catch (err) {
      alert("Failed to delete Organization");
    }
  };

  const handleAddOrganization = async () => {
    if (!newOrganization.clubName || !newOrganization.description) {
      alert("Club Name and Description are required!");
      return;
    }

    console.log(newOrganization);

    try {
      const res = await fetch("http://localhost:3000/api/organizations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrganization),
      });

      if (!res.ok) throw new Error("Failed to add organization");

      setNewOrganization({
        clubName: "",
        description: "",
        president: "",
        adviser: "",
        activities: "",
        projects: "",
        image_path: "",
        logo_path: "",
      });
      setShowModal(false);

      fetchOrganizations();
    } catch (err) {
      alert("Error adding organization");
    }
  };

  if (loading) return <p>Loading organizations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg overflow-x-scroll">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded"
          onClick={() => setShowModal(true)}
        >
          Add Organization
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Club Name</th>
            <th className="border p-2">President</th>
            <th className="border p-2">Adviser</th>
            <th className="border p-2">Activities</th>
            <th className="border p-2">Projects</th>
            <th className="border p-2">Image Path</th>
            <th className="border p-2">Logo Path</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((item) => (
            <tr key={item._id} className="text-center">
              <td className="border p-2">{item.clubName}</td>
              <td className="border p-2">{item.president}</td>
              <td className="border p-2">{item.adviser}</td>
              <td className="border p-2">{item.activities}</td>
              <td className="border p-2">{item.projects}</td>
              <td className="border p-2">{item.image_path}</td>
              <td className="border p-2">{item.logo_path}</td>
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
          {organizations.length === 0 && (
            <tr>
              <td colSpan={4} className="border p-2 text-gray-500">
                No organizations available.
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
            <p>Are you sure you want to delete this Organization?</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Organization</h2>
            <input
              type="text"
              placeholder="Club Name"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.clubName}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  clubName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="President"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.president}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  president: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Adviser"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.adviser}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  adviser: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.description}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  description: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Activities"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.activities}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  activities: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Projects"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.projects}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  projects: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Image Path"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.image_path}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  image_path: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Logo Path"
              className="w-full p-2 border rounded mb-2"
              value={newOrganization.logo_path}
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  logo_path: e.target.value,
                })
              }
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
                onClick={handleAddOrganization}
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
