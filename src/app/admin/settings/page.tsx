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

function getGroup(key: string): string {
  if (key.startsWith("site_")) return "Site";
  if (key.startsWith("hero_")) return "Hero Section";
  if (key.startsWith("social_")) return "Social Media";
  if (key.startsWith("contact_")) return "Contact";
  if (key.startsWith("about_")) return "About";
  return "Other";
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [entries, setEntries] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.settings || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, value } : e)));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: entries }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save settings.");
      }
    } catch {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
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

  const groups = ["Site", "Hero Section", "Social Media", "Contact", "About", "Other"];

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
              <h2>Site Settings</h2>
              <p>Manage global site settings</p>
            </div>
            <button className="btn btn-primary save-btn" onClick={handleSave} disabled={saving}>
              <i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-save"}`} />
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading-card">
            <p>Loading settings...</p>
          </div>
        ) : (
          groups.map((group) => {
            const groupEntries = entries.filter((e) => getGroup(e.key) === group);
            if (groupEntries.length === 0) return null;
            return (
              <div key={group} className="settings-group">
                <h3 className="group-title">{group}</h3>
                <div className="group-card">
                  {groupEntries.map((entry) => (
                    <div key={entry.key} className="field-row">
                      <label className="field-label" htmlFor={entry.key}>
                        {entry.key.replace(/^(site_|hero_|social_|contact_|about_)/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </label>
                      <input
                        id={entry.key}
                        className="field-input"
                        type="text"
                        value={entry.value}
                        onChange={(e) => handleChange(entry.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
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
        .save-btn { gap: 8px; padding: 12px 24px; font-size: 0.9rem; min-width: 150px; justify-content: center; }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .loading-card { background: var(--white); border-radius: var(--radius); padding: 48px; text-align: center; color: var(--gray); box-shadow: var(--shadow-sm); }
        .settings-group { margin-bottom: 28px; }
        .group-title { font-size: 1rem; color: var(--charcoal); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-family: "DM Sans", sans-serif; }
        .group-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
        .field-row { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--gray-100); }
        .field-row:last-child { border-bottom: none; }
        .field-label { min-width: 200px; font-size: 0.85rem; font-weight: 600; color: var(--charcoal); text-transform: capitalize; }
        .field-input { flex: 1; padding: 10px 14px; border: 1px solid var(--gray-100); border-radius: var(--radius-sm); font-size: 0.9rem; font-family: "DM Sans", sans-serif; transition: var(--transition); outline: none; }
        .field-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1); }
        @media (max-width: 768px) {
          .sidebar { width: 64px; }
          .sidebar-title, .nav-link span, .admin-info span, .back-link span { display: none; }
          .sidebar-header { justify-content: center; padding: 16px 8px; }
          .nav-link { justify-content: center; padding: 12px; }
          .main-content { padding: 24px 16px; }
          .field-row { flex-direction: column; align-items: stretch; gap: 6px; }
          .field-label { min-width: auto; }
        }
      `}</style>
    </div>
  );
}
