"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setDropdown(null); };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={closeMenu}>
            <img src="/logo.svg" alt="VDCMF" width={40} height={40} />
            <span className="nav-logo-text">VDCMF</span>
          </Link>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li className="nav-item" onMouseEnter={() => setDropdown("about")} onMouseLeave={() => setDropdown(null)}>
              <Link href="/about" onClick={closeMenu}>About</Link>
              {dropdown === "about" && (
                <div className="nav-dropdown">
                  <Link href="/about" onClick={closeMenu}>Our Story</Link>
                  <Link href="/about#vision" onClick={closeMenu}>Vision & Mission</Link>
                  <Link href="/team" onClick={closeMenu}>Our Team</Link>
                </div>
              )}
            </li>
            <li className="nav-item">
              <Link href="/programs" onClick={closeMenu}>Programs</Link>
            </li>
            <li className="nav-item">
              <Link href="/get-involved" onClick={closeMenu}>Get Involved</Link>
            </li>
            <li className="nav-item">
              <Link href="/blog" onClick={closeMenu}>Blog</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" onClick={closeMenu}>Contact</Link>
            </li>
            <li className="nav-item mobile-only">
              <Link href="/donate" className="btn btn-primary btn-sm" onClick={closeMenu}>Donate Now</Link>
            </li>
          </ul>

          <div className="nav-right">
            <Link href="/donate" className="btn btn-primary btn-sm nav-donate-btn">Donate Now</Link>
            <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 0;
          transition: all 0.3s ease;
          background: transparent;
        }
        .navbar-scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 20px rgba(0,0,0,0.08);
          padding: 10px 0;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1002;
        }
        .nav-logo img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          transition: var(--transition);
        }
        .navbar-scrolled .nav-logo-text {
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 32px;
          margin: 0;
        }
        .nav-item { position: relative; }
        .nav-item a {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          padding: 8px 0;
          transition: var(--transition);
        }
        .navbar-scrolled .nav-item a {
          color: var(--text);
        }
        .nav-item a:hover {
          color: var(--accent);
        }
        .nav-dropdown {
          position: absolute;
          top: 100%;
          left: -12px;
          background: var(--white);
          min-width: 180px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          padding: 6px 0;
          z-index: 100;
          animation: fadeDropdown 0.2s ease;
        }
        .nav-dropdown a {
          display: block;
          padding: 10px 20px;
          font-size: 0.85rem;
          color: var(--text) !important;
        }
        .nav-dropdown a:hover {
          background: var(--warm);
          color: var(--accent) !important;
        }
        @keyframes fadeDropdown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 1002;
        }
        .nav-donate-btn {
          padding: 10px 22px;
          border-radius: var(--radius-full);
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: var(--transition);
        }
        .navbar-scrolled .hamburger span {
          background: var(--dark);
        }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .hamburger.open span { background: var(--dark); }
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 998;
        }
        .mobile-only { display: none; }

        @media (max-width: 900px) {
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 300px;
            height: 100vh;
            background: var(--white);
            flex-direction: column;
            justify-content: flex-start;
            padding: 100px 32px 32px;
            gap: 8px;
            box-shadow: -10px 0 40px rgba(0,0,0,0.1);
            transition: right 0.35s ease;
            z-index: 999;
            align-items: flex-start;
          }
          .nav-links.open {
            right: 0;
          }
          .nav-item a {
            color: var(--text) !important;
            display: block;
            padding: 14px 0;
            font-size: 1rem;
          }
          .nav-dropdown {
            position: static;
            box-shadow: none;
            padding: 0 0 0 16px;
            animation: none;
            background: transparent;
          }
          .nav-dropdown a {
            padding: 10px 0;
          }
          .hamburger { display: flex; }
          .nav-donate-btn { display: none; }
          .mobile-only { display: block; }
        }
      `}</style>
    </>
  );
}
