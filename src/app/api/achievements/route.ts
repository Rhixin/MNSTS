import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the Achievement schema (if not already defined)
const AchievementSchema = new mongoose.Schema({
  category: String,
  headline: String,
  description: String,
  image_path: String,
  createdAt: { type: Date, default: Date.now },
});

// Use an existing model or create a new one
const Achievement =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);

// ✅ GET handler to fetch all Achievements with pagination
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Extract query parameters for pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await Achievement.countDocuments();

    // Fetch Achievements with pagination
    const achievements = await Achievement.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Most recent first

    // Return Achievements with pagination details
    return NextResponse.json(
      {
        success: true,
        data: achievements,
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
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch achievements",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
