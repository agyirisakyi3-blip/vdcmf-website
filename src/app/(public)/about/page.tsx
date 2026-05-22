'use client';

import Link from "next/link";

// About page: mission, approach, vision/mission strip, and CTA to donate/volunteer
export default function AboutPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">About Us</span>
            <h1>Wæn ænæ Yæ — Who We Are</h1>
            <p className="banner-desc">Vision De Melbee Care Foundation was born from a deep conviction that dignity is not a privilege — it is a right.</p>
          </div>
        </div>
      </section>

      <section className="section about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
                <span className="overline text-accent">Our Mission</span>
                <p>Every child deserves access to education, every woman deserves opportunity, every man deserves support and restoration, and every community deserves hope. Like a honeybee tirelessly nurturing and sustaining its community, we are committed to empowering, uplifting, and restoring lives through compassion, innovation, and sustainable development.</p>
                <p>Our mission goes beyond charity. We focus on long-term transformation by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive independently and sustainably.</p>
              </div>
            <div className="mission-card">
                <span className="overline text-accent">Our Approach</span>
                <p>We work hand-in-hand with local leaders, families, and volunteers to identify the most pressing needs and co-create solutions that honour Ghanaian culture and wisdom. From remote villages to urban centres, our programs reach those who need them most.</p>
                <p>Through education scholarships, mobile health clinics, vocational training centres, and community development initiatives, we are building a future where every Ghanaian can live with dignity and purpose.</p>
              </div>
          </div>
        </div>
      </section>

      <section className="section-dark vm-strip">
        <div className="container">
          <div className="vm-strip-grid">
            <div className="vm-strip-item">
              <span className="overline gold">Our Vision</span>
              <p>To build empowered, educated, and socially inclusive communities where every individual can live with dignity and purpose.</p>
            </div>
            <div className="vm-strip-item">
              <span className="overline gold">Our Mission</span>
              <p>To restore hope and transform lives by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive independently and sustainably.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-invite bg-warm">
        <div className="container text-center">
          <div className="card invite-box">
            <span className="overline text-accent">Join Us</span>
            <h2>Be Part of the Change</h2>
            <p>We invite partners, donors, volunteers, and advocates to join us in restoring dignity, transforming lives, and empowering generations for a brighter future across Ghana.</p>
            <div className="invite-actions">
              <Link href="/donate" className="btn btn-primary">Support Our Work</Link>
              <Link href="/apply" className="btn btn-outline-dark">Become a Volunteer</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`

        .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .mission-card p { color: var(--text-light); line-height: 1.8; margin-bottom: 16px; }
        .vm-strip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; max-width: 900px; margin: 0 auto; }
        .vm-strip-item { padding: 32px; border-left: 3px solid var(--accent); }
        .vm-strip-item p { font-size: 1.1rem; line-height: 1.7; color: rgba(255,255,255,0.85); }
        .invite-box { max-width: 700px; margin: 0 auto; padding: 48px; }
        .invite-box h2 { margin-bottom: 16px; }
        .invite-box p { color: var(--text-light); margin-bottom: 32px; font-size: 1.05rem; line-height: 1.8; }
        .invite-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .page-banner { padding: 80px 0 40px; }
          .mission-grid { grid-template-columns: 1fr; gap: 24px; }
          .vm-strip-grid { grid-template-columns: 1fr; gap: 16px; }
          .invite-box { padding: 32px 20px; }
        }
      `}</style>
    </>
  );
}

