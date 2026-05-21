"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  alert(`Edit post ${params.id} — redirecting to new post form (edit API coming soon).`);
  router.push("/admin/blog/new");

  return null;
}
