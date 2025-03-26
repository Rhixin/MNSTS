"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    courseStrand: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Use Sonner toast
        toast.success("Your message has been sent successfully.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
          courseStrand: "",
          message: "",
        });
      } else {
        // Handle errors with Sonner toast
        toast.error(
          result.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error message with Sonner toast
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl">
        <Toaster position="top-right" />
        <h1 className="text-4xl font-bold mb-2">Contact Us!</h1>
        <p className="text-gray-500 mb-2">Want to know more about MNSTS?</p>
        <p className="text-gray-500 mb-6">Leave a message below:</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {/* First row */}
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100"
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100"
              required
            />

            {/* Second row */}
            <Input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100"
              required
            />

            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-4 bg-gray-100"
              required
            />

            {/* Third row - courseStrand takes full width on smaller screens
               and half width on larger screens */}
            <div className="md:col-span-1">
              <Input
                type="text"
                name="courseStrand"
                placeholder="Grade/SHS Strand"
                value={formData.courseStrand}
                onChange={handleChange}
                className="w-full p-4 bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Message text area - full width */}
          <Textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-4 bg-gray-100 min-h-[100px]"
            required
          />

          <Button
            type="submit"
            className="px-10 py-6 bg-[#4daa57] text-white font-bold rounded-full  cursor-pointer  hover:none transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
