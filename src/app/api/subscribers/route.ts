import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

//Define schema Subscribers
const subscribersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscribers =
  mongoose.models.Subscribers ||
  mongoose.model("Subscribers", subscribersSchema);

export async function GET(request) {
  try {
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    const sort = searchParams.get("sort") || "-createdAt"; // Default to newest first
    const isDone = searchParams.get("is_done"); // Optional filter by is_done status

    // Build query
    const query = {};
    if (isDone !== null && isDone !== undefined) {
      // Convert string to boolean
      query.is_done = isDone === "true";
    }

    // Count total documents for pagination
    const total = await Subscribers.countDocuments(query);

    // Fetch Subscriberss with pagination
    const Subscriberss = await Subscribers.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: Subscriberss,
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
    console.error("Error fetching Subscriberss:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch Subscriberss",
      },
      { status: 500 }
    );
  }
}
