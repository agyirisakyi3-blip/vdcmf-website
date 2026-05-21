"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContent}`}>
          <div className={styles.languageSwitcher}>
            <button className={`${styles.langBtn} ${styles.active}`}>EN</button>
            <button className={styles.langBtn}>FR</button>
          </div>
          <div className={styles.topLinks}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/donate" className={styles.giveBtn}>Give</Link>
          </div>
        </div>
      </div>

      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navContainer}>
            <Link href="/" className={styles.logo}>
              <img src="/logo.svg" alt="VDMCF logo" width={48} height={48} />
              <span className={styles.logoText}>VDMCF</span>
            </Link>

            <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ""}`}>
              <li
                className={`${styles.navItem} ${styles.dropdown}`}
                onMouseEnter={() => setOpenDropdown("what")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href="/about" className={styles.navLink}>What We Do</Link>
                {openDropdown === "what" && (
                  <div className={styles.dropdownContent}>
                    <Link href="/programs">Our Programs</Link>
                    <Link href="/about#vision">Vision & Mission</Link>
                  </div>
                )}
              </li>
              <li
                className={`${styles.navItem} ${styles.dropdown}`}
                onMouseEnter={() => setOpenDropdown("impact")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href="/blog" className={styles.navLink}>Our Impact</Link>
                {openDropdown === "impact" && (
                  <div className={styles.dropdownContent}>
                    <Link href="/blog">Stories</Link>
                    <Link href="/blog">News</Link>
                  </div>
                )}
              </li>
              <li className={styles.navItem}>
                <Link href="/team" className={styles.navLink}>Our Team</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/get-involved" className={styles.navLink}>Get Involved</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/donate" className={styles.navLink}>Donate</Link>
              </li>
            </ul>

            <div className={styles.navActions}>
              <Link href="/donate" className={styles.btnDonate}>Donate</Link>
              <button
                className={styles.mobileToggle}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
