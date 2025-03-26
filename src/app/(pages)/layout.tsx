import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-6 md:pt-8">{children}</div>
    </div>
  );
}
