// app/api/events/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Define the events schema and model
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the events model (create it if it doesn't exist)
const Events = mongoose.models.Events || mongoose.model("Events", eventSchema);

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

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Function to send email to a single subscriber
async function sendEmailReceipt(transporter, subscriber, event) {
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

    const formattedDate = formatDate(event.date);

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || "MNSTS Events"}" <${
        process.env.EMAIL_USER
      }>`,
      to: recipientEmail,
      subject: `New Event: ${event.title}`,
      text: `Hello Subscriber,\n\nA new event has been scheduled:\n\nTitle: ${event.title}\nDate: ${formattedDate}\nTime: ${event.time}\nLocation: ${event.location}\n\nView all events: https://mnsts.vercel.app/events\n\nRegards,\nMNSTS Team`,
      html: `<div>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mnsts.vercel.app/images/MNSTS_logo.jpg" alt="MNSTS Logo" style="max-width: 120px; height: auto; border-radius: 50%; object-fit: cover;">
        </div>
        <p>Hello Subscriber,</p>
        <p>A new event has been scheduled:</p>
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #087444; background-color: #f9f9f9;">
          <h2 style="color: #087444;">${event.title}</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        </div>
        <p style="margin-top: 20px;">
          <a href="https://mnsts.vercel.app/events" style="display: inline-block; background-color: #087444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View All Events</a>
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

    console.log(`Event email sent successfully to ${recipientEmail}`);
    return { success: true, email: recipientEmail, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Error sending event email to ${subscriber.email || "unknown"}:`,
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
async function sendBatchEmails(event) {
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
        sendEmailReceipt(transporter, subscriber, event)
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
    console.error("Error in batch email sending for events:", error);
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
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new event document
    const newEvent = new Events({
      title: body.title,
      date: body.date,
      time: body.time,
      location: body.location,
    });

    // Save the event document to the database
    const savedEvent = await newEvent.save();

    // Send batch emails to subscribers
    let emailResults = { success: false };
    if (body.sendNotifications !== false) {
      emailResults = await sendBatchEmails(savedEvent);
    }

    // Return the saved event document and email results
    return NextResponse.json(
      {
        success: true,
        data: savedEvent,
        emailNotifications: emailResults,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event:", error);

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
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
