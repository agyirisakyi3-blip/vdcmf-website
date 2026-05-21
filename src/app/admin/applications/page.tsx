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

type ApplicationType = "All" | "Volunteer" | "Program" | "Partnership";
type ApplicationStatus = "All" | "Pending" | "Reviewed" | "Accepted" | "Rejected";
type AppStatus = "Pending" | "Reviewed" | "Accepted" | "Rejected";

interface AppData {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string | null;
  organization: string | null;
  message: string;
  status: AppStatus;
  date: string;
}

const typeTabs: ApplicationType[] = ["All", "Volunteer", "Program", "Partnership"];
const statusTabs: ApplicationStatus[] = ["All", "Pending", "Reviewed", "Accepted", "Rejected"];

const statusColors: Record<string, string> = {
  Pending: "#fef3c7",
  Reviewed: "#eff6ff",
  Accepted: "#ecfdf5",
  Rejected: "#fef2f2",
};

const statusTextColors: Record<string, string> = {
  Pending: "#b45309",
  Reviewed: "#1d4ed8",
  Accepted: "#16a34a",
  Rejected: "#dc2626",
};

const placeholderApplications: AppData[] = [
  {
    id: "1",
    type: "Volunteer",
    firstName: "Abena",
    lastName: "Osei",
    email: "abena@example.com",
    phone: "+233 50 123 4567",
    program: null,
    organization: null,
    message: "I am passionate about education and would love to volunteer as a tutor for the scholarship program. I have 3 years of teaching experience.",
    status: "Pending",
    date: "May 20, 2026",
  },
  {
    id: "2",
    type: "Program",
    firstName: "Kwame",
    lastName: "Asante",
    email: "kwame@example.com",
    phone: "+233 24 987 6543",
    program: "Education & Scholarship",
    organization: null,
    message: "I would like to enroll in the Education & Scholarship program for the upcoming semester.",
    status: "Reviewed",
    date: "May 18, 2026",
  },
  {
    id: "3",
    type: "Partnership",
    firstName: "Yaw",
    lastName: "Mensah",
    email: "yaw@example.com",
    phone: "+233 27 456 7890",
    program: null,
    organization: "Mensah Foundation",
    message: "We are an NGO based in Accra and would like to partner with VDMCF on community development projects in the Northern Region.",
    status: "Pending",
    date: "May 15, 2026",
  },
];

const nextStatus: Record<AppStatus, AppStatus> = { Pending: "Reviewed", Reviewed: "Accepted", Accepted: "Rejected", Rejected: "Pending" };

