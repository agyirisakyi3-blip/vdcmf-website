"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
            width: 40px;
            height: 40px;
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
    return (
      <div className="unauth-page">
        <div className="unauth-card">
          <i className="fas fa-lock" />
          <h2>Please log in</h2>
          <p>You need to be authenticated to access the admin dashboard.</p>
          <Link href="/admin/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <style jsx>{`
          .unauth-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--cream);
            padding: 24px;
          }
          .unauth-card {
            background: var(--white);
            border-radius: var(--radius-lg);
            padding: 48px;
            text-align: center;
            box-shadow: var(--shadow);
            max-width: 400px;
          }
          .unauth-card i {
            font-size: 3rem;
            color: var(--gold);
            margin-bottom: 16px;
          }
          .unauth-card h2 {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
          .unauth-card p {
            color: var(--gray);
            margin-bottom: 24px;
          }
        `}</style>
      </div>
    );
  }

  const stats = [
    { label: "Total Applications", value: "12", icon: "fa-file-alt", color: "var(--blue)" },
    { label: "Pending Applications", value: "5", icon: "fa-clock", color: "var(--gold)" },
    { label: "Total Blog Posts", value: "8", icon: "fa-newspaper", color: "var(--success)" },
    { label: "Contact Messages", value: "23", icon: "fa-envelope", color: "var(--gh-red)" },
  ];

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
          <h2>Dashboard</h2>
          <p>Welcome back, {session?.user?.name || "Admin"}</p>
        </header>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ background: stat.color }}>
                <i className={`fas ${stat.icon}`} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-section">
          <h3>Recent Contact Messages</h3>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kwame Asante</td>
                <td>kwame@example.com</td>
                <td className="msg-preview">I would like to partner with VDMCF...</td>
                <td>May 20, 2026</td>
              </tr>
              <tr>
                <td>Abena Osei</td>
                <td>abena@example.com</td>
                <td className="msg-preview">Interested in volunteering for the education program...</td>
                <td>May 18, 2026</td>
              </tr>
              <tr>
                <td>Yaw Mensah</td>
                <td>yaw@example.com</td>
                <td className="msg-preview">Can you share more about the health initiative...</td>
                <td>May 15, 2026</td>
              </tr>
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

        .content-header h2 {
          font-size: 1.75rem;
          color: var(--charcoal);
        }

        .content-header p {
          color: var(--gray);
          margin-top: 4px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon i {
          font-size: 1.3rem;
          color: var(--white);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--charcoal);
          font-family: "Playfair Display", serif;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--gray);
          margin-top: 2px;
        }

        .recent-section {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .recent-section h3 {
          font-size: 1.15rem;
          margin-bottom: 16px;
        }

        .recent-table {
          width: 100%;
          border-collapse: collapse;
        }

        .recent-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--gray);
          border-bottom: 2px solid var(--gray-100);
          font-family: "DM Sans", sans-serif;
        }

        .recent-table td {
          padding: 14px 16px;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--gray-100);
          color: var(--charcoal);
        }

        .msg-preview {
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--gray) !important;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
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
        }
      `}</style>
    </div>
  );
}
