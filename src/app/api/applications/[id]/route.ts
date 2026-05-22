import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateApplicationStatus } from "@/lib/workflow";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { program: { select: { title: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Logs the deletion before removing the record so the activity
// feed still captures what was deleted and by whom.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, type: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.activityLog.create({
      data: {
        entity: "application",
        entityId: id,
        action: "deleted",
        summary: `${application.firstName} ${application.lastName} — ${application.type} application deleted`,
        metadata: JSON.stringify({ type: application.type }),
        userId: (session.user as unknown as { id: string }).id,
      },
    });

    await prisma.application.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Delegates to the workflow service which validates the status
// transition and logs the change. Returns a clear error if the
// transition is not allowed (e.g. ACCEPTED → PENDING).
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Missing required field: status" },
        { status: 400 }
      );
    }

    const userId = (session.user as unknown as { id: string }).id;
    const application = await updateApplicationStatus(id, status, userId);

    return NextResponse.json({ application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
