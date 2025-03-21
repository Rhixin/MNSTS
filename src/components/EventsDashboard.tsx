"use client";
import { useEffect, useState } from "react";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/events");
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      } else {
        console.error("Failed to fetch events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newTitle || !newDate || !newTime || !newLocation) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/events/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          date: newDate,
          time: newTime,
          location: newLocation,
        }),
      });

      if (!res.ok) throw new Error("Failed to add event");

      setShowModal(false);
      setNewTitle("");
      setNewDate("");
      setNewTime("");
      setNewLocation("");

      fetchEvents();
    } catch (err) {
      alert("Error adding event");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/events/delete/${eventId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete event");

      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {events.length === 0 && (
        <p className="text-gray-500">No events available.</p>
      )}

      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-[#0a4d2e] text-white rounded"
          onClick={() => setShowModal(true)}
        >
          Add Event
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="text-center">
              <td className="border p-2">{event.title}</td>
              <td className="border p-2">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="border p-2">{event.time}</td>
              <td className="border p-2">{event.location}</td>
              <td className="border p-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Event</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded mb-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Time"
              className="w-full p-2 border rounded mb-2"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 border rounded mb-2"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
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
                onClick={handleAddEvent}
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
