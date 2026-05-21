"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface SubscriberData {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/subscribers");
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber "${email}"?`)) return;
    try {
      const res = await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const exportCSV = () => {
    const header = "Email,Active,Date Subscribed\n";
    const rows = subscribers
      .filter((s) => s.active)
      .map((s) => `${s.email},${s.active},${new Date(s.createdAt).toISOString()}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <AdminLayout
      title="Newsletter Subscribers"
      subtitle={`${activeCount} active subscriber${activeCount !== 1 ? "s" : ""}`}
    >
      <div className="toolbar">
        <button className="glass-btn glass-btn-outline" onClick={exportCSV} disabled={subscribers.length === 0}>
          <i className="fas fa-download" /> Export CSV
        </button>
      </div>

      <div className="glass-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Subscribed</th>
              <th style={{ width: 60 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="glass-empty">Loading subscribers...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={4} className="glass-empty">No subscribers yet.</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{sub.email}</td>
                  <td>
                    <span className={`glass-badge ${sub.active ? "glass-badge-success" : "glass-badge-warning"}`}>
                      {sub.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleDelete(sub.id, sub.email)} title="Delete">
                      <i className="fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 20px; }
        .toolbar button:disabled { opacity: 0.5; cursor: not-allowed; }
        .icon-btn {
          width: 32px; height: 32px;
          display: inline-flex; align-items: center; justify-content: center;
          border: none; border-radius: 8px; font-size: 0.8rem;
          cursor: pointer; transition: all 0.2s;
          background: rgba(220,38,38,0.1); color: #dc2626;
        }
        .icon-btn:hover { background: rgba(220,38,38,0.2); }
      `}</style>
    </AdminLayout>
  );
}
