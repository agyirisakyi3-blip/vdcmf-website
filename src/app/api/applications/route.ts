import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, firstName, lastName, email, phone, programId, organization, message } = body;

    if (!type || !firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, firstName, lastName, email" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: { type, firstName, lastName, email, phone, programId, organization, message },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      select: { id: true, type: true, status: true, firstName: true, lastName: true, email: true, phone: true, programId: true, organization: true, message: true, createdAt: true, program: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ applications });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
