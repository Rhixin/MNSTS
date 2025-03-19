// app/api/test-connection/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Test the connection
    await connectDB();
    
    // Check if we're actually connected
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        { 
          success: false,
          message: 'MongoDB connection not ready',
          connectionState: 'disconnected',
          readyState: mongoose.connection.readyState
        },
        { status: 500 }
      );
    }
    
    // Return success response with connection info
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      connectionState: 'connected',
      dbName: mongoose.connection.db?.databaseName || 'unknown',
      host: mongoose.connection.host,
      models: Object.keys(mongoose.models)
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to connect to MongoDB',
        error: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}