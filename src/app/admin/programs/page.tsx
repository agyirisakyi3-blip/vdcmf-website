"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TableSkeleton } from "@/components/admin/Skeleton";
import { useSortable } from "@/components/admin/useSortable";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

// Shape of a program from the API
interface ProgramData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  icon: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
}

// Default empty form used for create/reset
const emptyForm = { title: "", slug: "", description: "", content: "", icon: "", image: "", published: true };

export default function AdminProgramsPage() {
  const { toast } = useToast();
  // Programs list, inline form state, and search
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch all programs on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data.programs || []);
        }
      } catch {
        toast("error", "Failed to load programs");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [toast]);

  // Open the form in create mode with empty fields
  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };

  // Open the form in edit mode pre-populated with existing data
  const openEdit = (prog: ProgramData) => {
    setForm({
      title: prog.title,
      slug: prog.slug,
      description: prog.description,
      content: prog.content || "",
      icon: prog.icon || "",
      image: prog.image || "",
      published: prog.published,
    });
    setEditingId(prog.id);
    setShowForm(true);
  };

  // Save (create or update) program via POST or PUT
  const handleSave = async () => {
    if (!form.title || !form.slug || !form.description) {
      toast("error", "Title, slug, and description are required.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/programs/${editingId}` : "/api/programs";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        toast("success", editingId ? "Program updated" : "Program created");
        const fetchRes = await fetch("/api/programs");
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          setPrograms(data.programs || []);
        }
      } else {
        const data = await res.json();
        toast("error", data.error || "Failed to save program.");
      }
    } catch {
      toast("error", "Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a program by ID with confirmation toast
  const handleDelete = async (id: string, title: string) => {
    toast("warning", `Deleting "${title}"...`);
    try {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        toast("success", `"${title}" deleted`);
      }
    } catch {
      toast("error", "Failed to delete program");
    }
  };

  // Filter programs by title or slug search
  const filtered = programs.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const { sorted, toggleSort, sortIcon } = useSortable(filtered, "createdAt");

  return (
    <AdminLayout title="Programs" subtitle="Manage foundation programs">
      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title or slug..." />
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="fas fa-plus" /> New Program
        </button>
      </div>

      {/* Inline create/edit form inside a card */}
      {showForm && (
        <div className="card form-card">
          <h3>{editingId ? "Edit Program" : "New Program"}</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input className="input" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Slug</label>
              <input className="input" type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="form-field full-width">
              <label>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-field full-width">
              <label>Content (full page, optional)</label>
              <textarea className="input" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Icon class (e.g. fa-graduation-cap)</label>
              <input className="input" type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Image URL</label>
              <input className="input" type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-field checkbox-field">
              <label>
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-save"}`} />
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort("title")}>Title <i className={`fas ${sortIcon("title")}`} /></th>
                <th>Slug</th>
                <th className="sortable" onClick={() => toggleSort("published")}>Status <i className={`fas ${sortIcon("published")}`} /></th>
                <th className="sortable" onClick={() => toggleSort("createdAt")}>Date <i className={`fas ${sortIcon("createdAt")}`} /></th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={5} className="empty">
                  {search ? "No programs match your search." : "No programs yet. Create your first program!"}
                </td></tr>
              ) : (
                sorted.map((prog) => (
                  <tr key={prog.id}>
                    <td style={{ fontWeight: 600 }}>{prog.title}</td>
                    <td style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "0.85rem" }}>{prog.slug}</td>
                    <td>
                      <span className={`badge ${prog.published ? "badge-success" : "badge-warning"}`}>
                        {prog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                      {new Date(prog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn edit" onClick={() => openEdit(prog)} title="Edit">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDelete(prog.id, prog.title)} title="Delete">
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

      <style jsx>{`
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .form-card { padding: 24px; margin-bottom: 24px; }
        .form-card h3 { margin-bottom: 20px; font-size: 1.15rem; color: #1C1C1C; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full-width { grid-column: 1 / -1; }
        .form-field label { font-size: 0.85rem; font-weight: 600; color: #6b7280; }
        .form-field textarea { resize: vertical; }
        .checkbox-field label { display: flex; align-items: center; gap: 8px; cursor: pointer; flex-direction: row; }
        .form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .actions { display: flex; gap: 6px; }
        .icon-btn.edit, .icon-btn.delete { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: none; border-radius: 6px; font-size: 0.78rem; cursor: pointer; transition: all 0.15s; }
        .icon-btn.edit { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        .icon-btn.edit:hover { background: rgba(29,78,216,0.2); }
        .icon-btn.delete { background: rgba(220,38,38,0.1); color: #dc2626; }
        .icon-btn.delete:hover { background: rgba(220,38,38,0.2); }
        th.sortable { cursor: pointer; user-select: none; }
        th.sortable:hover { color: #d4af37; }
        th.sortable i { margin-left: 4px; font-size: 0.7rem; opacity: 0.5; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </AdminLayout>
  );
}
