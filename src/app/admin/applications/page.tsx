"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useSortable } from "@/components/admin/useSortable";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

// Raw application shape returned from the API
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

// Filter options for type and status tabs
type FilterType = "All" | "Volunteer" | "Program" | "Partnership";
type FilterStatus = "All" | "Pending" | "Reviewed" | "Accepted" | "Rejected";

// Tab definitions for type and status filter bars
const typeTabs: FilterType[] = ["All", "Volunteer", "Program", "Partnership"];
const statusTabs: FilterStatus[] = ["All", "Pending", "Reviewed", "Accepted", "Rejected"];

// Color scheme for each status badge
const statusStyle: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(180,83,9,0.12)", color: "#b45309" },
  Reviewed: { bg: "rgba(29,78,216,0.1)", color: "#1d4ed8" },
  Accepted: { bg: "rgba(22,163,74,0.12)", color: "#16a34a" },
  Rejected: { bg: "rgba(220,38,38,0.1)", color: "#dc2626" },
};

// Available statuses for inline dropdown
const statuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

// Capitalises the first letter of a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Transforms raw API application into display-friendly format
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
    createdAt: app.createdAt,
  };
}

type AppItem = ReturnType<typeof mapApp>;

export default function AdminApplicationsPage() {
  const { toast } = useToast();
  // Filter, selection, and data state
  const [typeFilter, setTypeFilter] = useState<FilterType>("All");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Fetch all applications on mount
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications((data.applications || []).map(mapApp));
        }
      } catch {
        toast("error", "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [toast]);

  // Filter applications by type, status, and search query
  const filtered = applications.filter((app) => {
    if (typeFilter !== "All" && app.type !== typeFilter) return false;
    if (statusFilter !== "All" && app.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!app.firstName.toLowerCase().includes(q) &&
          !app.lastName.toLowerCase().includes(q) &&
          !app.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const { sorted, toggleSort, sortIcon } = useSortable(filtered, "createdAt");

  // Inline status change dropdown handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as AppItem["status"] } : a))
        );
        toast("success", `Status updated to ${newStatus}`);
      } else {
        toast("error", "Failed to update status");
      }
    } catch {
      toast("error", "Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  // Toggle single row checkbox selection
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Select or deselect all visible rows
  const toggleSelectAll = () => {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((a) => a.id)));
    }
  };

  // Bulk status update — runs all requests in parallel via Promise.allSettled
  const handleBulkStatus = async () => {
    if (!bulkStatus || selected.size === 0) return;
    const newStatus = bulkStatus;
    toast("info", `Updating ${selected.size} application(s) to ${newStatus}...`);
    const ids = Array.from(selected);
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/applications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus.toUpperCase() }),
        })
      )
    );
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        setApplications((prev) =>
          prev.map((a) => (a.id === ids[i] ? { ...a, status: newStatus as AppItem["status"] } : a))
        );
      }
    });
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    toast("success", `${succeeded}/${selected.size} application(s) updated`);
    setSelected(new Set());
    setBulkStatus("");
  };

  // Bulk delete — runs all requests in parallel
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    toast("info", `Deleting ${selected.size} application(s)...`);
    const ids = Array.from(selected);
    const results = await Promise.allSettled(
      ids.map((id) => fetch(`/api/applications/${id}`, { method: "DELETE" }))
    );
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        setApplications((prev) => prev.filter((a) => a.id !== ids[i]));
      }
    });
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    toast("success", `${succeeded}/${selected.size} application(s) deleted`);
    setSelected(new Set());
  };

  return (
    <AdminLayout title="Applications" subtitle="Manage volunteer, program, and partnership applications">
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name or email..." />
        <div className="toolbar-right">
          {selected.size > 0 && (
            <div className="bulk-bar">
              <span className="bulk-count">{selected.size} selected</span>
              <select className="bulk-select" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                <option value="">Change status...</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-sm" onClick={handleBulkStatus} disabled={!bulkStatus}>
                Apply
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
                <i className="fas fa-trash" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

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

      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : (
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" onChange={toggleSelectAll} checked={sorted.length > 0 && selected.size === sorted.length} />
                </th>
                <th className="sortable" onClick={() => toggleSort("type")}>Type <i className={`fas ${sortIcon("type")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("firstName")}>Name <i className={`fas ${sortIcon("firstName")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("email")}>Email <i className={`fas ${sortIcon("email")}`} /></th>
                <th>Program</th>
                <th className="sortable" onClick={() => toggleSort("status")}>Status <i className={`fas ${sortIcon("status")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("createdAt")}>Date <i className={`fas ${sortIcon("createdAt")}`} /></th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={8} className="empty">
                  {search ? "No applications match your search." : "No applications found."}
                </td></tr>
              ) : (
                sorted.map((app) => (
                  <React.Fragment key={app.id}>
                    <tr>
                      <td><input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} /></td>
                      <td><span className="type-badge">{app.type}</span></td>
                      <td style={{ fontWeight: 600 }}>{app.firstName} {app.lastName}</td>
                      <td>{app.email}</td>
                      <td style={{ color: "#6b7280" }}>{app.program || app.organization || "-"}</td>
                      <td>
                        <div className="status-dropdown-wrap">
                          <select
                            className="status-dropdown"
                            style={{ background: statusStyle[app.status].bg, color: statusStyle[app.status].color }}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            disabled={savingId === app.id}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>{app.date}</td>
                      <td>
                        <button className="icon-btn view" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} title={expandedId === app.id ? "Close" : "View"}>
                          <i className={`fas fa-${expandedId === app.id ? "chevron-up" : "eye"}`} />
                        </button>
                      </td>
                    </tr>
                    {expandedId === app.id && (
                      <tr className="detail-row">
                        <td colSpan={8}>
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
      )}

      <style jsx>{`
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px; flex-wrap: wrap; }
        .toolbar-right { display: flex; align-items: center; gap: 12px; }
        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: rgba(212,175,55,0.1); border-radius: 12px; }
        .bulk-count { font-size: 0.85rem; font-weight: 600; color: #1C1C1C; }
        .bulk-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #D0D0D0; font-size: 0.8rem; font-family: "DM Sans", sans-serif; }

        .filters { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .filter-group { display: flex; align-items: center; gap: 12px; }
        .filter-label { font-size: 0.85rem; font-weight: 600; color: #6b7280; min-width: 50px; }
        .filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .filter-tab { padding: 6px 16px; border: 1px solid #D0D0D0; border-radius: 20px; background: #fff; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.15s; font-family: "DM Sans", sans-serif; color: #4B5563; }
        .filter-tab.active { background: #D4AF37; color: #1C1C1C; border-color: #D4AF37; }
        .filter-tab:hover:not(.active) { background: #FAFBFC; border-color: #A0A0A0; }
        .type-badge { display: inline-flex; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; background: #F3F4F6; color: #1C1C1C; }
        .status-dropdown-wrap { position: relative; }
        .status-dropdown { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: none; cursor: pointer; font-family: "DM Sans", sans-serif; min-width: 100px; justify-content: center; appearance: auto; }
        .icon-btn.view { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: none; border-radius: 6px; font-size: 0.78rem; cursor: pointer; transition: all 0.15s; }
        .icon-btn.view { background: rgba(107,114,128,0.1); color: #4b5563; }
        .icon-btn.view:hover { background: rgba(107,114,128,0.2); }
        .detail-row td { padding: 0 !important; border-bottom: 1px solid #EDEDED; }
        .detail-panel { padding: 0 24px 24px; background: #FAFBFC; }
        .detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 20px 0; }
        .detail-item { display: flex; flex-direction: column; gap: 2px; }
        .detail-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; font-weight: 600; }
        .detail-message { padding: 16px 0; border-top: 1px solid #EDEDED; display: flex; flex-direction: column; gap: 6px; }
        .detail-message p { line-height: 1.6; color: #1C1C1C; }
        th.sortable { cursor: pointer; user-select: none; }
        th.sortable:hover { color: #d4af37; }
        th.sortable i { margin-left: 4px; font-size: 0.7rem; opacity: 0.5; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </AdminLayout>
  );
}
