"use client";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import LoadingSpinner from "./LoadingSpinner";
import Organization from "../app/(pages)/organizations/page";

export default function OrganizationsDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newLogo, setLogo] = useState(null);
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
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();

      if (data.success) {
        setOrganizations(data.data);
      } else {
        console.log("Failed to fetch organizations:", data.message);
      }
    } catch (error) {
      console.log("Error fetching organizations:", error);
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
        `/api/organizations/delete?id=${selectedOrganizationId}`,
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

    try {
      // First upload the image to Cloudinary
      let imageUrl;
      let logoUrl;

      try {
        imageUrl = await uploadImageToCloudinary(newImage);
        logoUrl = await uploadImageToCloudinary(newLogo);
        if (!imageUrl) throw new Error("Failed to upload image");
        if (!logoUrl) throw new Error("Failed to upload image");
      } catch (err) {
        setError("Error uploading image: " + err.message);
        setSubmitting(false);
        return;
      }

      // Create the updated organization object
      const updatedOrganization = {
        ...newOrganization,
        image_path: imageUrl.toString(),
        logo_path: logoUrl.toString(),
      };

      // Update state
      setNewOrganization(updatedOrganization);

      // Wait for the next render cycle before making the fetch request
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Now use the updated object for fetch
      const res = await fetch("/api/organizations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrganization),
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
      setNewImage(null);
      setLogo(null);
      setShowModal(false);

      fetchOrganizations();
    } catch (err) {
      alert("Error adding organization");
    } finally {
      setSubmitting(false);
    }
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
      console.log("Error uploading image:", error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleModalClose = () => {
    if (!submitting) {
      setShowModal(false);
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

  const handleLogoChange = (e) => {
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
    setLogo(file);
  };

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

      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Logo</th>
              <th className="border p-2">Club Name</th>
              <th className="border p-2">President</th>
              <th className="border p-2">Adviser</th>
              <th className="border p-2">Activities</th>
              <th className="border p-2">Projects</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="border p-2">
                  <img
                    src={item.image_path}
                    alt={item.title}
                    className="w-16 h-16 object-cover mx-auto rounded"
                  />
                </td>
                <td className="border p-2">
                  <img
                    src={item.logo_path}
                    alt={item.title}
                    className="w-16 h-16 object-cover mx-auto rounded"
                  />
                </td>
                <td className="border p-2">{item.clubName}</td>
                <td className="border p-2">{item.president}</td>
                <td className="border p-2">{item.adviser}</td>
                <td className="border p-2">{item.activities}</td>
                <td className="border p-2">{item.projects}</td>

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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          type={"Organization"}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Add Organization
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

            <div className="space-y-3 max-h-[550px] overflow-y-scroll px-1 pr-4 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Enter news title"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newOrganization.clubName}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      clubName: e.target.value,
                    }))
                  }
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter news content"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  rows="4"
                  value={newOrganization.description}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={submitting}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  President
                </label>
                <input
                  type="text"
                  placeholder="Enter author name"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newOrganization.president}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      president: e.target.value,
                    }))
                  }
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adviser
                </label>
                <input
                  type="text"
                  placeholder="Enter author name"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  value={newOrganization.adviser}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      adviser: e.target.value,
                    }))
                  }
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activities
                </label>
                <textarea
                  placeholder="Enter news content"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  rows="2"
                  value={newOrganization.activities}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      activities: e.target.value,
                    }))
                  }
                  disabled={submitting}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projects
                </label>
                <textarea
                  placeholder="Enter news content"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  rows="2"
                  value={newOrganization.projects}
                  onChange={(e) =>
                    setNewOrganization((prev) => ({
                      ...prev,
                      projects: e.target.value,
                    }))
                  }
                  disabled={submitting}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlighted Image (PNG or JPG only)
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Logo (PNG or JPG only)
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0a4d2e] focus:border-[#0a4d2e] outline-none"
                  onChange={handleLogoChange}
                  disabled={submitting}
                />
                {newLogo && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {newLogo.name} ({(newLogo.size / 1024).toFixed(1)}{" "}
                    KB)
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
                onClick={handleAddOrganization}
                disabled={submitting || imageUploading}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Add Organization"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
