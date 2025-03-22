"use client";
import React, { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function Event() {
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (data.success) {
          setEvents(data.data);
        } else {
          console.error("Failed to fetch events:", data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on selected date
  const handleDateChange = (newDate) => {
    setDate(newDate);

    // Filter events that match the selected date
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date); // Ensure event.date is a Date object

      return (
        eventDate.getDate() === newDate.getDate() &&
        eventDate.getMonth() === newDate.getMonth() &&
        eventDate.getFullYear() === newDate.getFullYear()
      );
    });

    setSelectedEvents(filtered);
  };

  if (loading)
    return (
      <div className="flex flex-col md:flex-row gap-8 p-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">CALENDAR</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="rounded-md border"
          />
        </div>

        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">UPCOMING EVENTS</h2>

            <div className="mt-6">
              <div className="w-full h-20 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">CALENDAR</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) =>
              events.some((event) => {
                const eventDate = new Date(event.date);
                return (
                  eventDate.getDate() === date.getDate() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getFullYear() === date.getFullYear()
                );
              }),
            selectedDate: (calendarDate) =>
              date.getDate() === calendarDate.getDate() &&
              date.getMonth() === calendarDate.getMonth() &&
              date.getFullYear() === calendarDate.getFullYear(),
          }}
          modifiersStyles={{
            hasEvent: {
              backgroundColor: "#4daa57",
              color: "white",
              fontWeight: "bold",
              borderRadius: "100%",
            },
            selectedDate: {
              backgroundColor: "#d1d5db", // Gray color
              color: "white",
              fontWeight: "bold",
              borderRadius: "100%",
            },
          }}
        />
      </div>

      <div className="flex-1">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">UPCOMING EVENTS</h2>

          {selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((event) => (
                <div
                  key={event._id}
                  className="border-l-4 border-amber-400 pl-4 py-2"
                >
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(event.date).toLocaleDateString()}, {event.time}
                  </p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded text-center">
              <p>No events scheduled for this date.</p>
              <p className="text-sm text-gray-500 mt-2">
                Select a different date or check back later.
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">All Upcoming Events</h3>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleDateChange(new Date(event.date))}
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
