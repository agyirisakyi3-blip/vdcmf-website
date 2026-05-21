"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

interface PostData {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch {
        // ignore
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete post.");
      }
    } catch {
      alert("Failed to delete post.");
    }
  };

  return (
    <AdminLayout title="Blog Posts" subtitle="Manage your blog content">
      <div className="toolbar">
        <Link href="/admin/blog/new" className="glass-btn glass-btn-primary">
          <i className="fas fa-plus" /> New Post
        </Link>
      </div>

      <div className="glass-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingPosts ? (
              <tr><td colSpan={4} className="glass-empty">Loading posts...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="glass-empty">No posts found. Create your first post!</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 600 }}>{post.title}</td>
                  <td>
                    <span className={`glass-badge ${post.published ? "glass-badge-success" : "glass-badge-warning"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td>
                    <div className="actions">
                      <Link href={`/admin/blog/${post.id}/edit`} className="icon-btn edit" title="Edit">
                        <i className="fas fa-edit" />
                      </Link>
                      <button className="icon-btn delete" onClick={() => handleDelete(post.id, post.title)} title="Delete">
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 20px; }
        .actions { display: flex; gap: 6px; }
        .icon-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border: none; border-radius: 8px;
          font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .icon-btn.edit { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        .icon-btn.edit:hover { background: rgba(29,78,216,0.2); }
        .icon-btn.delete { background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn.delete:hover { background: rgba(220,38,38,0.2); }
      `}</style>
    </AdminLayout>
  );
}
