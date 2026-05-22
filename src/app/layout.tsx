import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// Load DM Sans font (body text) with CSS variable
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Load Playfair Display font (headings) with CSS variable
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Root metadata with template-based title and SEO keywords
export const metadata: Metadata = {
  title: {
    template: "%s | VDMCF",
    default: "Vision De Melbee Care Foundation (VDMCF) | NGO in Ghana",
  },
  description:
    "Vision De Melbee Care Foundation (VDMCF) is a Ghanaian non-profit humanitarian organization restoring dignity through education, health, and community development.",
  keywords: [
    "VDMCF",
    "Vision De Melbee Care Foundation",
    "Ghana NGO",
    "humanitarian organization Ghana",
    "nonprofit Ghana",
    "education Ghana",
    "community development",
  ],
  openGraph: {
    type: "website",
    siteName: "Vision De Melbee Care Foundation",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vision De Melbee Care Foundation",
    description:
      "Ghanaian non-profit restoring dignity through education, health, and community development.",
  },
};

// Root layout wrapping all pages with fonts and global head links
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
