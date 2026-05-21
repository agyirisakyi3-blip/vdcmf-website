"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
];

const placeholderPosts = [
  { id: "1", title: "Education Scholarship Program Launch", status: "Published", date: "May 15, 2026" },
  { id: "2", title: "Mobile Health Clinic Update — Q1 2026", status: "Published", date: "Apr 28, 2026" },
  { id: "3", title: "Upcoming Youth Empowerment Workshop", status: "Draft", date: "May 10, 2026" },
];

export default function AdminBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      alert(`Delete action for post ${id} — API coming soon.`);
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
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
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
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
              <h2>Blog Posts</h2>
              <p>Manage your blog content</p>
            </div>
            <Link href="/admin/blog/new" className="btn btn-primary new-btn">
              <i className="fas fa-plus" /> New Post
            </Link>
          </div>
        </header>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {placeholderPosts.map((post) => (
                <tr key={post.id}>
                  <td className="title-cell">{post.title}</td>
                  <td>
                    <span className={`status-badge ${post.status === "Published" ? "published" : "draft"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="date-cell">{post.date}</td>
                  <td className="actions-cell">
                    <Link href={`/admin/blog/${post.id}/edit`} className="action-btn edit-btn">
                      <i className="fas fa-edit" /> Edit
                    </Link>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(post.id, post.title)}>
                      <i className="fas fa-trash" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--cream);
        }

        .sidebar {
          width: 260px;
          background: var(--charcoal);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .sidebar-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--gold);
        }

        .sidebar-title {
          color: var(--gold);
          font-weight: 700;
          font-size: 1rem;
          font-family: "DM Sans", sans-serif;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius);
          color: var(--gray-light);
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          font-family: "DM Sans", sans-serif;
        }

        .nav-link i {
          width: 20px;
          text-align: center;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: var(--white);
        }

        .nav-link.active {
          background: var(--gold);
          color: var(--white);
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          color: var(--gray-light);
          font-size: 0.85rem;
        }

        .admin-info i {
          font-size: 1.4rem;
          color: var(--gold);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.85rem;
          color: var(--gray-light);
          border-radius: var(--radius);
          transition: var(--transition);
        }

        .back-link:hover {
          background: rgba(255,255,255,0.06);
          color: var(--gold);
        }

        .main-content {
          flex: 1;
          padding: 32px 40px;
          overflow-y: auto;
        }

        .content-header {
          margin-bottom: 32px;
        }

        .header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .content-header h2 {
          font-size: 1.75rem;
          color: var(--charcoal);
        }

        .content-header p {
          color: var(--gray);
          margin-top: 4px;
        }

        .new-btn {
          gap: 8px;
          padding: 12px 24px;
          font-size: 0.9rem;
        }

        .table-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 16px 20px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--gray);
          border-bottom: 2px solid var(--gray-100);
          font-family: "DM Sans", sans-serif;
        }

        .data-table td {
          padding: 16px 20px;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--gray-100);
          color: var(--charcoal);
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .title-cell {
          font-weight: 600;
          min-width: 240px;
        }

        .date-cell {
          color: var(--gray);
          white-space: nowrap;
        }

        .status-badge {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.published {
          background: #ecfdf5;
          color: var(--success);
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #b45309;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .actions-col {
          width: 180px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          font-family: "DM Sans", sans-serif;
        }

        .edit-btn {
          background: #eff6ff;
          color: var(--blue);
          text-decoration: none;
        }

        .edit-btn:hover {
          background: #dbeafe;
        }

        .delete-btn {
          background: #fef2f2;
          color: var(--error);
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 64px;
          }
          .sidebar-title,
          .nav-link span,
          .admin-info span,
          .back-link span {
            display: none;
          }
          .sidebar-header {
            justify-content: center;
            padding: 16px 8px;
          }
          .nav-link {
            justify-content: center;
            padding: 12px;
          }
          .main-content {
            padding: 24px 16px;
          }
          .header-row {
            flex-direction: column;
          }
          .actions-cell {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
