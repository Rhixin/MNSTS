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

    // Use the OrganizationsV2 model instead of Organizations
    const Organizations =
      mongoose.models.OrganizationsV2 ||
      mongoose.model(
        "OrganizationsV2",
        new mongoose.Schema({
          clubName: String,
          description: String,
          officers: String,
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

    // Find and delete the organization
    const deletedOrganization = await Organizations.findByIdAndDelete(id);

    // Check if the organization was found and deleted
    if (!deletedOrganization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Organization deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      {
        message: "Failed to delete organization",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}