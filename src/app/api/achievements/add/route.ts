import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import Achievement from "../../../../components/Achievement";

// Define the News schema and model
const achievementSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  headline: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image_path: {
    type: String,
    required: [true, "Image is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the News model (create it if it doesn't exist)
const Achievements =
  mongoose.models.Achievements ||
  mongoose.model("Achievements", achievementSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.category || !body.headline || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new news document
    const newAchievements = new Achievements({
      category: body.category,
      headline: body.headline,
      description: body.description,
      image_path: body.image_path,
    });

    // Save the news document to the database
    const savedAchievements = await newAchievements.save();

    // Return the saved news document
    return NextResponse.json(
      { success: true, data: savedAchievements },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding achievments:", error);

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
      { error: "Failed to add achievements" },
      { status: 500 }
    );
  }
}
