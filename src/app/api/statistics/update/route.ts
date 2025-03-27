import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the model outside the function to prevent redefinition
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

export async function PATCH(request) {
  try {
    await connectDB();

    // Get the ID from query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const data = await request.json();

    // Validate input
    if (!data.teaching || !data.nonteaching || !data.students) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find and update the document
    const updatedStatistics = await Statistics.findByIdAndUpdate(
      id,
      {
        $set: {
          teaching: data.teaching,
          nonteaching: data.nonteaching,
          students: data.students,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStatistics) {
      return NextResponse.json(
        { success: false, message: "Statistics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Statistics updated successfully",
        data: updatedStatistics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update Statistics",
      },
      { status: 500 }
    );
  }
}
