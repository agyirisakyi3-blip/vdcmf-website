"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ToastProvider } from "./Toast";

interface NavLink {
  href: string;
  label: string;
  icon: string;
  badge?: "messages" | "applications" | "subscribers";
  children?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  {
    href: "/admin/blog", label: "Blog", icon: "fa-newspaper",
    children: [
      { href: "/admin/blog", label: "All Posts" },
      { href: "/admin/blog/new", label: "New Post" },
    ],
  },
  {
    href: "/admin/applications", label: "Applications", icon: "fa-file-alt", badge: "applications",
    children: [
      { href: "/admin/applications", label: "All Applications" },
    ],
  },
  { href: "/admin/programs", label: "Programs", icon: "fa-hand-holding-heart" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope", badge: "messages" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "fa-users", badge: "subscribers" },
  { href: "/admin/settings", label: "Settings", icon: "fa-cog" },
];

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [recentPosts, setRecentPosts] = useState<{ id: string; title: string }[]>([]);
  const [recentApplications, setRecentApplications] = useState<{ id: string; firstName: string; lastName: string; type: string }[]>([]);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-admin-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-admin-theme", "dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-admin-theme");
      localStorage.setItem("admin-theme", "light");
    }
  };

  useEffect(() => {
    navLinks.forEach((link) => {
      if (link.children) {
        const isChildActive = link.children.some((child) => pathname === child.href || pathname.startsWith(child.href.replace(/\/$/, "")));
        if (isChildActive) setOpenMenus((prev) => ({ ...prev, [link.href]: true }));
      }
    });
  }, [pathname]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [messagesRes, applicationsRes, subscribersRes] = await Promise.all([
          fetch("/api/contact"),
          fetch("/api/applications"),
          fetch("/api/subscribers"),
        ]);
        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setBadges((prev) => ({ ...prev, messages: data.messages.filter((m: { read: boolean }) => !m.read).length }));
        }
        if (applicationsRes.ok) {
          const data = await applicationsRes.json();
          const pending = data.applications.filter((a: { status: string }) => a.status === "PENDING").length;
          setBadges((prev) => ({ ...prev, applications: pending }));
          setRecentApplications(data.applications.slice(0, 3));
        }
        if (subscribersRes.ok) {
          const data = await subscribersRes.json();
          setBadges((prev) => ({ ...prev, subscribers: data.subscribers.length }));
        }
        const blogRes = await fetch("/api/blog");
        if (blogRes.ok) {
          const data = await blogRes.json();
          setRecentPosts(data.posts.slice(0, 3));
        }
      } catch { /* silent */ }
    };
    fetchSidebarData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubMenu = (href: string) => setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  const isChildActive = (link: NavLink) => link.children?.some((child) => pathname === child.href);

  if (status === "loading") {
    return (
      <div className="admin-loading">
        <div className="glass-spinner" />
        <style jsx>{`
          .admin-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea, #764ba2); }
          .glass-spinner { width: 48px; height: 48px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
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
    <div className="admin-root">
      <ToastProvider>
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-brand">
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <i className={`fas fa-${collapsed ? "chevron-right" : "chevron-left"}`} />
            </button>
            <div className="brand-logo-wrap">
              <img src="/logo.svg" alt="VDCMF" className="brand-logo" />
            </div>
            <span className="brand-text">VDCMF</span>
          </div>

          <nav className="sidebar-nav">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const expanded = openMenus[link.href];
              const hasChildren = link.children && link.children.length > 0;
              const childActive = isChildActive(link);
              const badgeCount = link.badge ? badges[link.badge] : undefined;

              return (
                <div key={link.href} className={`nav-group ${collapsed ? "nav-group-collapsed" : ""}`}>
                  <div className={`nav-item-wrap ${(active || childActive) && !expanded ? "active-parent" : ""}`}>
                    <Link
                      href={link.href}
                      className={`nav-item ${active ? "active" : ""}`}
                    >
                      <div className="nav-icon-wrap">
                        <i className={`fas ${link.icon}`} />
                        {badgeCount !== undefined && badgeCount > 0 && (
                          <span className="badge-dot">{badgeCount > 9 ? "9+" : badgeCount}</span>
                        )}
                      </div>
                      <span className="nav-label">{link.label}</span>
                      {hasChildren && (
                        <i className={`fas fa-chevron-down sub-chevron ${expanded ? "open" : ""}`} />
                      )}
                    </Link>
                    {!collapsed && badgeCount !== undefined && badgeCount > 0 && (
                      <span className="badge-pill">{badgeCount > 99 ? "99+" : badgeCount}</span>
                    )}
                    {hasChildren && collapsed && badgeCount !== undefined && badgeCount > 0 && (
                      <span className="badge-dot collapsed-badge">{badgeCount > 9 ? "9+" : badgeCount}</span>
                    )}
                  </div>

                  {hasChildren && (
                    <div className={`sub-menu ${expanded ? "open" : ""}`}>
                      {link.children!.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`sub-item ${childActive ? "active" : ""}`}
                          >
                            {childActive && <span className="sub-indicator" />}
                            <i className="fas fa-circle sub-dot" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {collapsed && hasChildren && expanded && (
                    <div className="flyout-menu">
                      <div className="flyout-header">{link.label}</div>
                      {link.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flyout-item ${pathname === child.href ? "active" : ""}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={`recent-section ${collapsed ? "hidden" : ""}`}>
              <div className="recent-header">
                <i className="fas fa-history" />
                <span>Recent</span>
              </div>
              {recentPosts.length > 0 && (
                <div className="recent-group">
                  <span className="recent-label">Posts</span>
                  {recentPosts.map((p) => (
                    <Link key={p.id} href="/admin/blog" className="recent-item">
                      <i className="fas fa-file-lines" />
                      <span>{p.title}</span>
                    </Link>
                  ))}
                </div>
              )}
              {recentApplications.length > 0 && (
                <div className="recent-group">
                  <span className="recent-label">Applications</span>
                  {recentApplications.map((a) => (
                    <Link key={a.id} href="/admin/applications" className="recent-item">
                      <i className="fas fa-file-alt" />
                      <span>{a.firstName} {a.lastName} — {a.type}</span>
                    </Link>
                  ))}
                </div>
              )}
              {recentPosts.length === 0 && recentApplications.length === 0 && (
                <div className="recent-empty">No recent activity</div>
              )}
            </div>
          </nav>

          <div className="sidebar-footer" ref={userMenuRef}>
            <div className="admin-profile" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="profile-avatar">
                <i className="fas fa-user-circle" />
                {userMenuOpen && <span className="profile-indicator" />}
              </div>
              <div className={`profile-info ${collapsed ? "hidden" : ""}`}>
                <span className="profile-name">{session?.user?.name || session?.user?.email}</span>
                <span className="profile-role">Admin</span>
              </div>
              <i className={`fas fa-chevron-up profile-chevron ${userMenuOpen ? "open" : ""} ${collapsed ? "hidden" : ""}`} />
            </div>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <i className="fas fa-user-circle" />
                  <div>
                    <span className="dropdown-name">{session?.user?.name || session?.user?.email}</span>
                    <span className="dropdown-role">Administrator</span>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <Link href="/admin/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                  <i className="fas fa-cog" /> Settings
                </Link>
                <Link href="/" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                  <i className="fas fa-external-link-alt" /> View Site
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
                  <i className="fas fa-sign-out-alt" /> Sign Out
                </button>
              </div>
            )}

            <div className="theme-toggle-row">
              <button className="theme-btn" onClick={toggleTheme} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
                <i className={`fas fa-${dark ? "sun" : "moon"}`} />
              </button>
              <span className={`theme-label ${collapsed ? "hidden" : ""}`}>{dark ? "Light Mode" : "Dark Mode"}</span>
            </div>

            <Link href="/" className="view-site-btn">
              <i className="fas fa-arrow-left" />
              <span className={collapsed ? "hidden" : ""}>View Site</span>
            </Link>
          </div>
        </aside>

        <main className="admin-main">
          <header className="page-header">
            <div className="header-content">
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
          </header>
          <div className="page-body">{children}</div>
        </main>
      </ToastProvider>

      <style jsx>{`
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #F2F4F6;
          font-family: "DM Sans", sans-serif;
        }

        /* ─── Sidebar ─── */
        .admin-sidebar {
          width: 260px;
          background: #1B1C1D;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 10;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .admin-sidebar.collapsed { width: 64px; }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 20px;
          min-height: 72px;
        }
        .collapse-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          font-size: 0.7rem;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .brand-logo-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #D4AF37;
          flex-shrink: 0;
        }
        .brand-logo { width: 100%; height: 100%; object-fit: cover; }
        .brand-text {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        /* ─── Navigation ─── */
        .sidebar-nav {
          flex: 1;
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        .nav-group { position: relative; }

        .nav-item-wrap { position: relative; display: flex; align-items: center; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 14px;
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.15s ease;
          text-decoration: none;
          flex: 1;
          min-width: 0;
        }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nav-item.active { color: #fff; background: #D4AF37; }

        .nav-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
          position: relative;
          transition: all 0.15s ease;
        }
        .nav-item:hover .nav-icon-wrap { background: rgba(255,255,255,0.1); }
        .nav-item.active .nav-icon-wrap { background: rgba(255,255,255,0.15); }
        .nav-item i { font-size: 0.85rem; }
        .nav-item.active i { color: #fff; }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .collapsed .nav-label { opacity: 0; width: 0; overflow: hidden; }

        .sub-chevron {
          margin-left: auto;
          font-size: 0.55rem;
          transition: transform 0.2s ease;
          opacity: 0.35;
          flex-shrink: 0;
        }
        .sub-chevron.open { transform: rotate(180deg); opacity: 0.6; }

        .badge-dot {
          position: absolute; top: -3px; right: -3px;
          min-width: 15px; height: 15px; padding: 0 4px;
          border-radius: 8px; background: #ef4444; color: #fff;
          font-size: 0.55rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; line-height: 1;
        }
        .badge-pill {
          margin-left: auto;
          padding: 2px 7px; border-radius: 8px;
          background: rgba(239,68,68,0.15); color: #fca5a5;
          font-size: 0.65rem; font-weight: 700; flex-shrink: 0; line-height: 1.3;
        }
        .collapsed-badge { display: none; }
        .collapsed .collapsed-badge { display: flex; }

        .sub-menu {
          max-height: 0; overflow: hidden;
          transition: max-height 0.2s ease, opacity 0.15s;
          opacity: 0; padding-left: 42px;
        }
        .sub-menu.open { max-height: 200px; opacity: 1; padding-top: 2px; padding-bottom: 2px; }
        .sub-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px; border-radius: 6px;
          color: rgba(255,255,255,0.4); font-size: 0.8rem;
          text-decoration: none; transition: all 0.15s; position: relative;
        }
        .sub-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .sub-item.active { color: #D4AF37; }
        .sub-dot { font-size: 0.3rem; flex-shrink: 0; opacity: 0.4; }
        .sub-item.active .sub-dot { opacity: 1; color: #D4AF37; }
        .sub-indicator {
          position: absolute; left: -10px; top: 50%; transform: translateY(-50%);
          width: 3px; height: 14px; border-radius: 2px; background: #D4AF37;
        }

        .flyout-menu {
          position: absolute; left: calc(100% + 8px); top: 0;
          min-width: 180px; background: #1B1C1D;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; padding: 6px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 20;
          animation: flyIn 0.15s ease;
        }
        @keyframes flyIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .flyout-header { padding: 6px 10px; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); font-weight: 600; }
        .flyout-item { display: block; padding: 7px 10px; border-radius: 6px; color: rgba(255,255,255,0.55); font-size: 0.8rem; text-decoration: none; transition: all 0.15s; }
        .flyout-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .flyout-item.active { color: #D4AF37; background: rgba(212,175,55,0.08); }

        .recent-section {
          margin-top: auto; padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .recent-section.hidden { display: none; }
        .recent-header { display: flex; align-items: center; gap: 6px; padding: 0 12px 8px; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.25); font-weight: 600; }
        .recent-header i { font-size: 0.6rem; }
        .recent-group { margin-bottom: 6px; }
        .recent-label { display: block; padding: 3px 12px; font-size: 0.6rem; color: rgba(255,255,255,0.2); font-weight: 500; }
        .recent-item { display: flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 5px; color: rgba(255,255,255,0.35); font-size: 0.75rem; text-decoration: none; transition: all 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .recent-item:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }
        .recent-item i { font-size: 0.65rem; opacity: 0.5; flex-shrink: 0; }
        .recent-item span { overflow: hidden; text-overflow: ellipsis; }
        .recent-empty { padding: 6px 12px; font-size: 0.75rem; color: rgba(255,255,255,0.2); }

        /* ─── Footer ─── */
        .sidebar-footer {
          padding: 10px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 4px;
          position: relative;
        }
        .admin-profile { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
        .admin-profile:hover { background: rgba(255,255,255,0.05); }
        .profile-avatar { position: relative; flex-shrink: 0; }
        .profile-avatar i { font-size: 1.4rem; color: rgba(255,255,255,0.35); }
        .profile-indicator { position: absolute; top: 0; right: 0; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; border: 2px solid #1B1C1D; }
        .profile-info { display: flex; flex-direction: column; min-width: 0; }
        .profile-info.hidden { display: none; }
        .profile-name { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-role { font-size: 0.6rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; }
        .profile-chevron { margin-left: auto; font-size: 0.5rem; color: rgba(255,255,255,0.25); transition: transform 0.2s; flex-shrink: 0; }
        .profile-chevron.open { transform: rotate(180deg); }
        .profile-chevron.hidden { display: none; }

        .user-dropdown {
          position: absolute; bottom: calc(100% + 8px); left: 10px; right: 10px;
          background: #1B1C1D; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; padding: 6px;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.4); z-index: 20;
          animation: dropUp 0.15s ease;
        }
        @keyframes dropUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .dropdown-header { display: flex; align-items: center; gap: 10px; padding: 6px 8px 10px; }
        .dropdown-header i { font-size: 1.6rem; color: rgba(255,255,255,0.3); }
        .dropdown-header div { display: flex; flex-direction: column; }
        .dropdown-name { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.8); }
        .dropdown-role { font-size: 0.65rem; color: rgba(255,255,255,0.35); }
        .dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; color: rgba(255,255,255,0.55); font-size: 0.82rem; text-decoration: none; transition: all 0.15s; border: none; background: none; width: 100%; cursor: pointer; font-family: inherit; }
        .dropdown-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .dropdown-item.logout:hover { color: #fca5a5; background: rgba(239,68,68,0.08); }
        .dropdown-item i { width: 16px; text-align: center; font-size: 0.8rem; }

        .theme-toggle-row { display: flex; align-items: center; gap: 10px; padding: 4px 10px; border-radius: 6px; }
        .theme-btn { width: 26px; height: 26px; border: none; background: rgba(255,255,255,0.06); border-radius: 6px; color: rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; font-size: 0.7rem; }
        .theme-btn:hover { background: rgba(255,255,255,0.12); color: #D4AF37; }
        .theme-label { font-size: 0.75rem; color: rgba(255,255,255,0.3); }

        .view-site-btn { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; color: rgba(255,255,255,0.3); text-decoration: none; transition: all 0.15s; }
        .view-site-btn:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }
        .view-site-btn i { font-size: 0.7rem; }

        /* ─── Main Content ─── */
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; min-height: 100vh; }
        .page-header { padding: 32px 40px 0; }
        .header-content { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #1C1C1C; font-family: "DM Sans", sans-serif; margin: 0; }
        .page-subtitle { margin-top: 4px; color: #6B7280; font-size: 0.88rem; }
        .page-body { padding: 24px 40px 40px; animation: fadeSlideIn 0.3s ease; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* ─── Shared Admin Styles ─── */
        :global(.card) { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02); border: 1px solid #EDEDED; transition: box-shadow 0.2s ease; }
        :global(.card:hover) { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

        :global(.tbl) { background: #fff; border-radius: 12px; border: 1px solid #EDEDED; overflow: hidden; }
        :global(.tbl table) { width: 100%; border-collapse: collapse; }
        :global(.tbl th) { text-align: left; padding: 14px 18px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; font-weight: 600; font-family: "DM Sans", sans-serif; border-bottom: 1px solid #EDEDED; background: #FAFBFC; }
        :global(.tbl td) { padding: 12px 18px; font-size: 0.88rem; border-bottom: 1px solid #F0F0F0; color: #1C1C1C; }
        :global(.tbl tr:last-child td) { border-bottom: none; }
        :global(.tbl tr:hover td) { background: #FAFBFC; }

        :global(.btn) { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; font-family: "DM Sans", sans-serif; cursor: pointer; transition: all 0.15s ease; text-decoration: none; }
        :global(.btn-primary) { background: #D4AF37; color: #1C1C1C; }
        :global(.btn-primary:hover) { background: #C5A22E; }
        :global(.btn-outline) { background: transparent; border: 1px solid #D0D0D0; color: #4B5563; }
        :global(.btn-outline:hover) { border-color: #A0A0A0; background: #FAFBFC; }
        :global(.btn-sm) { padding: 6px 14px; font-size: 0.8rem; }
        :global(.btn-danger) { background: #ef4444; color: #fff; }
        :global(.btn-danger:hover) { background: #dc2626; }

        :global(.badge) { display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }
        :global(.badge-success) { background: #ECFDF5; color: #059669; }
        :global(.badge-warning) { background: #FFFBEB; color: #D97706; }
        :global(.badge-info) { background: #EFF6FF; color: #2563EB; }
        :global(.badge-danger) { background: #FEF2F2; color: #DC2626; }
        :global(.badge-neutral) { background: #F3F4F6; color: #6B7280; }

        :global(.input) { padding: 9px 14px; border: 1px solid #D0D0D0; border-radius: 8px; font-size: 0.88rem; font-family: "DM Sans", sans-serif; outline: none; transition: all 0.15s; background: #fff; color: #1C1C1C; }
        :global(.input:focus) { border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }

        :global(.empty) { text-align: center; padding: 40px; color: #6B7280; font-size: 0.88rem; }

        :global(.icon-btn) { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 6px; font-size: 0.78rem; cursor: pointer; transition: all 0.15s; }
        :global(.icon-btn:hover) { background: #F3F4F6; }

        :global(.toolbar) { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .admin-sidebar { width: 64px; }
          .brand-text, .nav-label, .profile-info, .recent-section, .view-site-btn span, .theme-label { display: none; }
          .sidebar-brand { justify-content: center; padding: 16px 8px; }
          .nav-item { justify-content: center; padding: 9px 8px; }
          .page-header { padding: 24px 16px 0; }
          .page-body { padding: 16px; }
          .collapse-btn { display: none; }
        }
      `}</style>

      <style jsx global>{`
        [data-admin-theme="dark"] .admin-root { background: #0D0E10; }
        [data-admin-theme="dark"] .page-title { color: #E5E7EB; }
        [data-admin-theme="dark"] .page-subtitle { color: #6B7280; }
        [data-admin-theme="dark"] :global(.card) { background: #16181C; border-color: rgba(255,255,255,0.06); }
        [data-admin-theme="dark"] :global(.card:hover) { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        [data-admin-theme="dark"] :global(.tbl) { background: #16181C; border-color: rgba(255,255,255,0.06); }
        [data-admin-theme="dark"] :global(.tbl th) { color: rgba(255,255,255,0.4); border-bottom-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); }
        [data-admin-theme="dark"] :global(.tbl td) { color: rgba(255,255,255,0.7); border-bottom-color: rgba(255,255,255,0.04); }
        [data-admin-theme="dark"] :global(.tbl tr:hover td) { background: rgba(255,255,255,0.03); }
        [data-admin-theme="dark"] :global(.input) { background: #16181C; border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
        [data-admin-theme="dark"] :global(.input:focus) { border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212,175,55,0.15); }
        [data-admin-theme="dark"] :global(.empty) { color: rgba(255,255,255,0.35); }
        [data-admin-theme="dark"] :global(.btn-outline) { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
        [data-admin-theme="dark"] :global(.btn-outline:hover) { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }
        [data-admin-theme="dark"] :global(.icon-btn:hover) { background: rgba(255,255,255,0.06); }
        [data-admin-theme="dark"] :global(.badge-success) { background: rgba(5,150,105,0.15); color: #34D399; }
        [data-admin-theme="dark"] :global(.badge-warning) { background: rgba(217,119,6,0.15); color: #FBBF24; }
        [data-admin-theme="dark"] :global(.badge-info) { background: rgba(37,99,235,0.15); color: #60A5FA; }
        [data-admin-theme="dark"] :global(.badge-danger) { background: rgba(220,38,38,0.15); color: #FCA5A5; }
        [data-admin-theme="dark"] :global(.badge-neutral) { background: rgba(107,114,128,0.15); color: #9CA3AF; }
      `}</style>
    </div>
  );
}
