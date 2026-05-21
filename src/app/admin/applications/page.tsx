"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface ApiApp {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  program: { title: string } | null;
  organization: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

type FilterType = "All" | "Volunteer" | "Program" | "Partnership";
type FilterStatus = "All" | "Pending" | "Reviewed" | "Accepted" | "Rejected";

const typeTabs: FilterType[] = ["All", "Volunteer", "Program", "Partnership"];
const statusTabs: FilterStatus[] = ["All", "Pending", "Reviewed", "Accepted", "Rejected"];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(180,83,9,0.12)", color: "#b45309" },
  Reviewed: { bg: "rgba(29,78,216,0.1)", color: "#1d4ed8" },
  Accepted: { bg: "rgba(22,163,74,0.12)", color: "#16a34a" },
  Rejected: { bg: "rgba(220,38,38,0.1)", color: "#dc2626" },
};

const nextStatus: Record<string, string> = { Pending: "Reviewed", Reviewed: "Accepted", Accepted: "Rejected", Rejected: "Pending" };

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function mapApp(app: ApiApp) {
  return {
    id: app.id,
    type: capitalize(app.type),
    firstName: app.firstName,
    lastName: app.lastName,
    email: app.email,
    phone: app.phone || "",
    program: app.program?.title || null,
    organization: app.organization || null,
    message: app.message || "",
    status: capitalize(app.status) as "Pending" | "Reviewed" | "Accepted" | "Rejected",
    date: new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
  };
}

export default function AdminApplicationsPage() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("All");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applications, setApplications] = useState<ReturnType<typeof mapApp>[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications((data.applications || []).map(mapApp));
        }
      } catch {
        // ignore
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = applications.filter((app) => {
    if (typeFilter !== "All" && app.type !== typeFilter) return false;
    if (statusFilter !== "All" && app.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const newStatus = nextStatus[app.status];
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as typeof a.status } : a))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <AdminLayout title="Applications" subtitle="Manage volunteer, program, and partnership applications">
      <div className="filters">
        <div className="filter-group">
          <span className="filter-label">Type:</span>
          <div className="filter-tabs">
            {typeTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${typeFilter === tab ? "active" : ""}`}
                onClick={() => setTypeFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="filter-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${statusFilter === tab ? "active" : ""}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Program</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingApps ? (
              <tr><td colSpan={7} className="glass-empty">Loading applications...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="glass-empty">No applications found.</td></tr>
            ) : (
              filtered.map((app) => (
                <React.Fragment key={app.id}>
                  <tr>
                    <td>
                      <span className="type-badge">{app.type}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{app.firstName} {app.lastName}</td>
                    <td>{app.email}</td>
                    <td style={{ color: "#6b7280" }}>{app.program || app.organization || "-"}</td>
                    <td>
                      <button
                        className="status-btn"
                        style={{
                          background: statusStyle[app.status].bg,
                          color: statusStyle[app.status].color,
                        }}
                        onClick={() => handleStatusChange(app.id)}
                        title={`Change to ${nextStatus[app.status]}`}
                      >
                        {app.status} <i className="fas fa-chevron-down" style={{ fontSize: "0.65rem", marginLeft: 4 }} />
                      </button>
                    </td>
                    <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>{app.date}</td>
                    <td>
                      <button
                        className="icon-btn view"
                        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                        title={expandedId === app.id ? "Close" : "View"}
                      >
                        <i className={`fas fa-${expandedId === app.id ? "chevron-up" : "eye"}`} />
                      </button>
                    </td>
                  </tr>
                  {expandedId === app.id && (
                    <tr className="detail-row">
                      <td colSpan={7}>
                        <div className="detail-panel">
                          <div className="detail-grid">
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
                            <button className="glass-btn glass-btn-primary" onClick={() => handleStatusChange(app.id)}>
                              <i className="fas fa-arrow-right" />
                              Change to {nextStatus[app.status]}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .filters {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .filter-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #6b7280;
          min-width: 50px;
        }
        .filter-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .filter-tab {
          padding: 6px 16px;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;
          font-family: "DM Sans", sans-serif;
          color: #1a1a2e;
        }
        .filter-tab.active {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          color: #1a1a2e;
          border-color: transparent;
        }
        .filter-tab:hover:not(.active) {
          background: rgba(255,255,255,0.8);
        }
        .type-badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(107,114,128,0.1);
          color: #1a1a2e;
        }
        .status-btn {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: "DM Sans", sans-serif;
          min-width: 100px;
          justify-content: center;
        }
        .status-btn:hover {
          filter: brightness(0.95);
        }
        .icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn.view { background: rgba(107,114,128,0.1); color: #4b5563; }
        .icon-btn.view:hover { background: rgba(107,114,128,0.2); }
        .detail-row td {
          padding: 0 !important;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .detail-panel {
          padding: 0 24px 24px;
          background: rgba(255,255,255,0.3);
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px 0;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          font-weight: 600;
        }
        .detail-message {
          padding: 16px 0;
          border-top: 1px solid rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .detail-message p {
          line-height: 1.6;
          color: #1a1a2e;
        }
        .detail-actions {
          padding-top: 16px;
        }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
}
