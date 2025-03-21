import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Announcement ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid announcement ID format" },
        { status: 400 }
      );
    }

    const Announcement =
      mongoose.models.Announcements ||
      mongoose.model("Announcements", new mongoose.Schema({}));

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      {
        message: "Failed to delete announcement",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
