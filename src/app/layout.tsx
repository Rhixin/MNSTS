import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "MNSTS Website",
  description: "About MNSTS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen max-w-screen flex flex-col h-screen">
        <Navbar />
        <div className="container mx-auto m-5 flex-1 flex">{children}</div>
      </body>
    </html>
  );
}
