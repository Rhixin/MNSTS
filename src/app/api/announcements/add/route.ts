// app/api/subscribers/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the subscribers schema and model
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the subscribers model (create it if it doesn't exist)
const Subscribers =
  mongoose.models.Subscribers ||
  mongoose.model("Subscribers", subscriberSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create a new subscriber document
    const newSubscriber = new Subscribers({
      email: body.email,
    });

    // Save the subscriber document to the database
    const savedSubscriber = await newSubscriber.save();

    // Return the saved subscriber document
    return NextResponse.json(
      { success: true, data: savedSubscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding subscriber:", error);

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

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
