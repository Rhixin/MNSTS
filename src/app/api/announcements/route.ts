import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Announcements from "../../(pages)/announcements/page";

// GET handler to fetch all announcements
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get query parameters for potential filtering or pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const Announcements =
      mongoose.models.Announcements ||
      mongoose.model(
        "Announcements",
        new mongoose.Schema({
          content: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        })
      );

    // Fetch the total count for pagination info
    const total = await Announcements.countDocuments();

    // Fetch announcements articles with pagination
    const announcements = await Announcements.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Most recent first

    // Return the announcements articles with pagination metadata
    return NextResponse.json(
      {
        success: true,
        data: announcements,
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
    console.error("Error fetching announcements articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch announcements articles",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
