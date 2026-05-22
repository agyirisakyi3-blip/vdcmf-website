"use client";

import { SessionProvider } from "next-auth/react";

// Wraps all admin pages in next-auth SessionProvider for auth state
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
