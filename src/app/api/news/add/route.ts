// app/api/news/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the News schema and model
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Get the News model (create it if it doesn't exist)
const News = mongoose.models.News || mongoose.model('News', newsSchema);

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.author || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new news document
    const newNews = new News({
      title: body.title,
      images: Array.isArray(body.images) ? body.images : [],
      author: body.author,
      content: body.content
    });
    
    // Save the news document to the database
    const savedNews = await newNews.save();
    
    // Return the saved news document
    return NextResponse.json(
      { success: true, data: savedNews },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding news:', error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation error', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: 'Failed to add news' },
      { status: 500 }
    );
  }
}