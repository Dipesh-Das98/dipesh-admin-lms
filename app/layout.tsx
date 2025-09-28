/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import QueryProvider from "@/components/provider/query-provider";
import ToastProvider from "@/components/provider/toast-provider";
import NextAuthSessionProvider from "@/components/provider/session-provider";
import { ModalProvider } from "@/components/provider/modal-provider";
import { SheetProvider } from "@/components/provider/sheet-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LMS Admin Panel",
    template: "%s | LMS Admin Panel",
  },
  description:
    "A comprehensive Learning Management System admin panel for managing courses, students, instructors, and educational content.",
  keywords: [
    "LMS",
    "Learning Management System",
    "Admin Panel",
    "Education",
    "E-learning",
    "Dashboard",
  ],
  authors: [{ name: "LMS Team" }],
  creator: "LMS Team",
  publisher: "LMS",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "LMS Admin Panel",
    description:
      "A comprehensive Learning Management System admin panel for managing courses, students, instructors, and educational content.",
    siteName: "LMS Admin Panel",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LMS Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LMS Admin Panel",
    description:
      "A comprehensive Learning Management System admin panel for managing courses, students, instructors, and educational content.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: false, // Admin panel should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
        {/* rest of your scripts go under */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <ToastProvider />
              <ModalProvider />
              <SheetProvider />
              {children}
            </QueryProvider>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
