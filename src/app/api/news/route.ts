import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// GET handler to fetch all news articles
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get query parameters for potential filtering or pagination
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({
      title: String,
      author: String,
      content: String,
      images: Array,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }));
    
    // Fetch the total count for pagination info
    const total = await News.countDocuments();
    
    // Fetch news articles with pagination
    const news = await News.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Most recent first
    
    // Return the news articles with pagination metadata
    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch news articles', 
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}