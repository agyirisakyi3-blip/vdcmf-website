'use client';

// Placeholder blog posts — content coming in 2026
const posts = [
  { image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80", category: "Education", title: "Coming Soon", excerpt: "Stories of transformation through education — stay tuned for scholarship success stories and school impact reports.", date: "Coming 2026" },
  { image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80", category: "Health", title: "Coming Soon", excerpt: "Updates on our mobile health clinics, wellness campaigns, and health outreach initiatives across rural Ghana.", date: "Coming 2026" },
  { image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", category: "Community", title: "Coming Soon", excerpt: "Community development stories highlighting advocacy, food security, and women empowerment programs.", date: "Coming 2026" },
  { image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", category: "Volunteer", title: "Coming Soon", excerpt: "Volunteer spotlights and stories from the field — inspiring tales of dedication and community impact.", date: "Coming 2026" },
  { image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", category: "Partnership", title: "Coming Soon", excerpt: "News about our partnerships and collaborations with organizations sharing our vision.", date: "Coming 2026" },
  { image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", category: "Impact", title: "Coming Soon", excerpt: "Annual impact reports and updates on how your support is transforming lives across Ghana.", date: "Coming 2026" },
];

// Blog listing page showing placeholder posts by category
export default function BlogPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">News & Stories</span>
            <h1>Latest Updates</h1>
            <p className="banner-desc">Stay tuned for updates on our programs, impact stories, and community news across Ghana. Blog posts coming soon.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((post, i) => (
              <article className="card blog-card">
                  <div className="blog-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <span className="blog-category">{post.category}</span>
                  </div>
                  <div className="blog-content">
                    <time>{post.date}</time>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`

        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .blog-card { }
        .blog-image { height: 220px; overflow: hidden; position: relative; }
        .blog-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .blog-card:hover .blog-image img { transform: scale(1.08); }
        .blog-category { position: absolute; top: 16px; left: 16px; background: var(--accent); color: var(--dark); padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .blog-content { padding: 24px; }
        .blog-content time { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; }
        .blog-content h3 { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; }
        .blog-content p { color: var(--text-light); font-size: 0.9rem; line-height: 1.6; }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

