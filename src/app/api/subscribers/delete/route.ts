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
        { message: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Subscriber ID format" },
        { status: 400 }
      );
    }

    const Subscribers =
      mongoose.models.Subscribers ||
      mongoose.model("Subscribers", new mongoose.Schema({}));

    const deletedSubscribers = await Subscribers.findByIdAndDelete(id);

    if (!deletedSubscribers) {
      return NextResponse.json(
        { message: "Subscribers not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subscribers deleted successfully" },
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
