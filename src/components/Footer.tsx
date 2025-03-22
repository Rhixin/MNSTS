'use client'
import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribed with email:', email);
    setSubscribed(true);
    setEmail('');
  };

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
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#087444] text-white font-medium rounded hover:bg-[#076239] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-gray-700 font-medium">
                Thanks for subscribing!
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MNSTS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;