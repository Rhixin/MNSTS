// app/api/announcements/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Define the announcements schema and model
const announcementSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the announcements model (create it if it doesn't exist)
const Announcements =
  mongoose.models.Announcements ||
  mongoose.model("Announcements", announcementSchema);

// Get the Subscriber model using the correct collection name
let Subscriber;
try {
  // Try to create a model that points to the correct collection
  const tempSchema = new mongoose.Schema(
    {
      email: String,
      createdAt: Date,
      __v: Number,
    },
    {
      strict: false,
      collection: "subscribers", // Connect to the subscribers collection
    }
  );

  // Create or get the model
  Subscriber =
    mongoose.models.Subscriber || mongoose.model("Subscriber", tempSchema);
} catch (error) {
  console.error("Error accessing Subscriber model:", error);
  // Even if there's an error, try to continue with the model
  Subscriber = mongoose.models.Subscriber;
}

// Function to send email to a single subscriber
async function sendEmailReceipt(transporter, subscriber, announcement) {
  try {
    // Get the subscriber's email
    const recipientEmail = subscriber.email;

    // Check if the email exists
    if (!recipientEmail) {
      console.error("Subscriber has no email address:", subscriber);
      return {
        success: false,
        email: "unknown",
        error: "No email address found",
      };
    }

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || "MNSTS Announcements"}" <${
        process.env.EMAIL_USER
      }>`,
      to: recipientEmail,
      subject: `Important Announcement from MNSTS`,
      text: `Hello Subscriber,\n\nA new announcement has been posted:\n\n${announcement.content}\n\nView all announcements: https://mnsts.vercel.app/announcements\n\nRegards,\nMNSTS Team`,
      html: `<div>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mnsts.vercel.app/images/MNSTS_logo.jpg" alt="MNSTS Logo" style="max-width: 120px; height: auto; border-radius: 50%; object-fit: cover;">
        </div>
        <p>Hello Subscriber,</p>
        <p>A new announcement has been posted:</p>
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #087444; background-color: #f9f9f9;">
          <h2 style="color: #087444;">Important Announcement</h2>
          <div style="margin-top: 10px;">
            ${announcement.content.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="margin-top: 20px;">
          <a href="https://mnsts.vercel.app/announcements" style="display: inline-block; background-color: #087444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View All Announcements</a>
        </p>
        <p>Regards,<br>MNSTS Team</p>
      </div>`,
      attachments: [
        {
          filename: "MNSTS_logo.jpg",
          path: "https://mnsts.vercel.app/images/MNSTS_logo.jpg", // Path to the logo file on your server
          cid: "mnsts-logo", // Same as the image src in the HTML
        },
      ],
    });

    console.log(`Announcement email sent successfully to ${recipientEmail}`);
    return { success: true, email: recipientEmail, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Error sending announcement email to ${subscriber.email || "unknown"}:`,
      error
    );
    return {
      success: false,
      email: subscriber.email || "unknown",
      error: (error as Error).message,
    };
  }
}

// Function to batch send emails to all subscribers
async function sendBatchEmails(announcement) {
  // Create transporter for Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    // Fetch all subscribers
    const subscribers = await Subscriber.find({});

    if (subscribers.length === 0) {
      console.log("No subscribers found");
      return { success: true, sent: 0, total: 0 };
    }

    // Send emails to all subscribers
    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        sendEmailReceipt(transporter, subscriber, announcement)
      )
    );

    // Count successful and failed emails
    const succeeded = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.filter(
      (r) =>
        r.status === "rejected" ||
        (r.status === "fulfilled" && !r.value.success)
    ).length;

    return {
      success: true,
      sent: succeeded,
      failed: failed,
      total: subscribers.length,
    };
  } catch (error) {
    console.error("Error in batch email sending for announcements:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new announcements document
    const newAnnouncement = new Announcements({
      content: body.content,
    });

    // Save the announcements document to the database
    const savedAnnouncement = await newAnnouncement.save();

    // Send batch emails to subscribers
    let emailResults = { success: false };
    if (body.sendNotifications !== false) {
      emailResults = await sendBatchEmails(savedAnnouncement);
    }

    console.log(emailResults);

    // Return the saved announcements document and email results
    return NextResponse.json(
      {
        success: true,
        data: savedAnnouncement,
        emailNotifications: emailResults,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding announcements:", error);

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

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to add announcement" },
      { status: 500 }
    );
  }
}
