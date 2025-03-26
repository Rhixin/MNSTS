"use client";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubscribers(); // Fetch subscribers when the component mounts
  }, []);

  const handleAddSubscriber = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!email) {
      alert("Email is required!");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchSubscribers(); // Ensure the latest list of subscribers is loaded

      console.log("Current Subscribers:", subscribers);

      // Check if email already exists (case-insensitive)
      if (
        subscribers.some(
          (sub) => sub.email.toLowerCase() === email.toLowerCase()
        )
      ) {
        alert("Email is already subscribed!");
        setIsSubmitting(false);
        return;
      }

      console.log("Adding subscriber:", email);

      const res = await fetch("/api/subscribers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to add subscriber");
      }

      const result = await res.json();
      console.log("Added Subscriber Response:", result);

      setEmail("");
      setSubscribed(true);
    } catch (err) {
      console.error("Error adding subscriber:", err);
      alert("Error adding subscriber");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch subscribers from the API
  async function fetchSubscribers() {
    try {
      const res = await fetch("/api/subscribers");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched Subscribers:", data.data);

      setSubscribers(data.data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  }

  return (
    <footer className="bg-gradient-to-r from-gray-100 via-white to-gray-200 py-8 min-w-full text-gray-800 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">MNSTS</h3>
            <p className="text-gray-600">Stay updated with our latest news</p>
          </div>

          <div className="w-full md:w-auto">
            {!subscribed ? (
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={handleAddSubscriber}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#087444] text-white font-medium rounded hover:bg-[#076239] transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            ) : (
              <div className="text-gray-700 font-medium">
                Thanks for subscribing!
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-500 text-lg">
          <p>Contact Us</p>
          <p>NMES East, Poblacion, Medellin, Cebu, Philippines, 6012</p>
          <p>(032) 231 5381</p>
          <p>medellinscihi@gmail.com</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MNSTS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
