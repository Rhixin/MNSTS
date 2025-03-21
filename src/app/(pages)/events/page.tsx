'use client'
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function Event() {
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Sample events data
  const events = [
    { id: 1, title: "Workshop: Introduction to AI", date: new Date(2025, 2, 25), time: "10:00 AM - 12:00 PM", location: "Room 101" },
    { id: 2, title: "Guest Lecture: Future of Technology", date: new Date(2025, 2, 28), time: "2:00 PM - 4:00 PM", location: "Auditorium" },
    { id: 3, title: "Networking Event", date: new Date(2025, 3, 5), time: "5:30 PM - 7:30 PM", location: "Main Hall" },
    { id: 4, title: "Research Symposium", date: new Date(2025, 3, 12), time: "9:00 AM - 5:00 PM", location: "Conference Center" }
  ];

  // Filter events based on selected date
  const handleDateChange = (newDate) => {
    setDate(newDate);
    
    // Filter events that match the selected date
    const filtered = events.filter(event => 
      event.date.getDate() === newDate.getDate() &&
      event.date.getMonth() === newDate.getMonth() &&
      event.date.getFullYear() === newDate.getFullYear()
    );
    
    setSelectedEvents(filtered);
  };

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
            hasEvent: (date) => events.some(
              event => 
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
            )
          }}
          modifiersStyles={{
            hasEvent: { 
              backgroundColor: "#4daa57", 
              color: "white",
              fontWeight: "bold",
              borderRadius: "100%" 
            }
          }}
        />
      </div>

      <div className="flex-1">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">UPCOMING EVENTS</h2>
          
          {selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map(event => (
                <div key={event.id} className="border-l-4 border-amber-400 pl-4 py-2">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-gray-600">{event.date.toLocaleDateString()}, {event.time}</p>
                  <p className="text-gray-600">Location: {event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded text-center">
              <p>No events scheduled for this date.</p>
              <p className="text-sm text-gray-500 mt-2">Select a different date or check back later.</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">All Upcoming Events</h3>
            <div className="space-y-2">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleDateChange(event.date)}
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500">{event.date.toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}