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
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID format" },
        { status: 400 }
      );
    }

    // Assuming you have an Event model
    const Event =
      mongoose.models.Event || mongoose.model("Event", new mongoose.Schema({}));

    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);

    // Check if the event was found and deleted
    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      {
        message: "Failed to delete event",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
