"use client";

import { usePageTitle } from "@/app/seo";

const placeholderPosts = [
  {
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    category: "Education",
    title: "Coming Soon",
    excerpt:
      "Stories of transformation through education — stay tuned for scholarship success stories and school impact reports.",
    date: "Coming 2026",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
    category: "Health",
    title: "Coming Soon",
    excerpt:
      "Updates on our mobile health clinics, wellness campaigns, and health outreach initiatives across rural Ghana.",
    date: "Coming 2026",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    category: "Community",
    title: "Coming Soon",
    excerpt:
      "Community development stories highlighting advocacy, food security, and women empowerment programs.",
    date: "Coming 2026",
  },
];

export default function BlogPage() {
  usePageTitle("News & Stories | VDMCF");

  return (
    <section className="blog-page">
      <div className="container">
        <div className="section-header centered">
          <div className="adinkra-border">
            <i className="fas fa-newspaper"></i>
          </div>
          <h2>Latest News &amp; Stories</h2>
          <div className="kente-divider"></div>
          <p className="coming-soon-message">
            Blog posts coming soon. Stay tuned for updates on our programs,
            impact stories, and community news across Ghana.
          </p>
        </div>

        <div className="blog-grid">
          {placeholderPosts.map((post, i) => (
            <article className="blog-card" key={i}>
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-card-category">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <time className="blog-card-date">{post.date}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-page {
          padding: 100px 0;
          background: var(--cream);
          min-height: 100vh;
        }
        .section-header.centered p {
          max-width: 600px;
        }
        .coming-soon-message {
          font-size: 1.1rem;
          line-height: 1.7;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .blog-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        .blog-card-image {
          height: 280px;
          overflow: hidden;
          position: relative;
        }
        .blog-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .blog-card:hover .blog-card-image img {
          transform: scale(1.1);
        }
        .blog-card-category {
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
        .blog-card-content {
          padding: 28px;
        }
        .blog-card-date {
          display: block;
          font-size: 0.85rem;
          color: var(--gray-light);
          margin-bottom: 8px;
        }
        .blog-card-content h3 {
          font-size: 1.25rem;
          color: var(--charcoal);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .blog-card-content p {
          color: var(--gray);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
          .blog-page {
            padding: 60px 0;
          }
          .blog-card-image {
            height: 220px;
          }
        }
      `}</style>
    </section>
  );
}
