import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse the request body
    const data = await request.json();

    // Create a new Subscribers document (is_done will default to false)
    // Validate required fields
    if (!data.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new announcements document
    const newSubscribers = new Subscribers({
      content: data.content,
    });

    // Save the announcements document to the database
    const savedSubscribers = await newSubscribers.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: savedSubscribers,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in Subscribers form submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
