import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get or create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Registration endpoint
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse the request body
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
    
    // Create a new user
    const newUser = new User({
      username,
      password, // Password will be hashed by the pre-save middleware
    });
    
    // Save the user to the database
    await newUser.save();
    
    // Return success response (exclude password)
    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

// Login endpoint
export async function PUT(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse the request body
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    // You should store this secret in an environment variable
    const JWT_SECRET = process.env.JWT_SECRET
    
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );
    
    // Return success response with JWT token (exclude password)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
      },
      token: token,
      message: "Login successful. Store this JWT token in localStorage for authentication."
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
