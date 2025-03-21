import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the Event schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
});

// Ensure the model is registered (avoid overwriting in hot reloads)
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

// GET handler to fetch all events
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get query parameters for pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Fetch the total count for pagination
    const total = await Event.countDocuments();

    // Fetch events with pagination
    const events = await Event.find({})
      .limit(limit)
      .skip(skip)
      .sort({ date: 1 }); // Sort by date (earliest first)

    // Return events with pagination metadata
    return NextResponse.json(
      {
        success: true,
        data: events,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
