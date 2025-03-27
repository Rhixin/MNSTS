import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define the expected request body type
interface EmailRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipient: string;
}

// Define the POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as EmailRequestBody;
    const { name, email, subject, message, recipient} = body;

    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Using the Gmail service preset
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD,  // The app password you generated
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: subject,
      text: message,
      html: `<div>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 20px; padding: 10px; border-left: 4px solid #ccc;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>`,
    });

    // Return success response
    return NextResponse.json({ 
      message: 'Email sent successfully', 
      messageId: info.messageId 
    }, { status: 200 });
  } catch (error) {
    // Log the error and return error response
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      message: 'Error sending email', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

// Define which HTTP methods are allowed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}