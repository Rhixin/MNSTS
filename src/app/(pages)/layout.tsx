import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto m-5 flex-1 flex-col ">{children}</div>
    </>
  );
}
