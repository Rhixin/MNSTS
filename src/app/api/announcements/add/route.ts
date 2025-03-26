// app/api/announcements/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the announcements schema and model
const announcementSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the announcements model (create it if it doesn't exist)
const Announcements =
  mongoose.models.Announcements ||
  mongoose.model("Announcements", announcementSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new announcements document
    const newAnnouncement = new Announcements({
      content: body.content,
    });

    // Save the announcements document to the database
    const savedAnnouncements = await newAnnouncement.save();

    // Return the saved announcements document
    return NextResponse.json(
      { success: true, data: savedAnnouncements },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding announcemenets:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { error: "Validation error", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to add announcement" },
      { status: 500 }
    );
  }
}
