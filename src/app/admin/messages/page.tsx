"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useSortable } from "@/components/admin/useSortable";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

// Shape of a contact message from the API
interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { toast } = useToast();
  // Messages, expanded detail, and selection state
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Fetch contact messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch {
        toast("error", "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [toast]);

  // Toggle read/unread status on a single message
  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m)));
        toast("success", currentRead ? "Marked as unread" : "Marked as read");
      }
    } catch {
      toast("error", "Failed to update message");
    }
  };

  // Delete a single message by ID
  const handleDelete = async (id: string, name: string) => {
    toast("warning", `Deleting message from "${name}"...`);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) setExpandedId(null);
        toast("success", "Message deleted");
      }
    } catch {
      toast("error", "Failed to delete message");
    }
  };

  // Filter messages by search in name, email, or message body
  const filtered = messages.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
  });

  const { sorted, toggleSort, sortIcon } = useSortable(filtered, "createdAt");

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
      setSelected(new Set(sorted.map((m) => m.id)));
    }
  };

  // Bulk mark selected messages as read or unread
  const handleBulkRead = async (markRead: boolean) => {
    if (selected.size === 0) return;
    toast("info", `${markRead ? "Marking" : "Unmarking"} ${selected.size} message(s)...`);
    for (const id of selected) {
      try {
        await fetch(`/api/contact/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: markRead }),
        });
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: markRead } : m)));
      } catch { /* skip */ }
    }
    toast("success", `${selected.size} message(s) updated`);
    setSelected(new Set());
  };

  // Bulk delete all selected messages
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    toast("info", `Deleting ${selected.size} message(s)...`);
    for (const id of selected) {
      try {
        await fetch(`/api/contact/${id}`, { method: "DELETE" });
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      } catch { /* skip */ }
    }
    toast("success", `${selected.size} message(s) deleted`);
    setSelected(new Set());
  };

  return (
    <AdminLayout title="Contact Messages" subtitle="View and manage messages from the contact form">
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, or message..." />
        <div className="toolbar-right">
          {selected.size > 0 && (
            <div className="bulk-bar">
              <span className="bulk-count">{selected.size} selected</span>
              <button className="btn btn-sm" onClick={() => handleBulkRead(true)}>
                <i className="fas fa-envelope-open" /> Mark Read
              </button>
              <button className="btn btn-sm" onClick={() => handleBulkRead(false)}>
                <i className="fas fa-envelope" /> Mark Unread
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
                <i className="fas fa-trash" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" onChange={toggleSelectAll} checked={sorted.length > 0 && selected.size === sorted.length} />
                </th>
                <th className="sortable" onClick={() => toggleSort("read")}>Status <i className={`fas ${sortIcon("read")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("name")}>Name <i className={`fas ${sortIcon("name")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("email")}>Email <i className={`fas ${sortIcon("email")}`} /></th>
                <th>Message</th>
                <th className="sortable" onClick={() => toggleSort("createdAt")}>Date <i className={`fas ${sortIcon("createdAt")}`} /></th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={7} className="empty">
                  {search ? "No messages match your search." : "No messages yet."}
                </td></tr>
              ) : (
                sorted.map((msg) => (
                  <tr key={msg.id} style={!msg.read ? { fontWeight: 600 } : undefined}>
                    <td><input type="checkbox" checked={selected.has(msg.id)} onChange={() => toggleSelect(msg.id)} /></td>
                    <td>
                      <span className={`badge ${msg.read ? "badge-neutral" : "badge-warning"}`}>
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
      )}

      {/* Expanded detail card showing full message content */}
      {expandedId && (() => {
        const msg = messages.find((m) => m.id === expandedId);
        if (!msg) return null;
        return (
          <div className="card detail-card">
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
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .toolbar-right { display: flex; align-items: center; gap: 12px; }
        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: rgba(212,175,55,0.1); border-radius: 12px; }
        .bulk-count { font-size: 0.85rem; font-weight: 600; color: #1C1C1C; white-space: nowrap; }

        .msg-preview { max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #6B7280; }
        .actions { display: flex; gap: 4px; }
        .icon-btn.view, .icon-btn.read, .icon-btn.delete { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 6px; font-size: 0.78rem; cursor: pointer; transition: all 0.15s; }
        .icon-btn.view { background: rgba(107,114,128,0.1); color: #4b5563; }
        .icon-btn.view:hover { background: rgba(107,114,128,0.2); }
        .icon-btn.read { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        .icon-btn.read:hover { background: rgba(29,78,216,0.2); }
        .icon-btn.delete { background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn.delete:hover { background: rgba(220,38,38,0.2); }
        .detail-card { margin-top: 20px; overflow: hidden; }
        .detail-header { padding: 20px 24px; border-bottom: 1px solid #EDEDED; }
        .detail-header h3 { font-size: 1.1rem; margin-bottom: 4px; color: #1C1C1C; }
        .detail-email { color: #6B7280; font-size: 0.85rem; }
        .detail-body { padding: 20px 24px; }
        .detail-body p { line-height: 1.7; color: #1C1C1C; white-space: pre-wrap; }
        .detail-footer { padding: 12px 24px; border-top: 1px solid #EDEDED; font-size: 0.8rem; color: #6B7280; }
        th.sortable { cursor: pointer; user-select: none; }
        th.sortable:hover { color: #d4af37; }
        th.sortable i { margin-left: 4px; font-size: 0.7rem; opacity: 0.5; }
      `}</style>
    </AdminLayout>
  );
}
