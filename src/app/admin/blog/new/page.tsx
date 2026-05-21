"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function NewBlogPostPage() {
  const router = useRouter();
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
        const data = await res.json();
        alert(data.error || "Failed to create post.");
      }
    } catch {
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Blog Post" subtitle="Create a new blog post">
      <div className="toolbar">
        <Link href="/admin/blog" className="glass-btn glass-btn-outline">
          <i className="fas fa-arrow-left" /> Back to Posts
        </Link>
      </div>

      <div className="glass-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleTitleChange} placeholder="Post title" className="glass-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="post-slug" className="glass-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" rows={12} value={form.content} onChange={handleChange} placeholder="Write your blog post content here..." className="glass-input" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="excerpt">Excerpt</label>
              <textarea id="excerpt" name="excerpt" rows={3} value={form.excerpt} onChange={handleChange} placeholder="Brief summary of the post" className="glass-input" />
            </div>
            <div className="form-group">
              <label htmlFor="coverImage">Cover Image URL</label>
              <input id="coverImage" name="coverImage" type="text" value={form.coverImage} onChange={handleChange} placeholder="https://..." className="glass-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="glass-input">
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
            <button type="submit" className="glass-btn glass-btn-primary" disabled={loading}>
              <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-plus"}`} />
              {loading ? "Saving..." : "Create Post"}
            </button>
            <Link href="/admin/blog" className="glass-btn glass-btn-outline">Cancel</Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 20px; }
        .form-card { padding: 32px; max-width: 800px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #6b7280; margin-bottom: 6px; }
        .form-group textarea { width: 100%; resize: vertical; }
        .form-group input[type="text"], .form-group select { width: 100%; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .checkbox-group { display: flex; align-items: flex-end; padding-bottom: 4px; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
        .checkbox-label input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
        .form-actions { display: flex; gap: 12px; margin-top: 32px; }
        @media (max-width: 768px) {
          .form-card { padding: 24px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
}
