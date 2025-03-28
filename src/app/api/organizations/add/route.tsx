import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Define the Organization schema and model
const organizationSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: [true, "Club Name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  officers: {
    type: String,
    required: [true, "Officers is required"],
  },
  adviser: {
    type: String,
    required: [true, "Adviser is required"],
    trim: true,
  },
  activities: {
    type: String,
    required: [true, "Activities are required"],
  },
  image_path: {
    type: String,
    required: [true, "Image path is required"],
  },
  logo_path: {
    type: String,
    required: [true, "Logo path is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the Organization model (create it if it doesn't exist)
const Organizations =
  mongoose.models.OrganizationsV2 ||
  mongoose.model("OrganizationsV2", organizationSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    console.log("Connected to MongoDB");

    // Parse the request body
    const body = await request.json();
    console.log("Received body:", body);
    console.log("Officers from request:", body.officers);

    // Validate required fields
    if (
      !body.clubName ||
      !body.description ||
      !body.officers ||
      !body.adviser ||
      !body.activities ||
      !body.image_path ||
      !body.logo_path
    ) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new organization document
    const newOrganization = new Organizations({
      clubName: body.clubName,
      description: body.description,
      officers: body.officers,
      adviser: body.adviser,
      activities: body.activities,
      image_path: body.image_path,
      logo_path: body.logo_path,
    });

    console.log("Created organization object:", newOrganization);

    // Save the organization document to the database
    const savedOrganization = await newOrganization.save();
    console.log("Saved organization:", savedOrganization);

    // Return the saved organization document
    return NextResponse.json(
      { success: true, data: savedOrganization },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding organization:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("Validation errors:", validationErrors);
      return NextResponse.json(
        { error: "Validation error", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to add organization" },
      { status: 500 }
    );
  }
}
