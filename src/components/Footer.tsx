"use client";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch subscribers only when the component mounts
    fetchSubscribers();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  const handleAddSubscriber = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!email) {
      alert("Email is required!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check if email already exists in current state (case-insensitive)
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

      // Update the subscribers list with the new data
      // This avoids the need to fetch the entire list again
      setSubscribers([...subscribers, { email }]);
      
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
    <footer className="bg-gradient-to-r from-gray-100 via-white to-gray-200 py-12 w-full text-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900">MNSTS</h3>
            <p className="text-gray-600 mt-2">Stay updated with our latest news</p>
          </div>

          <div className="w-full">
            {!subscribed ? (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:ml-auto md:mr-0"
                onSubmit={handleAddSubscriber}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800 shadow-sm"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#087444] text-white font-medium rounded-md hover:bg-[#076239] transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800 font-medium shadow-sm max-w-md mx-auto md:ml-auto md:mr-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Thanks for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Contact information with icons */}
        <div className="mt-10 pt-8 border-t border-gray-300">
          <h4 className="text-xl font-semibold text-gray-800 text-center mb-6">Contact Us</h4>
          
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-1">NMES East, Poblacion, Medellin, Cebu, Philippines, 6012</p>
            <p className="text-gray-600 mb-1">(032) 231 5381</p>
            <p className="text-gray-600">medellinscihi@gmail.com</p>
          </div>
          
          {/* Social Media Icons (optional) */}
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-500 hover:text-[#087444] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#087444] transition-colors">
              <span className="sr-only">Email</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#087444] transition-colors">
              <span className="sr-only">Phone</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MNSTS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;