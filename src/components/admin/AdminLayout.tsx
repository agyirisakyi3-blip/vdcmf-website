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
          background: var(--admin-bg, linear-gradient(135deg, #f5f7fa, #e4e9f2));
          font-family: "DM Sans", sans-serif;
        }
        .admin-root,
        .admin-root :global(*) {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        /* ─── Sidebar ─── */
        .admin-sidebar {
          width: 260px;
          background: rgba(30, 35, 50, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255,255,255,0.06);
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
          gap: 10px;
          padding: 20px 16px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          min-height: 72px;
        }
        .collapse-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.06);
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          font-size: 0.75rem;
          order: ${collapsed ? "0" : "0"};
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }

        .brand-logo-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
          flex-shrink: 0;
        }
        .brand-logo { width: 100%; height: 100%; object-fit: cover; }
        .brand-text {
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        /* ─── Navigation ─── */
        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .nav-group { position: relative; }

        .nav-item-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .nav-item-wrap.active-parent .nav-item:not(.active) {
          background: rgba(212,175,55,0.06);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.25s ease;
          text-decoration: none;
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }
        .nav-item:hover {
          color: #fff;
          background: rgba(255,255,255,0.10);
        }
        .nav-item.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,217,122,0.1));
        }

        .nav-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.10);
          flex-shrink: 0;
          position: relative;
          transition: all 0.25s ease;
        }
        .nav-item:hover .nav-icon-wrap { background: rgba(255,255,255,0.18); }
        .nav-item.active .nav-icon-wrap {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          box-shadow: 0 4px 12px rgba(212,175,55,0.3);
          animation: pulseGlow 2s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
          50% { box-shadow: 0 4px 20px rgba(212,175,55,0.5); }
        }
        .nav-item.active i { color: #fff; }
        .nav-item i { font-size: 0.9rem; }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: opacity 0.2s;
        }
        .collapsed .nav-label { opacity: 0; width: 0; overflow: hidden; }

        .sub-chevron {
          margin-left: auto;
          font-size: 0.6rem;
          transition: transform 0.3s ease;
          opacity: 0.55;
          flex-shrink: 0;
        }
        .sub-chevron.open { transform: rotate(180deg); opacity: 0.85; }

        /* Badges */
        .badge-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 8px;
          background: #ef4444;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .badge-pill {
          margin-left: auto;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(239,68,68,0.2);
          color: #fca5a5;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          line-height: 1.4;
        }
        .collapsed-badge { display: none; }
        .collapsed .collapsed-badge { display: flex; }

        /* Sub-menu */
        .sub-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s;
          opacity: 0;
          padding-left: 42px;
        }
        .sub-menu.open {
          max-height: 200px;
          opacity: 1;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .sub-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          font-size: 0.82rem;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }
        .sub-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
        .sub-item.active { color: #d4af37; }
        .sub-dot { font-size: 0.35rem; flex-shrink: 0; opacity: 0.55; }
        .sub-item.active .sub-dot { opacity: 1; color: #d4af37; }
        .sub-indicator {
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          border-radius: 2px;
          background: #d4af37;
        }

        /* Flyout for collapsed sub-menus */
        .flyout-menu {
          position: absolute;
          left: calc(100% + 8px);
          top: 0;
          min-width: 200px;
          background: rgba(30,35,50,0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 20;
          animation: flyIn 0.2s ease;
        }
        @keyframes flyIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .flyout-header {
          padding: 8px 12px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }
        .flyout-item {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .flyout-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .flyout-item.active { color: #d4af37; background: rgba(212,175,55,0.1); }

        /* Recent */
        .recent-section {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          transition: opacity 0.2s;
        }
        .recent-section.hidden { opacity: 0; height: 0; overflow: hidden; margin: 0; padding: 0; border: none; }
        .recent-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px 8px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }
        .recent-header i { font-size: 0.65rem; }
        .recent-group { margin-bottom: 8px; }
        .recent-label {
          display: block;
          padding: 4px 12px;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }
        .recent-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          color: rgba(255,255,255,0.6);
          font-size: 0.78rem;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recent-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.05); }
        .recent-item i { font-size: 0.7rem; opacity: 0.65; flex-shrink: 0; }
        .recent-item span { overflow: hidden; text-overflow: ellipsis; }
        .recent-empty {
          padding: 8px 12px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
        }

        /* ─── Footer ─── */
        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          transition: background 0.2s;
          cursor: pointer;
        }
        .admin-profile:hover { background: rgba(255,255,255,0.05); }

        .profile-avatar {
          position: relative;
          flex-shrink: 0;
        }
        .profile-avatar i { font-size: 1.5rem; color: rgba(255,255,255,0.6); }
        .profile-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid rgba(30,35,50,0.95);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: opacity 0.2s;
        }
        .profile-info.hidden { opacity: 0; width: 0; overflow: hidden; }

        .profile-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .profile-role {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .profile-chevron {
          margin-left: auto;
          font-size: 0.55rem;
          color: rgba(255,255,255,0.5);
          transition: transform 0.3s;
          flex-shrink: 0;
        }
        .profile-chevron.open { transform: rotate(180deg); }
        .profile-chevron.hidden { display: none; }

        /* User dropdown */
        .user-dropdown {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 10px;
          right: 10px;
          background: rgba(30,35,50,0.98);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.3);
          z-index: 20;
          animation: dropUp 0.2s ease;
        }
        @keyframes dropUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 12px;
        }
        .dropdown-header i { font-size: 1.8rem; color: rgba(255,255,255,0.5); }
        .dropdown-header div { display: flex; flex-direction: column; }
        .dropdown-name { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.85); }
        .dropdown-role { font-size: 0.7rem; color: rgba(255,255,255,0.55); }
        .dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
        }
        .dropdown-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .dropdown-item.logout:hover { color: #fca5a5; background: rgba(239,68,68,0.1); }
        .dropdown-item i { width: 18px; text-align: center; }

        .theme-toggle-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 8px;
        }
        .theme-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.10);
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          font-size: 0.75rem;
        }
        .theme-btn:hover { background: rgba(255,255,255,0.18); color: var(--accent, #d4af37); }
        .theme-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); transition: opacity 0.2s; }

        .view-site-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s;
        }
        .view-site-btn:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); }
        .view-site-btn i { font-size: 0.75rem; }

        /* ─── Main Content ─── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          min-height: 100vh;
        }
        .page-header { padding: 32px 40px 0; }
        .header-content { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .page-title { font-size: 1.65rem; font-weight: 700; color: var(--admin-heading, #1a1a2e); font-family: "DM Sans", sans-serif; margin: 0; }
        .page-subtitle { margin-top: 4px; color: var(--admin-muted, #6b7280); font-size: 0.9rem; }
        .page-body { padding: 24px 40px 40px; animation: fadeSlideIn 0.35s ease; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        /* ─── Shared Glass Styles ─── */
        :global(.glass-card) { background: rgba(255,255,255,0.65); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; transition: all 0.3s ease; }
        :global(.glass-card:hover) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        :global(.glass-table) { background: rgba(255,255,255,0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04); overflow: hidden; }
        :global(.glass-table table) { width: 100%; border-collapse: collapse; }
        :global(.glass-table th) { text-align: left; padding: 16px 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; font-family: "DM Sans", sans-serif; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.3); }
        :global(.glass-table td) { padding: 14px 20px; font-size: 0.9rem; border-bottom: 1px solid rgba(0,0,0,0.04); color: #1a1a2e; }
        :global(.glass-table tr:last-child td) { border-bottom: none; }
        :global(.glass-table tr:hover td) { background: rgba(255,255,255,0.3); }
        :global(.glass-btn) { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 12px; font-size: 0.9rem; font-weight: 600; font-family: "DM Sans", sans-serif; cursor: pointer; transition: all 0.2s ease; text-decoration: none; }
        :global(.glass-btn-primary) { background: linear-gradient(135deg, #d4af37, #f5d97a); color: #1a1a2e; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
        :global(.glass-btn-primary:hover) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212,175,55,0.4); }
        :global(.glass-btn-outline) { background: rgba(255,255,255,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.08); color: #1a1a2e; }
        :global(.glass-btn-outline:hover) { background: rgba(255,255,255,0.8); }

        :global(.glass-badge) { display: inline-flex; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        :global(.glass-badge-success) { background: rgba(22,163,74,0.12); color: #16a34a; }
        :global(.glass-badge-warning) { background: rgba(180,83,9,0.12); color: #b45309; }
        :global(.glass-badge-info) { background: rgba(29,78,216,0.1); color: #1d4ed8; }
        :global(.glass-badge-danger) { background: rgba(220,38,38,0.1); color: #dc2626; }
        :global(.glass-badge-neutral) { background: rgba(107,114,128,0.1); color: #6b7280; }

        :global(.glass-input) { padding: 10px 14px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; font-size: 0.9rem; font-family: "DM Sans", sans-serif; outline: none; transition: all 0.2s; background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); }
        :global(.glass-input:focus) { border-color: #d4af37; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); background: rgba(255,255,255,0.8); }
        :global(.glass-empty) { text-align: center; padding: 48px; color: #6b7280; }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .admin-sidebar { width: 64px; }
          .admin-sidebar:not(.collapsed) .brand-text { display: none; }
          .brand-text, .nav-label, .profile-info, .recent-section, .view-site-btn span { display: none; }
          .sidebar-brand { justify-content: center; padding: 16px 8px; }
          .nav-item { justify-content: center; padding: 10px 8px; }
          .page-header { padding: 24px 16px 0; }
          .page-body { padding: 16px; }
          .collapse-btn { display: none; }
        }
      `}</style>

      <style jsx global>{`
        [data-admin-theme="dark"] {
          --admin-bg: linear-gradient(135deg, #0f1117, #1a1d28);
          --admin-heading: #e2e8f0;
          --admin-muted: #94a3b8;
        }
        [data-admin-theme="dark"] .glass-card {
          background: rgba(30,35,50,0.75);
          border-color: rgba(255,255,255,0.06);
        }
        [data-admin-theme="dark"] .glass-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        [data-admin-theme="dark"] .glass-table {
          background: rgba(30,35,50,0.7);
          border-color: rgba(255,255,255,0.06);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.15);
        }
        [data-admin-theme="dark"] .glass-table th {
          color: rgba(255,255,255,0.45);
          border-bottom-color: rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.04);
        }
        [data-admin-theme="dark"] .glass-table td {
          color: rgba(255,255,255,0.7);
          border-bottom-color: rgba(255,255,255,0.04);
        }
        [data-admin-theme="dark"] .glass-table tr:hover td {
          background: rgba(255,255,255,0.05);
        }
        [data-admin-theme="dark"] .glass-input {
          background: rgba(30,35,50,0.6);
          border-color: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.8);
        }
        [data-admin-theme="dark"] .glass-input:focus {
          background: rgba(30,35,50,0.8);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }
        [data-admin-theme="dark"] .glass-empty {
          color: rgba(255,255,255,0.35);
        }
        [data-admin-theme="dark"] .glass-btn-outline {
          background: rgba(30,35,50,0.4);
          border-color: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
        [data-admin-theme="dark"] .glass-btn-outline:hover {
          background: rgba(30,35,50,0.6);
          color: rgba(255,255,255,0.9);
        }
        [data-admin-theme="dark"] .form-card h3 {
          color: rgba(255,255,255,0.85);
        }
        [data-admin-theme="dark"] .form-field label {
          color: rgba(255,255,255,0.5);
        }
        [data-admin-theme="dark"] .toolbar .bulk-bar {
          background: rgba(212,175,55,0.08);
        }
        [data-admin-theme="dark"] .bulk-count {
          color: rgba(255,255,255,0.7);
        }
        [data-admin-theme="dark"] .stat-label {
          color: rgba(255,255,255,0.5);
        }
        [data-admin-theme="dark"] .stat-value {
          color: rgba(255,255,255,0.9);
        }
        [data-admin-theme="dark"] .chart-card h3 {
          color: rgba(255,255,255,0.85);
        }
        [data-admin-theme="dark"] .activity-title {
          color: rgba(255,255,255,0.85);
        }
        [data-admin-theme="dark"] .activity-subtitle {
          color: rgba(255,255,255,0.4);
        }
        [data-admin-theme="dark"] .qa-btn {
          color: rgba(255,255,255,0.65);
          border-bottom-color: rgba(255,255,255,0.04);
          border-right-color: rgba(255,255,255,0.04);
        }
        [data-admin-theme="dark"] .qa-btn:hover {
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(245,217,122,0.05));
        }
        [data-admin-theme="dark"] .detail-header h3 {
          color: rgba(255,255,255,0.85);
        }
        [data-admin-theme="dark"] .detail-body p {
          color: rgba(255,255,255,0.7);
        }
        [data-admin-theme="dark"] .detail-email {
          color: rgba(255,255,255,0.4);
        }
        [data-admin-theme="dark"] .detail-footer span {
          color: rgba(255,255,255,0.4);
        }
        [data-admin-theme="dark"] .msg-preview {
          color: rgba(255,255,255,0.4);
        }
        [data-admin-theme="dark"] .icon-btn.view {
          background: rgba(107,114,128,0.15);
          color: rgba(255,255,255,0.5);
        }
        [data-admin-theme="dark"] .icon-btn.view:hover {
          background: rgba(107,114,128,0.25);
        }
        [data-admin-theme="dark"] .icon-btn.read {
          background: rgba(29,78,216,0.15);
          color: #60a5fa;
        }
        [data-admin-theme="dark"] .icon-btn.delete {
          background: rgba(220,38,38,0.15);
          color: #fca5a5;
        }
        [data-admin-theme="dark"] .icon-btn.edit {
          background: rgba(29,78,216,0.15);
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
}
