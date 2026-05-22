import { prisma } from "./prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";

type StatusValue = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

// Defines which status transitions are valid for applications.
// Once ACCEPTED or REJECTED, no further changes are allowed.
const ALLOWED_TRANSITIONS: Record<StatusValue, StatusValue[]> = {
  PENDING: ["REVIEWED", "REJECTED"],
  REVIEWED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

export function isValidTransition(from: StatusValue, to: StatusValue): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// Updates an application's status only if the transition is valid,
// and records the change in the activity log for audit/history.
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: StatusValue,
  userId?: string
) {
  const current = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, status: true, firstName: true, lastName: true, type: true },
  });

  if (!current) {
    throw new Error("Application not found");
  }

  const oldStatus = current.status as StatusValue;

  if (oldStatus === newStatus) {
    throw new Error(`Application is already ${newStatus}`);
  }

  if (!isValidTransition(oldStatus, newStatus)) {
    throw new Error(
      `Cannot transition from ${oldStatus} to ${newStatus}. Allowed: ${ALLOWED_TRANSITIONS[oldStatus].join(", ") || "none"}`
    );
  }

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status: newStatus },
  });

  // Log every status change so the dashboard can display a live activity feed
  await prisma.activityLog.create({
    data: {
      entity: "application",
      entityId: applicationId,
      action: "status_change",
      summary: `${current.firstName} ${current.lastName} — ${current.type}: ${oldStatus} → ${newStatus}`,
      metadata: JSON.stringify({ oldStatus, newStatus, type: current.type }),
      userId,
    },
  });

  return application;
}
