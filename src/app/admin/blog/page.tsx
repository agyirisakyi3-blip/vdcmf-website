"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useSortable } from "@/components/admin/useSortable";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

// Shape of a blog post from the API
interface PostData {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const { toast } = useToast();
  // Posts list, loading, and search state
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all blog posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch {
        toast("error", "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [toast]);

  // Delete a post by ID with confirmation toast
  const handleDelete = async (id: string, title: string) => {
    toast("warning", `Deleting "${title}"...`);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast("success", `"${title}" deleted`);
      } else {
        toast("error", "Failed to delete post");
      }
    } catch {
      toast("error", "Failed to delete post");
    }
  };

  // Filter posts by title search
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const { sorted, toggleSort, sortIcon } = useSortable(filtered, "createdAt");

  return (
    <AdminLayout title="Blog Posts" subtitle="Manage your blog content">
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title..." />
        {/* Navigate to new post creation page */}
        <Link href="/admin/blog/new" className="btn btn-primary">
          <i className="fas fa-plus" /> New Post
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort("title")}>
                  Title <i className={`fas ${sortIcon("title")}`} />
                </th>
                <th className="sortable" onClick={() => toggleSort("published")}>
                  Status <i className={`fas ${sortIcon("published")}`} />
                </th>
                <th className="sortable" onClick={() => toggleSort("createdAt")}>
                  Date <i className={`fas ${sortIcon("createdAt")}`} />
                </th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={4} className="empty">
                  {search ? "No posts match your search." : "No posts found. Create your first post!"}
                </td></tr>
              ) : (
                sorted.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 600 }}>{post.title}</td>
                    <td>
                      <span className={`badge ${post.published ? "badge-success" : "badge-warning"}`}>
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
      )}

      <style jsx>{`
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .actions { display: flex; gap: 6px; }
        .icon-btn.edit, .icon-btn.delete {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: none; border-radius: 6px;
          font-size: 0.78rem; cursor: pointer; transition: all 0.15s;
          text-decoration: none;
        }
        .icon-btn.edit { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        .icon-btn.edit:hover { background: rgba(29,78,216,0.2); }
        .icon-btn.delete { background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn.delete:hover { background: rgba(220,38,38,0.2); }
        th.sortable { cursor: pointer; user-select: none; }
        th.sortable:hover { color: #d4af37; }
        th.sortable i { margin-left: 4px; font-size: 0.7rem; opacity: 0.5; }
      `}</style>
    </AdminLayout>
  );
}
