import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.about}>
            <Link href="/" className={styles.footerLogo}>
              <img src="/logo.jpeg" alt="VDMCF logo" width={64} height={64} />
            </Link>
            <p>
              Vision De Melbee Care Foundation is a non-profit humanitarian organization
              born from the conviction that dignity is a right — dedicated to restoring
              dignity, transforming lives, and empowering generations in Ghana and beyond.
            </p>
          </div>

          <div className={styles.links}>
            <h4>About</h4>
            <Link href="/about">About Us</Link>
            <Link href="/programs">Programs</Link>
            <Link href="/blog">Stories</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.links}>
            <h4>Get Involved</h4>
            <Link href="/donate">Donate</Link>
            <Link href="/apply/volunteer">Volunteer</Link>
            <Link href="/get-involved">Fundraise</Link>
            <Link href="/get-involved">Advocacy</Link>
          </div>

          <div className={styles.links}>
            <h4>Resources</h4>
            <Link href="/blog">Annual Reports</Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <Link href="/apply/partnership">Partnership</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Vision De Melbee Care Foundation. All rights reserved.</p>
          <div className={styles.badges}>
            <span>Registered Non-Profit Organization</span>
            <span className="ghana-badge"><i className="fas fa-heart"></i> Made in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
