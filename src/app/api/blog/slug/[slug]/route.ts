import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public — fetches a single blog post by its URL slug (used for public-facing pages)
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
