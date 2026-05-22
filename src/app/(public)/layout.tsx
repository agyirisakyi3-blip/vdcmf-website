"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Layout for public-facing pages: wraps content with Navbar and Footer
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />

      <style jsx>{`
        .main-content {
          min-height: 80vh;
        }
      `}</style>
    </>
  );
}
