// app/api/events/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the events schema and model
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the events model (create it if it doesn't exist)
const Events = mongoose.models.Events || mongoose.model("Events", eventSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new event document
    const newEvent = new Events({
      title: body.title,
      date: body.date,
      time: body.time,
      location: body.location,
    });

    // Save the event document to the database
    const savedEvent = await newEvent.save();

    // Return the saved event document
    return NextResponse.json(
      { success: true, data: savedEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event:", error);

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
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
