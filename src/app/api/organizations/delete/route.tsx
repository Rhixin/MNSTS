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
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Organizations ID format" },
        { status: 400 }
      );
    }

    // Assuming you have a Organization model
    const Organizations =
      mongoose.models.Organizations ||
      mongoose.model("Organizations", new mongoose.Schema({}));

    // Find and delete the Organizations article
    const deletedOrganizations = await Organizations.findByIdAndDelete(id);

    // Check if the Organizations was found and deleted
    if (!deletedOrganizations) {
      return NextResponse.json(
        { message: "Organizations article not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Organizations deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Organizations article:", error);
    return NextResponse.json(
      {
        message: "Failed to delete Organizations article",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
