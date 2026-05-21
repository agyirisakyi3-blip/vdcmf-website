"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useSortable } from "@/components/admin/useSortable";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

interface SubscriberData {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/subscribers");
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers || []);
        }
      } catch {
        toast("error", "Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [toast]);

  const handleDelete = async (id: string, email: string) => {
    toast("warning", `Removing "${email}"...`);
    try {
      const res = await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        toast("success", `"${email}" removed`);
      }
    } catch {
      toast("error", "Failed to remove subscriber");
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
    toast("success", "CSV exported");
  };

  const filtered = subscribers.filter((s) =>
    !search || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const { sorted, toggleSort, sortIcon } = useSortable(filtered, "createdAt");

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <AdminLayout
      title="Newsletter Subscribers"
      subtitle={`${activeCount} active subscriber${activeCount !== 1 ? "s" : ""}`}
    >
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by email..." />
        <button className="glass-btn glass-btn-outline" onClick={exportCSV} disabled={subscribers.length === 0}>
          <i className="fas fa-download" /> Export CSV
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <div className="glass-table">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort("email")}>Email <i className={`fas ${sortIcon("email")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("active")}>Status <i className={`fas ${sortIcon("active")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("createdAt")}>Subscribed <i className={`fas ${sortIcon("createdAt")}`} /></th>
                <th style={{ width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={4} className="glass-empty">
                  {search ? "No subscribers match your search." : "No subscribers yet."}
                </td></tr>
              ) : (
                sorted.map((sub) => (
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
      )}

      <style jsx>{`
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .toolbar button:disabled { opacity: 0.5; cursor: not-allowed; }
        .icon-btn { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn:hover { background: rgba(220,38,38,0.2); }
        th.sortable { cursor: pointer; user-select: none; }
        th.sortable:hover { color: #d4af37; }
        th.sortable i { margin-left: 4px; font-size: 0.7rem; opacity: 0.5; }
      `}</style>
    </AdminLayout>
  );
}
