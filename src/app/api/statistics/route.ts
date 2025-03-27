import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// GET handler to fetch all statistics
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get query parameters for potential filtering or pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const Statistics =
      mongoose.models.Statistics ||
      mongoose.model(
        "Statistics",
        new mongoose.Schema({
          teaching: String,
          nonteaching: String,
          students: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        })
      );

    // Fetch the total count for pagination info
    const total = await Statistics.countDocuments();

    // Fetch statistics articles with pagination
    const statistics = await Statistics.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Most recent first

    // Return the statistics articles with pagination metadata
    return NextResponse.json(
      {
        success: true,
        data: statistics,
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
    console.error("Error fetching statistics articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch statistics articles",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
