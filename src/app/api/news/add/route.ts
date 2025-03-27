// app/api/news/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Define the News schema and model
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Get the News model (create it if it doesn't exist)
const News = mongoose.models.News || mongoose.model("News", newsSchema);

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
async function sendEmailReceipt(transporter, subscriber, newsItem) {
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
      from: `"${process.env.EMAIL_SENDER_NAME || "MNSTS Newsletter"}" <${
        process.env.EMAIL_USER
      }>`,
      to: recipientEmail,
      subject: `New Content: ${newsItem.title}`,
      text: `Hello Subscriber,\n\nA new article has been published:\n\nTitle: ${newsItem.title}\nAuthor: ${newsItem.author}\n\n${newsItem.content}\n\nView all news: https://mnsts.vercel.app/news\n\nRegards,\nYour Newsletter Team`,
      html: `<div>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://mnsts.vercel.app/images/MNSTS_logo.jpg" alt="MNSTS Logo" style="max-width: 120px; height: auto; border-radius: 50%; object-fit: cover;">
        </div>
        <p>Hello Subscriber,</p>
        <p>A new article has been published:</p>
        <div style="margin: 20px 0; padding: 15px; border-left: a4px solid #087444;">
          <h2 style="color: #087444;">${newsItem.title}</h2>
          <p><strong>Author:</strong> ${newsItem.author}</p>
          <div style="margin-top: 10px;">
            ${newsItem.content.replace(/\n/g, "<br>")}
          </div>
          ${
            newsItem.images && newsItem.images.length > 0
              ? `<div style="margin-top: 15px;">
              ${newsItem.images
                .map(
                  (img) =>
                    `<img src="${img}" alt="Article image" style="max-width: 100%; height: auto; margin-bottom: 10px;">`
                )
                .join("")}
            </div>`
              : ""
          }
        </div>
        <p style="margin-top: 20px;">
          <a href="https://mnsts.vercel.app/news" style="display: inline-block; background-color: #087444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View All News</a>
        </p>
        <p>Regards,<br>Your MNSTS Newsletter Team</p>
      </div>`,
    });

    console.log(`Email sent successfully to ${recipientEmail}`);
    return { success: true, email: recipientEmail, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Error sending email to ${subscriber.email || "unknown"}:`,
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
async function sendBatchEmails(newsItem) {
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
        sendEmailReceipt(transporter, subscriber, newsItem)
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
    console.error("Error in batch email sending:", error);
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
    if (!body.title || !body.author || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new news document
    const newNews = new News({
      title: body.title,
      images: Array.isArray(body.images) ? body.images : [],
      author: body.author,
      content: body.content,
      createdAt: body.createdAt,
    });

    // Save the news document to the database
    const savedNews = await newNews.save();

    // Send batch emails to subscribers
    let emailResults = { success: false };
    if (body.sendNotifications !== false) {
      emailResults = await sendBatchEmails(savedNews);
    }

    // Return the saved news document and email results
    return NextResponse.json(
      {
        success: true,
        data: savedNews,
        emailNotifications: emailResults,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding news:", error);

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
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}
