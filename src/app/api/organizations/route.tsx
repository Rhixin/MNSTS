import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// GET handler to fetch all organizations
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get query parameters for potential filtering or pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const Organizations =
      mongoose.models.OrganizationsV2 ||
      mongoose.model(
        "OrganizationsV2",
        new mongoose.Schema({
          clubName: String,
          description: String,
          officers: String,  // Changed from "president" to "officers"
          adviser: String,
          activities: String,
          image_path: String,
          logo_path: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        })
      );

    // Fetch the total count for pagination info
    const total = await Organizations.countDocuments();

    // Fetch organizations with pagination
    const organizations = await Organizations.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Most recent first

    // Return the organizations with pagination metadata
    return NextResponse.json(
      {
        success: true,
        data: organizations,
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
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organizations",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}