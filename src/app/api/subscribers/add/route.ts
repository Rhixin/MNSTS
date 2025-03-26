import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define Subscribers Schema
const subscribersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Register Model (Avoid Re-declaring)
const Subscribers =
  mongoose.models.Subscribers ||
  mongoose.model("Subscribers", subscribersSchema);

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Ensure request content type is JSON
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 }
      );
    }

    // Parse the request body
    const data = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { error: "Missing email field" },
        { status: 400 }
      );
    }

    // Check if email already exists in the database
    const existingSubscriber = await Subscribers.findOne({ email: data.email });
    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email is already subscribed" },
        { status: 409 }
      );
    }

    // Create a new subscriber document
    const newSubscriber = new Subscribers({
      email: data.email,
    });

    // Save the subscriber to the database
    const savedSubscriber = await newSubscriber.save();

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber added successfully",
        data: savedSubscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in subscriber submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
