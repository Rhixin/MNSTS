import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

//Define schema contact
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile phone is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  courseStrand: {
    type: String,
    required: [true, "Course/SHS Strand is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  is_done: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    const sort = searchParams.get('sort') || '-createdAt'; // Default to newest first
    const isDone = searchParams.get('is_done'); // Optional filter by is_done status
    
    // Build query
    const query = {};
    if (isDone !== null && isDone !== undefined) {
      // Convert string to boolean
      query.is_done = isDone === 'true';
    }
    
    // Count total documents for pagination
    const total = await Contact.countDocuments(query);
    
    // Fetch contacts with pagination
    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch contacts'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse the request body
    const data = await request.json();

    // Validate the required fields
    const requiredFields = [
      "name",
      "email",
      "mobile",
      "address",
      "courseStrand",
      "message",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required`,
          },
          { status: 400 }
        );
      }
    }

    // Create a new contact document (is_done will default to false)
    const contact = await Contact.create(data);

    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: contact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

// Add DELETE method to remove a contact by ID
export async function DELETE(request) {
  try {
    await connectDB();
    
    // Parse the URL to get the ID parameter
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required'
      }, { status: 400 });
    }
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid contact ID format'
      }, { status: 400 });
    }
    
    // Find and delete the contact
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return NextResponse.json({
        success: false,
        message: 'Contact not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
      data: deletedContact
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete contact'
    }, { status: 500 });
  }
}

// Add PATCH method to update a contact's is_done status
export async function PATCH(request) {
  try {
    await connectDB();
    
    // Parse the URL to get the ID parameter
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Contact ID is required'
      }, { status: 400 });
    }
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid contact ID format'
      }, { status: 400 });
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Find and update the contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: { is_done: data.is_done } },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return NextResponse.json({
        success: false,
        message: 'Contact not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update contact'
    }, { status: 500 });
  }
}