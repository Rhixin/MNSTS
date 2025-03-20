// lib/mongodb.ts
import mongoose from "mongoose";

// Check for MongoDB URI environment variable
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI: string = process.env.MONGODB_URI;

// Validate MongoDB URI format
if (
  !MONGODB_URI.startsWith("mongodb://") &&
  !MONGODB_URI.startsWith("mongodb+srv://")
) {
  throw new Error(
    "Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://"
  );
}

// Global cached connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using mongoose
 */
async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // Create new connection if one isn't in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add these options for more reliable connections
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
