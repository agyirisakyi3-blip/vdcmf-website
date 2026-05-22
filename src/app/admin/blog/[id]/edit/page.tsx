"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  // Guard: show nothing while session status resolves
  if (status === "loading") return null;

  // Guard: redirect unauthenticated users to login
  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  // Placeholder: edit UI not yet implemented, redirects to new post form
  alert(`Edit post ${params.id} — redirecting to new post form (edit API coming soon).`);
  router.push("/admin/blog/new");

  return null;
}
