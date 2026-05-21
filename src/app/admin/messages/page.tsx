"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
  { href: "/admin/programs", label: "Programs", icon: "fa-hand-holding-heart" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "fa-users" },
  { href: "/admin/settings", label: "Settings", icon: "fa-cog" },
];

interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch {
      // ignore
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <style jsx>{`
          .loading-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--cream); }
          .spinner { width: 40px; height: 40px; border: 4px solid var(--gray-100); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
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
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`}>
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
          <h2>Contact Messages</h2>
          <p>View and manage messages from the contact form</p>
        </header>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="empty-cell">Loading messages...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={6} className="empty-cell">No messages yet.</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`${!msg.read ? "unread" : ""} ${expandedId === msg.id ? "expanded-row" : ""}`}>
                    <td>
                      <span className={`read-badge ${msg.read ? "read" : "unread"}`}>
                        {msg.read ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="name-cell">{msg.name}</td>
                    <td>{msg.email}</td>
                    <td className="msg-preview">{msg.message}</td>
                    <td className="date-cell">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn view-btn" onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}>
                          <i className={`fas fa-${expandedId === msg.id ? "chevron-up" : "eye"}`} />
                        </button>
                        <button className="action-btn read-btn" onClick={() => toggleRead(msg.id, msg.read)} title={msg.read ? "Mark as unread" : "Mark as read"}>
                          <i className={`fas fa-${msg.read ? "envelope" : "envelope-open"}`} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(msg.id, msg.name)}>
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

        {expandedId && (() => {
          const msg = messages.find((m) => m.id === expandedId);
          if (!msg) return null;
          return (
            <div className="detail-card">
              <div className="detail-header">
                <h3>{msg.name}</h3>
                <span className="detail-email">{msg.email}</span>
              </div>
              <div className="detail-body">
                <p>{msg.message}</p>
              </div>
              <div className="detail-footer">
                <span>Received: {new Date(msg.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          );
        })()}
      </main>

      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: var(--cream); }
        .sidebar { width: 260px; background: var(--charcoal); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-header { display: flex; align-items: center; gap: 12px; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-logo { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); }
        .sidebar-title { color: var(--gold); font-weight: 700; font-size: 1rem; font-family: "DM Sans", sans-serif; }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius); color: var(--gray-light); font-size: 0.9rem; font-weight: 500; transition: var(--transition); font-family: "DM Sans", sans-serif; }
        .nav-link i { width: 20px; text-align: center; }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--white); }
        .nav-link.active { background: var(--gold); color: var(--white); }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px; }
        .admin-info { display: flex; align-items: center; gap: 10px; padding: 8px 16px; color: var(--gray-light); font-size: 0.85rem; }
        .admin-info i { font-size: 1.4rem; color: var(--gold); }
        .back-link { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; color: var(--gray-light); border-radius: var(--radius); transition: var(--transition); }
        .back-link:hover { background: rgba(255,255,255,0.06); color: var(--gold); }
        .main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
        .content-header { margin-bottom: 32px; }
        .content-header h2 { font-size: 1.75rem; color: var(--charcoal); }
        .content-header p { color: var(--gray); margin-top: 4px; }
        .table-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 24px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 16px 20px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray); border-bottom: 2px solid var(--gray-100); font-family: "DM Sans", sans-serif; }
        .data-table td { padding: 14px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--gray-100); color: var(--charcoal); }
        .data-table tr:last-child td { border-bottom: none; }
        .unread td { font-weight: 600; }
        .name-cell { font-weight: 600; min-width: 140px; }
        .date-cell { color: var(--gray); white-space: nowrap; }
        .actions-col { width: 140px; }
        .actions-cell { display: flex; gap: 6px; }
        .empty-cell { text-align: center; padding: 48px !important; color: var(--gray); }
        .msg-preview { max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--gray); }
        .read-badge { display: inline-flex; padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; }
        .read-badge.unread { background: #fef3c7; color: #b45309; }
        .read-badge.read { background: var(--gray-100); color: var(--gray); }
        .action-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 34px; height: 34px; border-radius: var(--radius-sm); font-size: 0.8rem; border: none; cursor: pointer; transition: var(--transition); }
        .view-btn { background: var(--gray-100); color: var(--charcoal); }
        .view-btn:hover { background: var(--cream-dark); }
        .read-btn { background: #eff6ff; color: var(--blue); }
        .read-btn:hover { background: #dbeafe; }
        .delete-btn { background: #fef2f2; color: var(--error); }
        .delete-btn:hover { background: #fecaca; }
        .detail-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
        .detail-header { padding: 20px 24px; border-bottom: 1px solid var(--gray-100); }
        .detail-header h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .detail-email { color: var(--gray); font-size: 0.85rem; }
        .detail-body { padding: 20px 24px; }
        .detail-body p { line-height: 1.7; color: var(--charcoal); white-space: pre-wrap; }
        .detail-footer { padding: 12px 24px; border-top: 1px solid var(--gray-100); font-size: 0.8rem; color: var(--gray); }
        @media (max-width: 768px) {
          .sidebar { width: 64px; }
          .sidebar-title, .nav-link span, .admin-info span, .back-link span { display: none; }
          .sidebar-header { justify-content: center; padding: 16px 8px; }
          .nav-link { justify-content: center; padding: 12px; }
          .main-content { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
}
