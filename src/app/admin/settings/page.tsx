"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/Toast";
import SearchBar from "@/components/admin/SearchBar";

function getGroup(key: string): string {
  if (key.startsWith("site_")) return "Site";
  if (key.startsWith("hero_")) return "Hero Section";
  if (key.startsWith("social_")) return "Social Media";
  if (key.startsWith("contact_")) return "Contact";
  if (key.startsWith("about_")) return "About";
  return "Other";
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.settings || []);
        }
      } catch {
        toast("error", "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleChange = (key: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, value } : e)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: entries }),
      });
      if (res.ok) {
        toast("success", "Settings saved successfully");
      } else {
        toast("error", "Failed to save settings.");
      }
    } catch {
      toast("error", "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = entries.filter((e) =>
    !search || e.key.toLowerCase().includes(search.toLowerCase()) || e.value.toLowerCase().includes(search.toLowerCase())
  );

  const groups = ["Site", "Hero Section", "Social Media", "Contact", "About", "Other"];

  return (
    <AdminLayout title="Site Settings" subtitle="Manage global site settings">
      <div className="settings-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search settings..." />
        <button className="glass-btn glass-btn-primary" onClick={handleSave} disabled={saving}>
          <i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-save"}`} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>
          Loading settings...
        </div>
      ) : !search ? (
        groups.map((group) => {
          const groupEntries = entries.filter((e) => getGroup(e.key) === group);
          if (groupEntries.length === 0) return null;
          return (
            <div key={group} className="settings-group">
              <h3 className="group-title">{group}</h3>
              <div className="glass-card settings-card">
                {groupEntries.map((entry) => (
                  <div key={entry.key} className="field-row">
                    <label className="field-label" htmlFor={entry.key}>
                      {entry.key.replace(/^(site_|hero_|social_|contact_|about_)/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <input
                      id={entry.key}
                      className="glass-input"
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
      ) : (
        <div className="settings-group">
          <h3 className="group-title">Search Results ({filtered.length})</h3>
          <div className="glass-card settings-card">
            {filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>No settings match your search.</div>
            ) : (
              filtered.map((entry) => (
                <div key={entry.key} className="field-row">
                  <label className="field-label" htmlFor={entry.key}>
                    {entry.key.replace(/^(site_|hero_|social_|contact_|about_)/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    <span className="field-key">{entry.key}</span>
                  </label>
                  <input
                    id={entry.key}
                    className="glass-input"
                    type="text"
                    value={entry.value}
                    onChange={(e) => handleChange(entry.key, e.target.value)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .settings-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .settings-toolbar button:disabled { opacity: 0.7; cursor: not-allowed; }
        .settings-group { margin-bottom: 28px; }
        .group-title { font-size: 1rem; color: #1a1a2e; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-family: "DM Sans", sans-serif; }
        .settings-card { overflow: hidden; }
        .field-row { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .field-row:last-child { border-bottom: none; }
        .field-label { min-width: 200px; font-size: 0.85rem; font-weight: 600; color: #1a1a2e; text-transform: capitalize; display: flex; flex-direction: column; gap: 2px; }
        .field-key { font-size: 0.7rem; color: #9ca3af; font-weight: 400; font-family: monospace; }
        @media (max-width: 768px) { .field-row { flex-direction: column; align-items: stretch; gap: 6px; } .field-label { min-width: auto; } }
      `}</style>
    </AdminLayout>
  );
}
