import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Initialize Figtree font
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

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
    <html lang="en" className={figtree.variable}>
      <body className={`${figtree.className} min-h-screen max-w-screen space-y-8 flex flex-col`}>
        <div className="container mx-auto flex-1 flex-col">{children}</div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}