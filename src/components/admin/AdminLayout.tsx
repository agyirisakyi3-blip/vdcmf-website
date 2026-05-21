"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ToastProvider } from "./Toast";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-pie" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-alt" },
  { href: "/admin/programs", label: "Programs", icon: "fa-hand-holding-heart" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "fa-users" },
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

  if (status === "loading") {
    return (
      <div className="admin-loading">
        <div className="glass-spinner" />
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .glass-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(255,255,255,0.2);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
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
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <img src="/logo.svg" alt="VDCMF" className="brand-logo" />
          </div>
          <span className="brand-text">VDCMF</span>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-item ${pathname === link.href ? "active" : ""}`}
            >
              <div className="nav-icon-wrap">
                <i className={`fas ${link.icon}`} />
              </div>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-avatar">
              <i className="fas fa-user-circle" />
            </div>
            <div className="profile-info">
              <span className="profile-name">{session?.user?.name || session?.user?.email}</span>
              <span className="profile-role">Admin</span>
            </div>
          </div>
          <Link href="/" className="view-site-btn">
            <i className="fas fa-arrow-left" />
            <span>View Site</span>
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

        <div className="page-body">
          {children}
        </div>
      </main>
      </ToastProvider>

      <style jsx>{`
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
          font-family: "DM Sans", sans-serif;
        }

        /* ─── Sidebar ─── */
        .admin-sidebar {
          width: 260px;
          background: rgba(30, 35, 50, 0.85);
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
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 28px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .brand-logo-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          flex-shrink: 0;
        }

        .brand-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-text {
          font-size: 1.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: rgba(255,255,255,0.55);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          transform: translateX(0);
        }

        .nav-item:hover {
          transform: translateX(4px);
        }

        .nav-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .nav-item i {
          font-size: 0.95rem;
        }

        .nav-item:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
        }

        .nav-item:hover .nav-icon-wrap {
          background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(245, 217, 122, 0.1));
        }

        .nav-item.active .nav-icon-wrap {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          animation: pulseGlow 2s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5); }
        }

        .nav-item.active i {
          color: #fff;
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .profile-avatar i {
          font-size: 1.6rem;
          color: rgba(255,255,255,0.4);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .profile-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-site-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.2s;
        }

        .view-site-btn:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.05);
        }

        /* ─── Main Content ─── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          min-height: 100vh;
        }

        .page-header {
          padding: 32px 40px 0;
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .page-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #1a1a2e;
          font-family: "DM Sans", sans-serif;
          margin: 0;
        }

        .page-subtitle {
          margin-top: 4px;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .page-body {
          padding: 24px 40px 40px;
          animation: fadeSlideIn 0.35s ease;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── Shared Glass Card ─── */
        :global(.glass-card) {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        :global(.glass-card:hover) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }

        :global(.glass-table) {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        :global(.glass-table table) {
          width: 100%;
          border-collapse: collapse;
        }

        :global(.glass-table th) {
          text-align: left;
          padding: 16px 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          font-weight: 600;
          font-family: "DM Sans", sans-serif;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background: rgba(255,255,255,0.3);
        }

        :global(.glass-table td) {
          padding: 14px 20px;
          font-size: 0.9rem;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          color: #1a1a2e;
        }

        :global(.glass-table tr:last-child td) {
          border-bottom: none;
        }

        :global(.glass-table tr:hover td) {
          background: rgba(255,255,255,0.3);
        }

        :global(.glass-btn) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: "DM Sans", sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        :global(.glass-btn-primary) {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          color: #1a1a2e;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        :global(.glass-btn-primary:hover) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }

        :global(.glass-btn-outline) {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.08);
          color: #1a1a2e;
        }

        :global(.glass-btn-outline:hover) {
          background: rgba(255,255,255,0.8);
        }

        :global(.glass-badge) {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        :global(.glass-badge-success) {
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
        }

        :global(.glass-badge-warning) {
          background: rgba(180, 83, 9, 0.12);
          color: #b45309;
        }

        :global(.glass-badge-info) {
          background: rgba(29, 78, 216, 0.1);
          color: #1d4ed8;
        }

        :global(.glass-badge-danger) {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        :global(.glass-badge-neutral) {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }

        :global(.glass-input) {
          padding: 10px 14px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: "DM Sans", sans-serif;
          outline: none;
          transition: all 0.2s;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
        }

        :global(.glass-input:focus) {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
          background: rgba(255,255,255,0.8);
        }

        :global(.glass-empty) {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 64px;
          }
          .brand-text,
          .nav-label,
          .profile-info,
          .view-site-btn span {
            display: none;
          }
          .sidebar-brand {
            justify-content: center;
            padding: 20px 8px;
          }
          .nav-item {
            justify-content: center;
            padding: 12px 8px;
          }
          .page-header {
            padding: 24px 16px 0;
          }
          .page-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