export default function AdminApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [typeFilter, setTypeFilter] = useState<ApplicationType>("All");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applications, setApplications] = useState<AppData[]>(placeholderApplications);

  const filtered = applications.filter((app) => {
    if (typeFilter !== "All" && app.type !== typeFilter) return false;
    if (statusFilter !== "All" && app.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const next = nextStatus[app.status];
          return { ...app, status: next as AppStatus };
        }
        return app;
      })
    );
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
          <h2>Applications</h2>
          <p>Manage volunteer, program, and partnership applications</p>
        </header>

        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Type:</span>
            <div className="filter-tabs">
              {typeTabs.map((tab) => (
                <button key={tab} className={`filter-tab ${typeFilter === tab ? "active" : ""}`} onClick={() => setTypeFilter(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <div className="filter-tabs">
              {statusTabs.map((tab) => (
                <button key={tab} className={`filter-tab ${statusFilter === tab ? "active" : ""}`} onClick={() => setStatusFilter(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Program</th>
                <th>Status</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <>
                  <tr key={app.id} className={expandedId === app.id ? "expanded-row" : ""}>
                    <td>
                      <span className="type-badge">{app.type}</span>
                    </td>
                    <td className="name-cell">{app.firstName} {app.lastName}</td>
                    <td>{app.email}</td>
                    <td className="program-cell">{app.program || app.organization || "-"}</td>
                    <td>
                      <button
                        className="status-btn"
                        style={{
                          background: statusColors[app.status],
                          color: statusTextColors[app.status],
                        }}
                        onClick={() => handleStatusChange(app.id)}
                        title={`Click to change to ${nextStatus[app.status]}`}
                      >
                        {app.status} <i className="fas fa-chevron-down" style={{ fontSize: "0.65rem", marginLeft: 4 }} />
                      </button>
                    </td>
                    <td className="date-cell">{app.date}</td>
                    <td>
                      <button className="action-btn view-btn" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                        <i className={`fas fa-${expandedId === app.id ? "chevron-up" : "eye"}`} />
                        {expandedId === app.id ? "Close" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === app.id && (
                    <tr key={`${app.id}-details`} className="details-row">
                      <td colSpan={7}>
                        <div className="details-panel">
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Full Name</span>
                              <span>{app.firstName} {app.lastName}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Email</span>
                              <span>{app.email}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone</span>
                              <span>{app.phone || "-"}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Type</span>
                              <span className="type-badge">{app.type}</span>
                            </div>
                            {app.program && (
                              <div className="detail-item">
                                <span className="detail-label">Program</span>
                                <span>{app.program}</span>
                              </div>
                            )}
                            {app.organization && (
                              <div className="detail-item">
                                <span className="detail-label">Organization</span>
                                <span>{app.organization}</span>
                              </div>
                            )}
                          </div>
                          <div className="detail-message">
                            <span className="detail-label">Message</span>
                            <p>{app.message}</p>
                          </div>
                          <div className="detail-actions">
                            <button
                              className="status-change-btn"
                              onClick={() => handleStatusChange(app.id)}
                            >
                              <i className="fas fa-arrow-right" />
                              Change to {nextStatus[app.status]}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex; min-height: 100vh; background: var(--cream);
        }

        .sidebar {
          width: 260px; background: var(--charcoal); display: flex; flex-direction: column;
          flex-shrink: 0; position: sticky; top: 0; height: 100vh;
        }

        .sidebar-header {
          display: flex; align-items: center; gap: 12px; padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .sidebar-logo {
          width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--gold);
        }

        .sidebar-title {
          color: var(--gold); font-weight: 700; font-size: 1rem;
          font-family: "DM Sans", sans-serif;
        }

        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }

        .nav-link {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          border-radius: var(--radius); color: var(--gray-light); font-size: 0.9rem;
          font-weight: 500; transition: var(--transition); font-family: "DM Sans", sans-serif;
        }

        .nav-link i { width: 20px; text-align: center; }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--white); }
        .nav-link.active { background: var(--gold); color: var(--white); }

        .sidebar-footer {
          padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; gap: 12px;
        }

        .admin-info {
          display: flex; align-items: center; gap: 10px; padding: 8px 16px;
          color: var(--gray-light); font-size: 0.85rem;
        }

        .admin-info i { font-size: 1.4rem; color: var(--gold); }

        .back-link {
          display: flex; align-items: center; gap: 8px; padding: 8px 16px;
          font-size: 0.85rem; color: var(--gray-light); border-radius: var(--radius);
          transition: var(--transition);
        }

        .back-link:hover { background: rgba(255,255,255,0.06); color: var(--gold); }

        .main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }

        .content-header { margin-bottom: 24px; }

        .content-header h2 { font-size: 1.75rem; color: var(--charcoal); }
        .content-header p { color: var(--gray); margin-top: 4px; }

        .filters {
          display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;
        }

        .filter-group {
          display: flex; align-items: center; gap: 12px;
        }

        .filter-label {
          font-size: 0.85rem; font-weight: 600; color: var(--gray); min-width: 50px;
        }

        .filter-tabs {
          display: flex; gap: 4px; flex-wrap: wrap;
        }

        .filter-tab {
          padding: 6px 16px; border: 1px solid var(--gray-100); border-radius: var(--radius-full);
          background: var(--white); cursor: pointer; font-size: 0.8rem; font-weight: 600;
          transition: var(--transition); font-family: "DM Sans", sans-serif; color: var(--charcoal);
        }

        .filter-tab.active {
          background: var(--gold); color: var(--white); border-color: var(--gold);
        }

        .filter-tab:hover:not(.active) {
          background: var(--gray-100);
        }

        .table-card {
          background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .data-table { width: 100%; border-collapse: collapse; }

        .data-table th {
          text-align: left; padding: 16px 20px; font-size: 0.8rem; text-transform: uppercase;
          letter-spacing: 0.5px; color: var(--gray); border-bottom: 2px solid var(--gray-100);
          font-family: "DM Sans", sans-serif;
        }

        .data-table td {
          padding: 14px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--gray-100);
          color: var(--charcoal);
        }

        .name-cell { font-weight: 600; }
        .program-cell { color: var(--gray); }
        .date-cell { color: var(--gray); white-space: nowrap; }
        .actions-col { width: 80px; }
        .empty-cell { text-align: center; padding: 48px !important; color: var(--gray); }

        .type-badge {
          display: inline-flex; padding: 4px 10px; border-radius: var(--radius-sm);
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          background: var(--gray-100); color: var(--charcoal);
        }

        .status-btn {
          display: inline-flex; align-items: center; padding: 4px 12px;
          border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;
          border: none; cursor: pointer; transition: var(--transition);
          font-family: "DM Sans", sans-serif; min-width: 100px;
          justify-content: center;
        }

        .status-btn:hover {
          filter: brightness(0.95);
        }

        .action-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
          border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600;
          border: none; cursor: pointer; transition: var(--transition);
          font-family: "DM Sans", sans-serif;
        }

        .view-btn {
          background: var(--gray-100); color: var(--charcoal);
        }

        .view-btn:hover {
          background: var(--cream-dark);
        }

        .expanded-row td {
          border-bottom: none;
        }

        .details-row td {
          padding: 0 !important;
        }

        .details-panel {
          padding: 0 20px 24px;
          border-bottom: 1px solid var(--gray-100);
        }

        .details-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          padding: 16px 0;
        }

        .detail-item {
          display: flex; flex-direction: column; gap: 2px;
        }

        .detail-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;
          color: var(--gray); font-weight: 600;
        }

        .detail-message {
          padding: 16px 0; border-top: 1px solid var(--gray-100);
          display: flex; flex-direction: column; gap: 6px;
        }

        .detail-message p {
          line-height: 1.6; color: var(--charcoal);
        }

        .detail-actions {
          padding-top: 16px; border-top: 1px solid var(--gray-100);
        }

        .status-change-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; background: var(--gold); color: var(--white);
          border: none; border-radius: var(--radius); font-weight: 600;
          cursor: pointer; transition: var(--transition);
          font-family: "DM Sans", sans-serif; font-size: 0.85rem;
        }

        .status-change-btn:hover {
          background: var(--gold-dark);
        }

        @media (max-width: 768px) {
          .sidebar { width: 64px; }
          .sidebar-title, .nav-link span, .admin-info span, .back-link span { display: none; }
          .sidebar-header { justify-content: center; padding: 16px 8px; }
          .nav-link { justify-content: center; padding: 12px; }
          .main-content { padding: 24px 16px; }
          .details-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
