import type { ApplicationType, ApplicationStatus } from "@/generated/prisma/enums";

export type { ApplicationType, ApplicationStatus };

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: { linkedin?: string; twitter?: string; email?: string };
}

export interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
}

export interface ApplicationFormData {
  type: ApplicationType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  programId?: string;
  organization?: string;
  message?: string;
}
