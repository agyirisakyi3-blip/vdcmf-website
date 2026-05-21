"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import HeroSlider from "@/components/ui/HeroSlider";
import ScrollReveal from "@/components/ui/ScrollReveal";

/* ===== Stat Counter ===== */
function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>

      <style jsx>{`
        .stat-item {
          text-align: center;
          padding: 24px;
        }
        .stat-number {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          color: var(--cream);
          opacity: 0.7;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}

/* ===== Story Carousel ===== */
const stories = [
  {
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    tag: "Education",
    title: "Scholarship Program Transforms Lives",
    description: "Through our scholarship program, over 500 students from low-income families across Ghana have received quality education.",
  },
  {
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
    tag: "Health",
    title: "Mobile Health Clinics Reach Rural Areas",
    description: "Our mobile health clinics have provided medical care to over 2,000 people in remote villages.",
  },
  {
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&q=80",
    tag: "Vocational",
    title: "Youth Empowerment Through Skills Training",
    description: "Young people gain practical skills for economic independence through our vocational programs.",
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    tag: "Community",
    title: "Women Empowerment Initiative Grows",
    description: "Our women's empowerment program has helped over 200 women start small businesses.",
  },
];

function StoryCarousel() {
  const [current, setCurrent] = useState(0);
  const maxIndex = Math.ceil(stories.length / 3) - 1;

  const next = () => setCurrent((p) => Math.min(p + 1, maxIndex));
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));

  return (
    <section className="featured-stories">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Featured Stories</h2>
            <p>Hear firsthand from the people impacted by VDMCF projects.</p>
          </div>
          <div className="carousel-controls">
            <button className="carousel-arrow prev" onClick={prev} disabled={current === 0}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-arrow next" onClick={next} disabled={current === maxIndex}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="stories-carousel">
          <div className="stories-track" style={{ transform: `translateX(-${current * 33.333}%)` }}>
            {stories.map((story, i) => (
              <article className="story-card" key={i}>
                <div className="story-image">
                  <img src={story.image} alt={story.title} loading="lazy" />
                  <span className="story-tag">{story.tag}</span>
                </div>
                <div className="story-content">
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <Link href="/blog" className="read-more">
                    Read more <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === current ? " active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .featured-stories {
          padding: 100px 0;
          background: var(--cream);
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 24px;
        }
        .section-header h2 {
          font-size: 2.5rem;
          color: var(--charcoal);
        }
        .section-header p {
          color: var(--gray);
          max-width: 500px;
        }
        .carousel-controls {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .carousel-arrow {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          background: transparent;
          color: var(--gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 1rem;
        }
        .carousel-arrow:hover:not(:disabled) {
          background: var(--gold);
          color: var(--white);
        }
        .carousel-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .stories-carousel {
          overflow: hidden;
          position: relative;
        }
        .stories-track {
          display: flex;
          gap: 24px;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .story-card {
          min-width: calc(33.333% - 16px);
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .story-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: var(--shadow-lg);
        }
        .story-image {
          height: 220px;
          overflow: hidden;
          position: relative;
        }
        .story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .story-card:hover .story-image img {
          transform: scale(1.1);
        }
        .story-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--gold);
          color: var(--white);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .story-content {
          padding: 24px;
        }
        .story-content h3 {
          font-size: 1.25rem;
          color: var(--charcoal);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .story-content p {
          color: var(--gray);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .read-more {
          color: var(--gold);
          font-weight: 500;
          font-size: 0.9rem;
        }
        .read-more:hover {
          color: var(--gold-dark);
        }
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
        }
        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--gray-light);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        .carousel-dot.active {
          background: var(--gold);
          width: 28px;
          border-radius: 4px;
        }
        @media (max-width: 1024px) {
          .story-card { min-width: calc(50% - 12px); }
        }
        @media (max-width: 768px) {
          .story-card { min-width: calc(100% - 0px); }
          .section-header h2 { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
}

/* ===== Home Page ===== */
export default function HomePage() {
  return (
    <>
      <HeroSlider />

      {/* Feature Alert */}
      <section className="feature-alert">
        <div className="container">
          <div className="alert-card">
            <div className="alert-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="alert-content">
              <h3>Emergency Response Initiative</h3>
              <p>We&apos;re launching a new program to support families affected by the current economic crisis in Ghana.</p>
            </div>
            <Link href="/donate" className="btn btn-primary">Give Now</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <ScrollReveal>
        <section id="about" className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="adinkra-border"><i className="fas fa-ankh"></i></div>
              <span className="ghana-badge" style={{ display: "table", margin: "0 auto 16px" }}>
                <i className="fas fa-map-marker-alt"></i> Ghana, West Africa
              </span>
              <h2>Wæn ænæ Yæ — Who We Are</h2>
              <div className="kente-divider"></div>
              <p className="about-intro">
                Vision De Melbee Care Foundation was born from a deep conviction that dignity is not a privilege — it is a right.
              </p>
              <p>Every child deserves access to education, every woman deserves opportunity, every man deserves support and restoration, and every community deserves hope.</p>
              <p>Like a honeybee tirelessly nurturing and sustaining its community, we are committed to empowering, uplifting, and restoring lives through compassion, innovation, and sustainable development.</p>
              <p>Our mission goes beyond charity. We focus on long-term transformation by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive independently and sustainably.</p>
              <p className="about-cta">We invite partners, donors, volunteers, and advocates to join us in restoring dignity, transforming lives, and empowering generations for a brighter future.</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Impact Stats */}
      <section className="impact-stats">
        <div className="container">
          <div className="stats-content">
            <h2>Our Impact</h2>
            <p className="stats-intro">Since our founding, VDMCF has been responding to basic human needs and working toward sustainable development across Ghana.</p>
          </div>
          <div className="stats-grid">
            <StatCounter value={5800} suffix="+" label="Lives Impacted" />
            <StatCounter value={45} suffix="+" label="Community Programs" />
            <StatCounter value={127} label="Volunteers" />
            <StatCounter value={12} label="Years of Service" />
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <StoryCarousel />

      {/* Programs */}
      <ScrollReveal>
        <section className="programs-section">
          <div className="container">
            <div className="section-header centered">
              <div className="adinkra-border"><i className="fas fa-hands-helping"></i></div>
              <h2>What We Do</h2>
              <div className="kente-divider"></div>
              <p>We work with partners across Ghana to respond to needs, adapt to challenges, and create lasting change.</p>
            </div>

            <div className="programs-grid">
              {[
                { icon: "fa-graduation-cap", title: "Education", desc: "Providing access to quality education for underprivileged children through scholarships, learning resources, and school support programs." },
                { icon: "fa-tools", title: "Vocational Training", desc: "Equipping youth and adults with practical skills in trades like tailoring, carpentry, and IT for economic independence." },
                { icon: "fa-stethoscope", title: "Health Outreach", desc: "Promoting health and wellness through medical assistance, health screenings, and wellness education programs." },
                { icon: "fa-hands-helping", title: "Community Development", desc: "Building stronger communities through advocacy, food security initiatives, and women empowerment programs." },
              ].map((program, i) => (
                <div className="program-card" key={i}>
                  <div className="program-icon">
                    <i className={`fas ${program.icon}`}></i>
                  </div>
                  <h3>{program.title}</h3>
                  <p>{program.desc}</p>
                  <Link href="/programs" className="program-link">Learn more <i className="fas fa-arrow-right"></i></Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Get Involved */}
      <ScrollReveal>
        <section className="get-involved">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Get Involved — Biako Ye</h2>
                <div className="kente-divider" style={{ margin: "12px 0 16px 0", maxWidth: "200px" }}></div>
              </div>
              <p>There are many ways you can support VDMCF&apos;s work, right in your community or remotely.</p>
            </div>

            <div className="involved-grid">
              {[
                { icon: "fa-hands-heart", title: "Volunteer", desc: "Share your time and skills to make a difference in your community.", href: "/apply/volunteer" },
                { icon: "fa-bullhorn", title: "Advocacy", desc: "Help raise awareness about issues affecting vulnerable populations.", href: "/get-involved" },
                { icon: "fa-boxes-packing", title: "Make Kits", desc: "Assemble school supply kits or hygiene kits for distribution.", href: "/contact" },
                { icon: "fa-hand-holding-dollar", title: "Fundraise", desc: "Organize your own fundraiser to support VDMCF programs.", href: "/get-involved" },
              ].map((item, i) => (
                <div className="involved-card" key={i}>
                  <div className="involved-image">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link href={item.href} className="btn btn-outline btn-sm">{item.title}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container">
          <div className="adinkra-border"><i className="fas fa-star-and-crescent"></i></div>
          <div className="vm-content">
            <div className="vm-box">
              <h3>Our Vision</h3>
              <p>To build empowered, educated, and socially inclusive communities where every individual can live with dignity and purpose, and where no one is left behind.</p>
            </div>
            <div className="vm-box">
              <h3>Our Mission</h3>
              <p>To restore hope and transform lives by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive independently and sustainably through education, health, advocacy, and community development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proverb */}
      <section className="proverb-block">
        <div className="container">
          <div className="proverb-content">
            <p className="proverb">&ldquo;Sankofa — sæ wo were fi na wosankofa a yenkyi.&rdquo;</p>
            <p className="proverb-source">Ghanaian Proverb — It is not wrong to return for what you have forgotten. Go back and get it.</p>
            <p style={{ color: "var(--cream)", opacity: 0.5, marginTop: 16, fontSize: "0.9rem" }}>
              We honour the wisdom of our ancestors as we build for the future.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <ScrollReveal>
        <section id="team" className="team-section">
          <div className="container">
            <div className="section-header centered">
              <div className="adinkra-border"><i className="fas fa-users"></i></div>
              <h2>Meet Our Team</h2>
              <div className="kente-divider"></div>
              <p>Dedicated individuals working together to restore dignity and empower communities across Ghana.</p>
            </div>
            <div className="team-grid">
              {[
                { name: "Prophetess Melissa Marie Justine Agbelom", role: "Certified Christian Counsellor & CEO", image: "/Melissa.jpeg", bio: "Prophetess Melissa Marie Justine Agbelom is a Certified Christian Counsellor and CEO of Vision de Melbee Care Foundation, currently pursuing a BA in Theology and Biblical Studies." },
                { name: "Dr. Abena Osei", role: "Programs Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "Experienced development professional overseeing all program implementation, monitoring, and evaluation." },
                { name: "Kofi Mensah", role: "Finance & Admin Officer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", bio: "Ensuring transparent financial management and operational efficiency." },
                { name: "Akua Serwaa", role: "Community Outreach Coordinator", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", bio: "Building strong relationships with local communities and stakeholders." },
                { name: "Yaw Asante", role: "Education Programs Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", bio: "Leading scholarship programs and educational initiatives." },
                { name: "Maame Esi", role: "Health Programs Coordinator", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80", bio: "Coordinating mobile health clinics and wellness initiatives." },
              ].map((member, i) => (
                <div className="team-card" key={i}>
                  <div className="team-card-image">
                    <img src={member.image} alt={member.name} loading="lazy" />
                  </div>
                  <div className="team-card-content">
                    <h3>{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                    <p>{member.bio}</p>
                    <div className="team-social">
                      <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                      <a href="#" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Donate */}
      <section className="donate-section">
        <div className="container">
          <div className="donate-content">
            <h2>Give a Gift Where Needed Most</h2>
            <p>Every donation makes a difference in the lives of those we serve.</p>
            <div className="donation-form">
              <Link href="/donate" className="btn btn-primary btn-large">Give Today</Link>
            </div>
            <div className="trust-badges">
              <div className="badge"><i className="fas fa-lock"></i><span>Secure Giving</span></div>
              <div className="badge"><i className="fas fa-check-circle"></i><span>Tax Deductible</span></div>
              <div className="badge"><i className="fas fa-hand-holding-heart"></i><span>100% to Programs</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Banking */}
      <section className="banking-section">
        <div className="container">
          <h2>Ways to Give</h2>
          <div className="banking-grid">
            <div className="bank-card">
              <div className="bank-icon"><i className="fas fa-university"></i></div>
              <h3>Bank Transfer</h3>
              <p>Direct bank to bank transfer</p>
              <div className="bank-details">
                <div className="detail-row"><span>Bank Name:</span><span>[Bank Name]</span></div>
                <div className="detail-row"><span>Account Number:</span><span style={{ fontWeight: 600 }}>0000000000</span></div>
                <div className="detail-row"><span>Account Name:</span><span style={{ fontWeight: 600 }}>Vision De Melbee Care Foundation</span></div>
              </div>
            </div>
            <div className="bank-card">
              <div className="bank-icon"><i className="fas fa-mobile-alt"></i></div>
              <h3>Mobile Money</h3>
              <p>Instant transfer via MTN MoMo</p>
              <div className="bank-details">
                <div className="detail-row"><span>Network:</span><span>MTN</span></div>
                <div className="detail-row"><span>Number:</span><span style={{ fontWeight: 600 }}>+233 XX XXX XXXX</span></div>
              </div>
            </div>
            <div className="bank-card">
              <div className="bank-icon"><i className="fab fa-paypal"></i></div>
              <h3>PayPal</h3>
              <p>For international donors</p>
              <Link href="#" className="btn btn-outline btn-sm">Donate via PayPal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <i className="fas fa-envelope-open-text"></i>
            <h3>Stay Connected <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", opacity: 0.6 }}>— Di nkÿta</span></h3>
            <p>Subscribe to our newsletter for updates on our programs, events, and impact stories across Ghana.</p>
            <form className="newsletter-form" onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).querySelector('input')?.value;
              if (!email) return;
              await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Newsletter", email, message: "Newsletter subscription" }),
              });
              alert("Thank you for subscribing!");
              (e.target as HTMLFormElement).reset();
            }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ScrollReveal>
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Contact Us</h2>
                <p>We&apos;d love to hear from you. Get in touch with any questions or to learn more about our work.</p>
                <div className="contact-items">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div><strong>Address</strong><span>[Your Address], Ghana</span></div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div><strong>Phone</strong><span>[Your Phone Number]</span></div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div><strong>Email</strong><span>info@vdcmf.org</span></div>
                  </div>
                  <div className="contact-item">
                    <i className="fab fa-whatsapp"></i>
                    <div><strong>WhatsApp</strong><span>[Your WhatsApp]</span></div>
                  </div>
                </div>
                <div className="social-links">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
              <div className="contact-form-wrapper">
                <form className="contact-form" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = {
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    email: (form.elements.namedItem('email') as HTMLInputElement).value,
                    message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
                  };
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    });
                    const result = await res.json();
                    if (result.success) {
                      alert("Message sent! We will get back to you soon.");
                      form.reset();
                    } else {
                      alert("Something went wrong. Please try again.");
                    }
                  } catch {
                    alert("Something went wrong. Please try again.");
                  }
                }}>
                  <h3>Send Us a Message</h3>
                  <div className="form-group">
                    <input type="text" name="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" name="email" placeholder="Your Email" required />
                  </div>
                  <div className="form-group">
                    <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Additional inline styles for sections that aren't in globals.css */}
      <style jsx>{`
        .feature-alert {
          margin-top: -60px;
          position: relative;
          z-index: 20;
          padding: 0 24px;
        }
        .alert-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 24px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: var(--shadow-xl);
          max-width: 1000px;
          margin: 0 auto;
        }
        .alert-icon {
          width: 64px;
          height: 64px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .alert-icon i { font-size: 1.5rem; color: var(--white); }
        .alert-content { flex: 1; }
        .alert-content h3 { font-size: 1.25rem; color: var(--charcoal); margin-bottom: 8px; }
        .alert-content p { color: var(--gray); }
        .about-section { padding: 100px 0; background: var(--cream); }
        .about-content { max-width: 800px; margin: 0 auto; }
        .about-text h2 { font-size: 2.5rem; color: var(--charcoal); margin-bottom: 32px; text-align: center; }
        .about-intro { font-size: 1.5rem; font-weight: 600; color: var(--charcoal); line-height: 1.4; margin-bottom: 24px; border-left: 4px solid var(--gold); padding-left: 24px; }
        .about-content p { color: var(--gray); font-size: 1.125rem; line-height: 1.8; margin-bottom: 20px; }
        .about-cta { font-size: 1.25rem; font-weight: 600; color: var(--charcoal); margin-top: 32px; padding: 24px; background: var(--cream-dark); border-radius: var(--radius); text-align: center; border: 1px solid var(--gold-light); }
        .impact-stats { background: var(--charcoal); padding: 80px 0; }
        .stats-content { margin-bottom: 48px; }
        .impact-stats h2 { color: var(--white); font-size: 2.5rem; margin-bottom: 16px; }
        .stats-intro { color: var(--cream); opacity: 0.75; max-width: 600px; font-size: 1.125rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        .programs-section { padding: 100px 0; background: var(--cream-dark); position: relative; }
        .programs-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: repeating-linear-gradient(90deg, var(--gh-red) 0px, var(--gh-red) 8px, var(--gh-gold) 8px, var(--gh-gold) 16px, var(--gh-green) 16px, var(--gh-green) 24px, var(--charcoal) 24px, var(--charcoal) 32px); opacity: 0.7; }
        .programs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .program-card { background: var(--white); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .program-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 0; background: linear-gradient(90deg, var(--gh-red), var(--gh-gold), var(--gh-green), var(--kente-blue)); transition: height 0.3s ease; }
        .program-card:hover::after { height: 4px; }
        .program-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
        .program-icon { width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; transition: transform 0.3s ease, background 0.3s ease; }
        .program-card:hover .program-icon { transform: scale(1.1) rotate(-5deg); background: var(--gold); }
        .program-icon i { font-size: 1.75rem; color: var(--gold); transition: color 0.3s ease; }
        .program-card:hover .program-icon i { color: var(--white); }
        .program-card h3 { font-size: 1.25rem; color: var(--charcoal); margin-bottom: 12px; font-family: 'DM Sans', sans-serif; font-weight: 600; }
        .program-card p { color: var(--gray); line-height: 1.6; margin-bottom: 16px; font-size: 0.95rem; }
        .program-link { color: var(--gold); font-weight: 500; font-size: 0.9rem; }
        .program-link:hover { color: var(--gold-dark); }
        .get-involved { padding: 100px 0; background: var(--white); }
        .involved-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .involved-card { background: var(--cream); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; transition: all 0.3s ease; }
        .involved-card:hover { background: var(--cream-dark); transform: translateY(-4px); }
        .involved-image { width: 80px; height: 80px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .involved-image i { font-size: 1.75rem; color: var(--white); }
        .involved-card h3 { font-size: 1.25rem; color: var(--charcoal); margin-bottom: 12px; font-family: 'DM Sans', sans-serif; font-weight: 600; }
        .involved-card p { color: var(--gray); line-height: 1.5; margin-bottom: 20px; font-size: 0.95rem; }
        .vision-mission { background: var(--charcoal); padding: 80px 0; position: relative; overflow: hidden; }
        .vm-content { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .vm-box { padding: 40px; border-left: 4px solid var(--gold); }
        .vm-box h3 { font-size: 1.75rem; color: var(--gold); margin-bottom: 16px; }
        .vm-box p { color: var(--cream); font-size: 1.125rem; line-height: 1.7; }
        .proverb-block { background: var(--charcoal); color: var(--cream); padding: 60px 0; text-align: center; position: relative; overflow: hidden; }
        .proverb-block::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212, 175, 55, 0.03) 20px, rgba(212, 175, 55, 0.03) 40px); }
        .proverb-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
        .proverb { font-size: 1.5rem; font-style: italic; font-family: 'Playfair Display', serif; color: var(--gold); margin-bottom: 12px; line-height: 1.5; }
        .proverb-source { font-size: 0.95rem; color: var(--cream); opacity: 0.6; }
        .proverb-source::before { content: '\\2014 '; }
        .team-section { padding: 100px 0; background: var(--cream-dark); }
        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1100px; margin: 0 auto; }
        .team-card { background: var(--white); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); transition: all 0.3s ease; }
        .team-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
        .team-card-image { width: 100%; height: 260px; overflow: hidden; position: relative; }
        .team-card-image::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: linear-gradient(to top, var(--white), transparent); pointer-events: none; }
        .team-card-image img { width: 100%; height: 100%; object-fit: cover; object-position: center 50%; transition: transform 0.6s ease; }
        .team-card:hover .team-card-image img { transform: scale(1.08); }
        .team-card-content { padding: 24px; text-align: center; position: relative; z-index: 1; margin-top: -40px; }
        .team-card-content h3 { font-size: 1.15rem; color: var(--charcoal); margin-bottom: 4px; font-family: 'DM Sans', sans-serif; font-weight: 600; }
        .team-role { display: block; font-size: 0.85rem; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .team-card-content p { color: var(--gray); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; }
        .team-social { display: flex; justify-content: center; gap: 8px; }
        .team-social a { width: 36px; height: 36px; border-radius: 50%; background: var(--cream); color: var(--gray); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 0.85rem; }
        .team-social a:hover { background: var(--gold); color: var(--white); transform: translateY(-2px); }
        .donate-section { background: var(--cream); padding: 100px 0; }
        .donate-content { text-align: center; max-width: 600px; margin: 0 auto; }
        .donate-content h2 { font-size: 2.5rem; color: var(--charcoal); margin-bottom: 16px; }
        .donate-content > p { color: var(--gray); margin-bottom: 40px; font-size: 1.125rem; }
        .donation-form { background: var(--white); padding: 32px; border-radius: var(--radius-lg); box-shadow: var(--shadow); margin-bottom: 32px; display: flex; justify-content: center; }
        .trust-badges { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
        .trust-badges .badge { display: flex; align-items: center; gap: 8px; color: var(--gray); font-size: 0.9rem; }
        .trust-badges .badge i { color: var(--gold); }
        .banking-section { background: var(--cream-dark); padding: 80px 0; }
        .banking-section h2 { text-align: center; font-size: 2.5rem; color: var(--charcoal); margin-bottom: 48px; }
        .banking-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .bank-card { background: var(--white); border-radius: var(--radius-lg); padding: 32px; text-align: center; transition: all 0.3s ease; }
        .bank-card:hover { box-shadow: var(--shadow); }
        .bank-icon { width: 72px; height: 72px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .bank-icon i { font-size: 1.5rem; color: var(--gold); }
        .bank-card h3 { font-size: 1.25rem; color: var(--charcoal); margin-bottom: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; }
        .bank-card > p { color: var(--gray); margin-bottom: 20px; font-size: 0.9rem; }
        .bank-details { background: var(--cream); border-radius: var(--radius); padding: 16px; text-align: left; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .detail-row:last-child { border-bottom: none; }
        .detail-row span:first-child { color: var(--gray); font-size: 0.85rem; }
        .newsletter { background: var(--charcoal); padding: 80px 0; }
        .newsletter-content { text-align: center; max-width: 500px; margin: 0 auto; }
        .newsletter-content > i { font-size: 2.5rem; color: var(--gold); margin-bottom: 16px; }
        .newsletter-content h3 { font-size: 1.75rem; color: var(--white); margin-bottom: 12px; }
        .newsletter-content p { color: var(--cream); opacity: 0.7; margin-bottom: 24px; }
        .newsletter-form { display: flex; gap: 12px; }
        .newsletter-form input { flex: 1; padding: 14px 20px; border: none; border-radius: var(--radius-full); font-size: 1rem; }
        .newsletter-form input:focus { outline: none; }
        .contact-section { padding: 100px 0; background: var(--cream); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .contact-info h2 { font-size: 2.5rem; color: var(--charcoal); margin-bottom: 16px; text-align: left; }
        .contact-info > p { color: var(--gray); margin-bottom: 32px; font-size: 1.125rem; }
        .contact-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
        .contact-item { display: flex; align-items: flex-start; gap: 16px; }
        .contact-item i { width: 48px; height: 48px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); flex-shrink: 0; }
        .contact-item strong { display: block; color: var(--charcoal); margin-bottom: 4px; }
        .contact-item span { color: var(--gray); }
        .social-links { display: flex; gap: 12px; }
        .social-links a { width: 44px; height: 44px; background: var(--charcoal); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
        .social-links a:hover { background: var(--gold); }
        .contact-form-wrapper { background: var(--white); border-radius: var(--radius-lg); padding: 40px; }
        .contact-form h3 { font-size: 1.5rem; color: var(--charcoal); margin-bottom: 24px; font-family: 'DM Sans', sans-serif; }
        .form-group { margin-bottom: 16px; }
        .form-group input, .form-group textarea { width: 100%; padding: 14px 18px; border: 2px solid var(--cream); border-radius: var(--radius); font-size: 1rem; font-family: inherit; transition: all 0.3s ease; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--gold); }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .programs-grid { grid-template-columns: repeat(2, 1fr); }
          .involved-grid { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .banking-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .programs-grid { grid-template-columns: 1fr; }
          .involved-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
          .vm-content { grid-template-columns: 1fr; gap: 24px; }
          .newsletter-form { flex-direction: column; }
          .contact-form-wrapper { padding: 24px; }
          .about-intro { font-size: 1.25rem; }
        }
      `}</style>
    </>
  );
}
