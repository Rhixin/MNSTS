import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Route handler for query parameter based deletion
export async function DELETE(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get ID from query parameter
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Achievement ID is required" },
        { status: 400 }
      );
    }

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid achievement ID format" },
        { status: 400 }
      );
    }

    // Assuming you have an Achievements model
    const Achievements =
      mongoose.models.Achievements ||
      mongoose.model("Achievements", new mongoose.Schema({}));

    // Find and delete the achievement
    const deletedAchievement = await Achievements.findByIdAndDelete(id);

    // Check if the achievement was found and deleted
    if (!deletedAchievement) {
      return NextResponse.json(
        { message: "Achievement not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Achievement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      {
        message: "Failed to delete achievement",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
