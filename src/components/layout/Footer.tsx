import Link from "next/link";
import Image from "next/image";

// Site footer with brand, navigation links, social icons, and contact info
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <Image src="/logo.svg" alt="VDCMF Logo" width={56} height={56} unoptimized />
              <span className="footer-logo-text">VDCMF</span>
            </Link>
            <p className="footer-desc">
              Vision De Melbee Care Foundation is a non-profit humanitarian organization
              born from the conviction that dignity is a right — dedicated to restoring
              dignity, transforming lives, and empowering generations in Ghana and beyond.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/about">About Us</Link>
            <Link href="/programs">Our Programs</Link>
            <Link href="/get-involved">Get Involved</Link>
            <Link href="/blog">News & Stories</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link href="/donate">Donate</Link>
            <Link href="/apply">Apply</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/team">Our Team</Link>
          </div>
          <div className="footer-col footer-contact">
            <h4>Contact</h4>
            <p><i className="fas fa-map-marker-alt" /> Accra, Ghana</p>
            <p><i className="fas fa-phone" /> +233 XX XXX XXXX</p>
            <p><i className="fas fa-envelope" /> info@vdcmf.org</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Vision De Melbee Care Foundation. All rights reserved.</p>
          <div className="footer-badges">
            <span className="footer-badge">Registered Non-Profit</span>
            <span className="footer-badge footer-badge-gold">Made in Ghana</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--primary-dark, #0D2B1F);
          padding: 80px 0 0;
          color: rgba(255,255,255,0.8);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .footer-logo-link :global(img) {
          border-radius: 50%;
          object-fit: cover;
        }
        .footer-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white);
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.8;
          opacity: 0.7;
          max-width: 380px;
          margin-bottom: 24px;
        }
        .footer-social {
          display: flex;
          gap: 12px;
        }
        .footer-social a {
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .footer-social a:hover {
          background: var(--accent);
          color: var(--dark);
          transform: translateY(-2px);
        }
        .footer-col h4 {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer-col a {
          display: block;
          color: rgba(255,255,255,0.6);
          padding: 8px 0;
          font-size: 0.9rem;
        }
        .footer-col a:hover {
          color: var(--accent);
          padding-left: 4px;
        }
        .footer-contact p {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          opacity: 0.7;
          padding: 6px 0;
        }
        .footer-contact i {
          width: 16px;
          color: var(--accent);
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          font-size: 0.85rem;
          opacity: 0.5;
        }
        .footer-badges { display: flex; gap: 12px; }
        .footer-badge {
          display: inline-flex;
          padding: 4px 14px;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid rgba(255,255,255,0.15);
          font-size: 0.78rem;
        }
        .footer-badge-gold {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--dark);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
