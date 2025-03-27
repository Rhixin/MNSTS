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

// Add connection monitoring
function setupConnectionMonitoring() {
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    cached.conn = null; // Reset connection when disconnected
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  // Monitor connection pool
  setInterval(() => {
    const numConnections = mongoose.connection.db?.serverConfig?.connections?.size || 0;
    console.log(`Active MongoDB connections: ${numConnections}`);
  }, 60000); // Log every minute
}

/**
 * Connect to MongoDB using mongoose
 */
async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if one isn't in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Increased pool size and adjusted timeouts
      maxPoolSize: 20, // Increased from 10 to 20
      minPoolSize: 5, // Maintain at least 5 connections
      serverSelectionTimeoutMS: 10000, // Increased from 5000 to 10000
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      connectTimeoutMS: 10000, // Connection timeout
      heartbeatFrequencyMS: 30000, // Check server status every 30 seconds
    };

    console.log("Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connection established");
      setupConnectionMonitoring();
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

// Properly handle process termination
if (process.env.NODE_ENV !== 'development') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
}

export default connectDB;