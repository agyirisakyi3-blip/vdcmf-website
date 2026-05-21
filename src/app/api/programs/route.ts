import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isPublic = !session;
    const where = isPublic ? { published: true } : {};

    const programs = await prisma.program.findMany({
      where,
      select: { id: true, title: true, slug: true, description: true, content: true, icon: true, image: true, published: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const res = NextResponse.json({ programs });
    if (isPublic) res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, content, icon, image, published } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, slug, description" },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: { title, slug, description, content, icon, image, published: published ?? true },
    });

    return NextResponse.json({ success: true, program }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
