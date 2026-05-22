import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Protected — creates a new blog post (admin only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, excerpt, coverImage, category, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        published: published ?? false,
        authorId: (session.user as unknown as { id: string }).id,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Public — returns published posts; if authenticated, returns all posts
// Paginated at 50 posts per request to keep response sizes bounded
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(0, parseInt(searchParams.get("skip") || "0"));
    const take = Math.min(100, Math.max(1, parseInt(searchParams.get("take") || "50")));

    const session = await getServerSession(authOptions);
    const isPublic = !session;
    const where = isPublic ? { published: true } : {};

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, published: true, createdAt: true, author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const res = NextResponse.json({ posts, total, skip, take });
    if (isPublic) res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
