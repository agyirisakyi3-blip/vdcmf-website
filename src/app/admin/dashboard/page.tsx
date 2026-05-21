"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboardPage() {
  const [totalApps, setTotalApps] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [messages, setMessages] = useState<{ id: string; name: string; email: string; message: string; createdAt: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, blogRes, contactRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/blog"),
          fetch("/api/contact"),
        ]);

        if (appsRes.ok) {
          const appsData: { applications: { status: string }[] } = await appsRes.json();
          setTotalApps(appsData.applications.length);
          setPendingApps(appsData.applications.filter((a) => a.status === "PENDING").length);
        }

        if (blogRes.ok) {
          const blogData = (await blogRes.json()) as { posts: unknown[] };
          setTotalPosts((blogData.posts || []).length);
        }

        if (contactRes.ok) {
          const contactData = (await contactRes.json()) as { messages: { id: string; name: string; email: string; message: string; createdAt: string }[] };
          setMessages(contactData.messages || []);
        }
      } catch {
        // silently fail — stats stay at 0
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total Applications", value: String(totalApps), icon: "fa-file-alt", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    { label: "Pending Applications", value: String(pendingApps), icon: "fa-clock", gradient: "linear-gradient(135deg, #f093fb, #f5576c)" },
    { label: "Total Blog Posts", value: String(totalPosts), icon: "fa-newspaper", gradient: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    { label: "Contact Messages", value: String(messages.length), icon: "fa-envelope", gradient: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card glass-card">
            <div className="stat-icon" style={{ background: stat.gradient }}>
              <i className={`fas ${stat.icon}`} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section glass-table">
        <div className="section-header">
          <h3>Recent Contact Messages</h3>
          <Link href="/admin/messages" className="glass-btn glass-btn-outline" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
            View All <i className="fas fa-arrow-right" />
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loadingData ? (
              <tr><td colSpan={4} className="glass-empty">Loading messages...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={4} className="glass-empty">No messages yet.</td></tr>
            ) : (
              messages.slice(0, 5).map((msg) => (
                <tr key={msg.id}>
                  <td style={{ fontWeight: 600 }}>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td className="msg-preview">{msg.message}</td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .stat-icon i {
          font-size: 1.3rem;
          color: #fff;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a2e;
          font-family: "Playfair Display", serif;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 2px;
        }

        .recent-section {
          padding: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 0;
        }

        .section-header h3 {
          font-size: 1.1rem;
          color: #1a1a2e;
          margin: 0;
        }

        .msg-preview {
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
}
