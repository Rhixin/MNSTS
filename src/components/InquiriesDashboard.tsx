"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const InquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', or 'done'

  // Fetch inquiries from the API
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      let queryParams = `page=${page}&limit=${limit}&sort=-createdAt`;
      
      // Add status filter if not "all"
      if (statusFilter === "pending") {
        queryParams += "&is_done=false";
      } else if (statusFilter === "done") {
        queryParams += "&is_done=true";
      }
      
      const response = await fetch(`/api/contact?${queryParams}`);
      const result = await response.json();

      if (response.ok) {
        setInquiries(result.data);
        setTotalPages(result.pagination.pages);
      } else {
        toast.error("Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Error fetching inquiries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an inquiry
  const deleteInquiry = async (id) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success("Inquiry deleted successfully");
        fetchInquiries(); // Refresh the list
        if (isModalOpen && selectedInquiry && selectedInquiry._id === id) {
          setIsModalOpen(false);
        }
      } else {
        toast.error(result.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Error deleting inquiry. Please try again.");
    }
  };

  // Toggle the is_done status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_done: !currentStatus }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success(`Inquiry marked as ${!currentStatus ? "done" : "pending"}`);
        fetchInquiries(); // Refresh the list
        
        // Update selected inquiry if open in modal
        if (isModalOpen && selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({
            ...selectedInquiry,
            is_done: !currentStatus,
          });
        }
      } else {
        toast.error(result.message || "Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      toast.error("Error updating inquiry status. Please try again.");
    }
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when filter changes
  };

  // Load inquiries when component mounts or when page/limit/statusFilter changes
  useEffect(() => {
    fetchInquiries();
  }, [page, limit, statusFilter]);

  // View inquiry details
  const viewInquiryDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading && inquiries.length === 0) {
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
          <h2 className="text-xl font-semibold">Contact Form Inquiries</h2>
          <p className="text-sm text-gray-500 mb-4">Manage and respond to inquiries from the contact form</p>
          
          {/* Status filter tabs */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => handleStatusFilterChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === "all"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Inquiries
            </button>
            <button
              onClick={() => handleStatusFilterChange("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange("done")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === "done"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {inquiries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "No inquiries found"
                : statusFilter === "pending"
                ? "No pending inquiries"
                : "No completed inquiries"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course/Strand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inquiry.is_done
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {inquiry.is_done ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{inquiry.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{inquiry.courseStrand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewInquiryDetails(inquiry)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleStatus(inquiry._id, inquiry.is_done)}
                          className={`mr-3 ${
                            inquiry.is_done
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {inquiry.is_done ? "Mark Pending" : "Mark Done"}
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry._id)}
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

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Inquiry Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedInquiry.is_done
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedInquiry.is_done ? "Done" : "Pending"}
              </span>
              <button
                onClick={() => toggleStatus(selectedInquiry._id, selectedInquiry.is_done)}
                className="ml-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                {selectedInquiry.is_done ? "Mark as Pending" : "Mark as Done"}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedInquiry.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedInquiry.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium">{selectedInquiry.mobile}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedInquiry.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Course/Strand</p>
                <p className="font-medium">{selectedInquiry.courseStrand}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date Submitted</p>
                <p className="font-medium">{formatDate(selectedInquiry.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  deleteInquiry(selectedInquiry._id);
                }}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesDashboard;