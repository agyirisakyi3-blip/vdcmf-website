"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
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
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m)));
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

  return (
    <AdminLayout title="Contact Messages" subtitle="View and manage messages from the contact form">
      <div className="glass-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="glass-empty">Loading messages...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={6} className="glass-empty">No messages yet.</td></tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} style={!msg.read ? { fontWeight: 600 } : undefined}>
                  <td>
                    <span className={`glass-badge ${msg.read ? "glass-badge-neutral" : "glass-badge-warning"}`}>
                      {msg.read ? "Read" : "New"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td className="msg-preview">{msg.message}</td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="icon-btn view" onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} title="View">
                        <i className={`fas fa-${expandedId === msg.id ? "chevron-up" : "eye"}`} />
                      </button>
                      <button className="icon-btn read" onClick={() => toggleRead(msg.id, msg.read)} title={msg.read ? "Mark unread" : "Mark read"}>
                        <i className={`fas fa-${msg.read ? "envelope" : "envelope-open"}`} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(msg.id, msg.name)} title="Delete">
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
          <div className="glass-card detail-card">
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

      <style jsx>{`
        .msg-preview {
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6b7280;
        }
        .actions { display: flex; gap: 6px; }
        .icon-btn {
          width: 32px; height: 32px;
          display: inline-flex; align-items: center; justify-content: center;
          border: none; border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn.view { background: rgba(107,114,128,0.1); color: #4b5563; }
        .icon-btn.view:hover { background: rgba(107,114,128,0.2); }
        .icon-btn.read { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        .icon-btn.read:hover { background: rgba(29,78,216,0.2); }
        .icon-btn.delete { background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn.delete:hover { background: rgba(220,38,38,0.2); }
        .detail-card { margin-top: 20px; overflow: hidden; }
        .detail-header { padding: 20px 24px; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .detail-header h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .detail-email { color: #6b7280; font-size: 0.85rem; }
        .detail-body { padding: 20px 24px; }
        .detail-body p { line-height: 1.7; color: #1a1a2e; white-space: pre-wrap; }
        .detail-footer { padding: 12px 24px; border-top: 1px solid rgba(0,0,0,0.04); font-size: 0.8rem; color: #6b7280; }
      `}</style>
    </AdminLayout>
  );
}
