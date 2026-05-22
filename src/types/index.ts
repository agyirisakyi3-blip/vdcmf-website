import type { ApplicationType, ApplicationStatus } from "@/generated/prisma/enums";

export type { ApplicationType, ApplicationStatus };

// Navigation link with optional dropdown children
export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

// Global site configuration / contact info
export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

// Dashboard stat card data
export interface StatItem {
  value: string;
  label: string;
}

// Team member profile
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: { linkedin?: string; twitter?: string; email?: string };
}

// Program listing item
export interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
}

// Application form submission payload
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
