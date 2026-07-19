import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.edu.ge"),
  title: "Cyber Academy - Courses, Mentors & Partners",
  description:
    "Cyber Academy provides top-tier courses, talented mentors, partner programs, and an inspiring gallery. Learn, grow, and connect with experts in technology and digital skills.",

  keywords: [
    "Cyber Academy",
    "online courses",
    "mentors",
    "partners",
    "learning platform",
    "gallery",
    "technology education",
    "digital skills"
  ],
  authors: [{ name: "Cyber Academy", url: "https://academy.edu.ge/" }],
  openGraph: {
    title: "Cyber Academy - Courses, Mentors & Partners",
    description:
      "Cyber Academy provides top-tier courses, talented mentors, partner programs, and an inspiring gallery. Learn, grow, and connect with experts in technology and digital skills.",
    url: "https://academy.edu.ge/",
    siteName: "Cyber Academy",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Academy - Courses, Mentors & Partners",
    description:
      "Explore Cyber Academy’s courses, mentors, partners, and gallery content to enhance your skills and connect with industry experts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
