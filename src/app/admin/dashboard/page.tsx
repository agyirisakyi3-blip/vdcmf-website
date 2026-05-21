"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { StatSkeleton, TableSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

const PIE_COLORS = ["#D4AF37", "#1B4332", "#2D6A4F", "#B8860B", "#40916C"];

interface AppItem {
  id: string; status: string; createdAt: string; fullName?: string;
}
interface MsgItem {
  id: string; name: string; email: string; createdAt: string;
}
interface BlogItem {
  id: string; title: string; createdAt: string;
}
interface ActivityItem {
  id: string; type: "message" | "application" | "blog"; title: string; subtitle: string; href: string; createdAt: string;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [totalApps, setTotalApps] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [appsByMonth, setAppsByMonth] = useState<{ month: string; count: number }[]>([]);
  const [appsByStatus, setAppsByStatus] = useState<{ name: string; value: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [messages, setMessages] = useState<MsgItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [appsRes, blogRes, contactRes] = await Promise.all([
        fetch("/api/applications"),
        fetch("/api/blog"),
        fetch("/api/contact"),
      ]);

      if (appsRes.ok) {
        const appsData = (await appsRes.json()) as { applications: AppItem[] };
        const appList = appsData.applications || [];
        setApps(appList);
        setTotalApps(appList.length);
        setPendingApps(appList.filter((a) => a.status === "PENDING").length);

        const statusCounts: Record<string, number> = {};
        appList.forEach((a) => {
          statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
        });
        setAppsByStatus(
          Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        );

        const months: Record<string, number> = {};
        appList.forEach((a) => {
          const d = new Date(a.createdAt);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          months[key] = (months[key] || 0) + 1;
        });
        setAppsByMonth(
          Object.entries(months)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count }))
        );
      }

      if (blogRes.ok) {
        const blogData = (await blogRes.json()) as { posts: BlogItem[] };
        const posts = blogData.posts || [];
        setBlogPosts(posts);
        setTotalPosts(posts.length);
      }

      if (contactRes.ok) {
        const contactData = (await contactRes.json()) as { messages: (MsgItem & { read: boolean })[] };
        const msgs = contactData.messages || [];
        setMessages(msgs);
        setTotalMessages(msgs.length);
        setUnreadMessages(msgs.filter((m) => !m.read).length);
      }
    } catch {
      toast("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const activity: ActivityItem[] = [
      ...messages.map((m) => ({
        id: m.id,
        type: "message" as const,
        title: m.name,
        subtitle: m.email,
        href: "/admin/messages",
        createdAt: m.createdAt,
      })),
      ...apps.map((a) => ({
        id: a.id,
        type: "application" as const,
        title: a.fullName || "Applicant",
        subtitle: a.status,
        href: "/admin/applications",
        createdAt: a.createdAt,
      })),
      ...blogPosts.map((b) => ({
        id: b.id,
        type: "blog" as const,
        title: b.title,
        subtitle: "Blog post",
        href: "/admin/blog",
        createdAt: b.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
    setRecentActivity(activity);
  }, [messages, apps, blogPosts]);

  const stats = [
    { label: "Total Applications", value: String(totalApps), icon: "fa-file-alt", gradient: "linear-gradient(135deg, #D4AF37, #B8860B)" },
    { label: "Pending Apps", value: String(pendingApps), icon: "fa-clock", gradient: "linear-gradient(135deg, #1B4332, #2D6A4F)" },
    { label: "Blog Posts", value: String(totalPosts), icon: "fa-newspaper", gradient: "linear-gradient(135deg, #2D6A4F, #40916C)" },
    { label: "Messages", value: String(totalMessages), badge: `${unreadMessages} unread`, gradient: "linear-gradient(135deg, #D4AF37, #F5D97A)" },
  ];

  const typeIcons: Record<string, string> = { message: "fa-envelope", application: "fa-file-alt", blog: "fa-newspaper" };
  const typeColors: Record<string, string> = { message: "#D4AF37", application: "#1B4332", blog: "#2D6A4F" };

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin">
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card card">
              <div className="stat-icon" style={{ background: stat.gradient }}>
                <i className={`fas ${stat.icon}`} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">
                  {stat.label}
                  {"badge" in stat && stat.badge ? <span className="unread-badge">{stat.badge}</span> : null}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="charts-row">
        <div className="chart-card card">
          <h3>Applications by Month</h3>
          {loading ? (
            <div className="chart-skeleton" style={{ height: 260, borderRadius: 12 }} />
          ) : appsByMonth.length === 0 ? (
            <div className="empty">No application data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={appsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#D4AF37">
                  {appsByMonth.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? "#D4AF37" : "#1B4332"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="chart-card card">
          <h3>Application Status</h3>
          {loading ? (
            <div className="chart-skeleton" style={{ height: 260, borderRadius: 12 }} />
          ) : appsByStatus.length === 0 ? (
            <div className="empty">No application data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={appsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} label={({ name, value }) => `${name} (${value})`}>
                  {appsByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          {loading ? (
            <TableSkeleton rows={4} cols={1} />
          ) : recentActivity.length === 0 ? (
            <div className="empty" style={{ padding: 40 }}>No recent activity.</div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((act) => (
                <Link key={`${act.type}-${act.id}`} href={act.href} className="activity-item">
                  <div className="activity-icon" style={{ background: typeColors[act.type] }}>
                    <i className={`fas ${typeIcons[act.type]}`} />
                  </div>
                  <div className="activity-info">
                    <span className="activity-title">{act.title}</span>
                    <span className="activity-subtitle">{act.subtitle}</span>
                  </div>
                  <span className="activity-time">
                    {new Date(act.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link href="/admin/applications" className="qa-btn"><i className="fas fa-file-alt" /> View Applications</Link>
            <Link href="/admin/messages" className="qa-btn"><i className="fas fa-envelope" /> Contact Inbox</Link>
            <Link href="/admin/programs" className="qa-btn"><i className="fas fa-calendar" /> Manage Programs</Link>
            <Link href="/admin/blog/new" className="qa-btn"><i className="fas fa-plus-circle" /> Create Blog Post</Link>
            <Link href="/admin/settings" className="qa-btn"><i className="fas fa-cog" /> Site Settings</Link>
            <Link href="/admin/subscribers" className="qa-btn"><i className="fas fa-users" /> Subscribers</Link>
          </div>
        </div>
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
          font-size: 1.6rem;
          font-weight: 700;
          color: #1C1C1C;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6B7280;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .unread-badge {
          font-size: 0.7rem;
          background: #dc2626;
          color: #fff;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        .charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .chart-card {
          padding: 24px;
        }

        .chart-card h3 {
          font-size: 1rem;
          color: #1C1C1C;
          margin: 0 0 16px;
          font-family: "DM Sans", sans-serif;
        }

        .chart-skeleton {
          background: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #EDEDED;
        }

        .card-header h3 {
          font-size: 1rem;
          color: #1C1C1C;
          margin: 0;
          font-family: "DM Sans", sans-serif;
        }

        .activity-card {
          padding: 0;
          overflow: hidden;
        }

        .activity-list {
          padding: 8px 0;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 24px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .activity-item:hover {
          background: #FAFBFC;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon i {
          font-size: 0.85rem;
          color: #fff;
        }

        .activity-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activity-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1C1C1C;
        }

        .activity-subtitle {
          font-size: 0.78rem;
          color: #6B7280;
          text-transform: capitalize;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9CA3AF;
          white-space: nowrap;
        }

        .quick-actions-card {
          padding: 0;
          overflow: hidden;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .qa-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 20px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1C1C1C;
          text-decoration: none;
          border-bottom: 1px solid #EDEDED;
          border-right: 1px solid #EDEDED;
          transition: all 0.2s ease;
        }

        .qa-btn:nth-child(even) {
          border-right: none;
        }

        .qa-btn:nth-last-child(-n+2) {
          border-bottom: none;
        }

        .qa-btn:hover {
          background: #FAFBFC;
        }

        .qa-btn i {
          font-size: 1rem;
          color: #D4AF37;
        }

        .empty {
          padding: 24px;
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .charts-row { grid-template-columns: 1fr; }
          .dashboard-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
          .quick-actions { grid-template-columns: 1fr; }
          .qa-btn { border-right: none; }
          .qa-btn:nth-last-child(-n+2) { border-bottom: 1px solid rgba(0,0,0,0.04); }
          .qa-btn:last-child { border-bottom: none; }
        }
      `}</style>
    </AdminLayout>
  );
}
