import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: ["error"],
} as any);

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create admin user
  const adminEmail = "admin@vdcmf.org";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: "VDMCF Admin",
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("  ✅ Admin user created: admin@vdcmf.org / admin123");
  } else {
    console.log("  ⏭️  Admin user already exists");
  }

  // 2. Create programs
  const programs = [
    {
      title: "Education",
      slug: "education",
      description:
        "Providing access to quality education for underprivileged children through scholarships, learning resources, and school support programs across Ghana.",
      icon: "fa-graduation-cap",
    },
    {
      title: "Vocational Training",
      slug: "vocational-training",
      description:
        "Equipping youth and adults with practical skills in trades like tailoring, carpentry, and IT for economic independence and self-reliance.",
      icon: "fa-tools",
    },
    {
      title: "Health Outreach",
      slug: "health-outreach",
      description:
        "Promoting health and wellness through medical assistance, health screenings, and wellness education programs in rural communities.",
      icon: "fa-stethoscope",
    },
    {
      title: "Community Development",
      slug: "community-development",
      description:
        "Building stronger communities through advocacy, food security initiatives, and women empowerment programs across Ghana.",
      icon: "fa-hands-helping",
    },
  ];

  for (const program of programs) {
    const existing = await prisma.program.findUnique({
      where: { slug: program.slug },
    });

    if (!existing) {
      await prisma.program.create({ data: program });
      console.log(`  ✅ Program created: ${program.title}`);
    } else {
      console.log(`  ⏭️  Program already exists: ${program.title}`);
    }
  }

  // 3. Create site settings
  const settings: { key: string; value: string }[] = [
    { key: "organization_name", value: "Vision De Melbee Care Foundation" },
    { key: "organization_short_name", value: "VDMCF" },
    { key: "organization_tagline", value: "Restoring Dignity. Empowering Generations." },
    { key: "organization_email", value: "info@vdcmf.org" },
    { key: "organization_phone", value: "[Your Phone Number]" },
    { key: "organization_address", value: "[Your Address], Ghana" },
    { key: "organization_whatsapp", value: "[Your WhatsApp Number]" },
    { key: "social_facebook", value: "https://facebook.com/vdcmf" },
    { key: "social_twitter", value: "https://twitter.com/vdcmf" },
    { key: "social_instagram", value: "https://instagram.com/vdcmf" },
    { key: "social_linkedin", value: "https://linkedin.com/company/vdcmf" },
    { key: "social_youtube", value: "https://youtube.com/@vdcmf" },
    { key: "stats_lives_impacted", value: "5800" },
    { key: "stats_programs", value: "45" },
    { key: "stats_volunteers", value: "127" },
    { key: "stats_years", value: "12" },
    { key: "bank_name", value: "[Bank Name]" },
    { key: "bank_account_number", value: "0000000000" },
    { key: "bank_account_name", value: "Vision De Melbee Care Foundation" },
    { key: "mobile_money_network", value: "MTN" },
    { key: "mobile_money_number", value: "+233 XX XXX XXXX" },
    { key: "paypal_email", value: "donate@vdcmf.org" },
  ];

  for (const setting of settings) {
    const existing = await prisma.siteSetting.findUnique({
      where: { key: setting.key },
    });

    if (!existing) {
      await prisma.siteSetting.create({ data: setting });
      console.log(`  ✅ Setting created: ${setting.key}`);
    }
  }

  console.log("\n🎉 Seed complete!");
  console.log("   Admin login: admin@vdcmf.org / admin123");
  console.log("   Change the password after first login.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
