"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
];

export default function NewBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "",
    published: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Blog post created successfully!");
        router.push("/admin/blog");
      } else {
        alert("Blog API coming soon — post was not saved.");
      }
    } catch {
      alert("Blog API coming soon — post was not saved.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <style jsx>{`
          .loading-page {
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            background: var(--cream);
          }
          .spinner {
            width: 40px; height: 40px;
            border: 4px solid var(--gray-100);
            border-top-color: var(--gold);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.jpeg" alt="VDCMF" className="sidebar-logo" />
          <span className="sidebar-title">VDCMF Admin</span>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname.startsWith("/admin/blog") ? "active" : ""}`}>
              <i className={`fas ${link.icon}`} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <i className="fas fa-user-circle" />
            <span>{session?.user?.name || session?.user?.email}</span>
          </div>
          <Link href="/" className="back-link">
            <i className="fas fa-arrow-left" /> View Site
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-row">
            <div>
              <h2>New Blog Post</h2>
              <p>Create a new blog post</p>
            </div>
            <Link href="/admin/blog" className="btn btn-outline back-btn">
              <i className="fas fa-arrow-left" /> Back to Posts
            </Link>
          </div>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={form.title} onChange={handleTitleChange} placeholder="Post title" required />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="post-slug" required />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea id="content" name="content" rows={12} value={form.content} onChange={handleChange} placeholder="Write your blog post content here..." required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="excerpt">Excerpt</label>
                <textarea id="excerpt" name="excerpt" rows={3} value={form.excerpt} onChange={handleChange} placeholder="Brief summary of the post" />
              </div>
              <div className="form-group">
                <label htmlFor="coverImage">Cover Image URL</label>
                <input id="coverImage" name="coverImage" type="text" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community">Community</option>
                  <option value="Youth Empowerment">Youth Empowerment</option>
                  <option value="News">News</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Create Post"}
              </button>
              <Link href="/admin/blog" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex; min-height: 100vh; background: var(--cream);
        }

        .sidebar {
          width: 260px; background: var(--charcoal); display: flex; flex-direction: column;
          flex-shrink: 0; position: sticky; top: 0; height: 100vh;
        }

        .sidebar-header {
          display: flex; align-items: center; gap: 12px; padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .sidebar-logo {
          width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--gold);
        }

        .sidebar-title {
          color: var(--gold); font-weight: 700; font-size: 1rem;
          font-family: "DM Sans", sans-serif;
        }

        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }

        .nav-link {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-radius: var(--radius); color: var(--gray-light); font-size: 0.9rem;
          font-weight: 500; transition: var(--transition); font-family: "DM Sans", sans-serif;
        }

        .nav-link i { width: 20px; text-align: center; }

        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--white); }
        .nav-link.active { background: var(--gold); color: var(--white); }

        .sidebar-footer {
          padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; gap: 12px;
        }

        .admin-info {
          display: flex; align-items: center; gap: 10px; padding: 8px 16px;
          color: var(--gray-light); font-size: 0.85rem;
        }

        .admin-info i { font-size: 1.4rem; color: var(--gold); }

        .back-link {
          display: flex; align-items: center; gap: 8px; padding: 8px 16px;
          font-size: 0.85rem; color: var(--gray-light); border-radius: var(--radius);
          transition: var(--transition);
        }

        .back-link:hover { background: rgba(255,255,255,0.06); color: var(--gold); }

        .main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }

        .content-header { margin-bottom: 32px; }

        .header-row {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
        }

        .content-header h2 { font-size: 1.75rem; color: var(--charcoal); }
        .content-header p { color: var(--gray); margin-top: 4px; }

        .back-btn { padding: 10px 20px; font-size: 0.9rem; gap: 8px; }

        .form-card {
          background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm);
          padding: 40px; max-width: 800px;
        }

        .form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }

        .checkbox-group {
          display: flex; align-items: flex-end; padding-bottom: 4px;
        }

        .checkbox-label {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          font-weight: 600; font-size: 0.9rem;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px; height: 20px; cursor: pointer;
        }

        .form-actions {
          display: flex; gap: 12px; margin-top: 32px;
        }

        .form-actions .btn {
          padding: 12px 32px;
        }

        @media (max-width: 768px) {
          .sidebar { width: 64px; }
          .sidebar-title, .nav-link span, .admin-info span, .back-link span { display: none; }
          .sidebar-header { justify-content: center; padding: 16px 8px; }
          .nav-link { justify-content: center; padding: 12px; }
          .main-content { padding: 24px 16px; }
          .header-row { flex-direction: column; }
          .form-card { padding: 24px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
