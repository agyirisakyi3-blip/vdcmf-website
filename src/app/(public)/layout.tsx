"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Layout for public-facing pages: wraps content with Navbar and Footer
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("public-theme");
    if (stored === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute("data-public-theme", "dark");
      localStorage.setItem("public-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-public-theme");
      localStorage.setItem("public-theme", "light");
    }
  }, [dark]);

  const onToggle = () => setDark((prev) => !prev);

  return (
    <>
      <Navbar dark={dark} onToggle={onToggle} />
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
