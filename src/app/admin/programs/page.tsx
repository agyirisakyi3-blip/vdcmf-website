"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
  { href: "/admin/programs", label: "Programs", icon: "fa-hand-holding-heart" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "fa-users" },
  { href: "/admin/settings", label: "Settings", icon: "fa-cog" },
];

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

const emptyForm = { title: "", slug: "", description: "", content: "", icon: "", image: "", published: true };

export default function AdminProgramsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data.programs || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

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

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.description) {
      alert("Title, slug, and description are required.");
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
        const fetchRes = await fetch("/api/programs");
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          setPrograms(data.programs || []);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save program.");
      }
    } catch {
      alert("Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete program "${title}"? This will also remove associated applications.`)) return;
    try {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // ignore
    }
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
          <div className="header-row">
            <div>
              <h2>Programs</h2>
              <p>Manage foundation programs</p>
            </div>
            <button className="btn btn-primary new-btn" onClick={openCreate}>
              <i className="fas fa-plus" /> New Program
            </button>
          </div>
        </header>

        {showForm && (
          <div className="form-card">
            <h3>{editingId ? "Edit Program" : "New Program"}</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="form-field full-width">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field full-width">
                <label>Content (full page, optional)</label>
                <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Icon class (e.g. fa-graduation-cap)</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="empty-cell">Loading programs...</td></tr>
              ) : programs.length === 0 ? (
                <tr><td colSpan={5} className="empty-cell">No programs yet. Create your first program!</td></tr>
              ) : (
                programs.map((prog) => (
                  <tr key={prog.id}>
                    <td className="title-cell">{prog.title}</td>
                    <td className="slug-cell">{prog.slug}</td>
                    <td>
                      <span className={`status-badge ${prog.published ? "published" : "draft"}`}>
                        {prog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(prog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => openEdit(prog)}>
                          <i className="fas fa-edit" />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(prog.id, prog.title)}>
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
      </main>

      <style jsx>{`
        .admin-layout { display: flex; min-height: 100vh; background: var(--cream); }
        .sidebar { width: 260px; background: var(--charcoal); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-header { display: flex; align-items: center; gap: 12px; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-logo { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); }
        .sidebar-title { color: var(--gold); font-weight: 700; font-size: 1rem; font-family: "DM Sans", sans-serif; }
        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius); color: var(--gray-light); font-size: 0.9rem; font-weight: 500; transition: var(--transition); font-family: "DM Sans", sans-serif; }
        .nav-link i { width: 20px; text-align: center; }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: var(--white); }
        .nav-link.active { background: var(--gold); color: var(--white); }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px; }
        .admin-info { display: flex; align-items: center; gap: 10px; padding: 8px 16px; color: var(--gray-light); font-size: 0.85rem; }
        .admin-info i { font-size: 1.4rem; color: var(--gold); }
        .back-link { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.85rem; color: var(--gray-light); border-radius: var(--radius); transition: var(--transition); }
        .back-link:hover { background: rgba(255,255,255,0.06); color: var(--gold); }
        .main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
        .content-header { margin-bottom: 32px; }
        .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .content-header h2 { font-size: 1.75rem; color: var(--charcoal); }
        .content-header p { color: var(--gray); margin-top: 4px; }
        .new-btn { gap: 8px; padding: 12px 24px; font-size: 0.9rem; }
        .form-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm); padding: 24px; margin-bottom: 24px; }
        .form-card h3 { margin-bottom: 20px; font-size: 1.15rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full-width { grid-column: 1 / -1; }
        .form-field label { font-size: 0.85rem; font-weight: 600; color: var(--gray); }
        .form-field input[type="text"], .form-field textarea { padding: 10px 14px; border: 1px solid var(--gray-100); border-radius: var(--radius-sm); font-size: 0.9rem; font-family: "DM Sans", sans-serif; outline: none; transition: var(--transition); }
        .form-field input[type="text"]:focus, .form-field textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }
        .checkbox-field label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .form-actions button { gap: 8px; padding: 10px 24px; font-size: 0.9rem; }
        .table-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 16px 20px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray); border-bottom: 2px solid var(--gray-100); font-family: "DM Sans", sans-serif; }
        .data-table td { padding: 14px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--gray-100); color: var(--charcoal); }
        .data-table tr:last-child td { border-bottom: none; }
        .title-cell { font-weight: 600; }
        .slug-cell { color: var(--gray); font-family: monospace; font-size: 0.85rem; }
        .date-cell { color: var(--gray); white-space: nowrap; }
        .actions-col { width: 100px; }
        .actions-cell { display: flex; gap: 6px; }
        .empty-cell { text-align: center; padding: 48px !important; color: var(--gray); }
        .status-badge { display: inline-flex; padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; }
        .status-badge.published { background: #ecfdf5; color: var(--success); }
        .status-badge.draft { background: #fef3c7; color: #b45309; }
        .action-btn { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: var(--radius-sm); font-size: 0.8rem; border: none; cursor: pointer; transition: var(--transition); }
        .edit-btn { background: #eff6ff; color: var(--blue); }
        .edit-btn:hover { background: #dbeafe; }
        .delete-btn { background: #fef2f2; color: var(--error); }
        .delete-btn:hover { background: #fecaca; }
        @media (max-width: 768px) {
          .sidebar { width: 64px; }
          .sidebar-title, .nav-link span, .admin-info span, .back-link span { display: none; }
          .sidebar-header { justify-content: center; padding: 16px 8px; }
          .nav-link { justify-content: center; padding: 12px; }
          .main-content { padding: 24px 16px; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
