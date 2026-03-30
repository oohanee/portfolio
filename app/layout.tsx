'use client'

import "./globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hanaanam Maliyyaa | Software Engineer Portfolio",
  
  description:
    "Portfolio of Hanaanam Maliyyaa, a software engineer specializing in web development, mobile apps, data-driven projects, UI/UX design, and infrastructure.",

  keywords: [
    "software engineer portfolio",
    "full stack developer",
    "web developer",
    "mobile developer",
    "frontend developer",
    "backend developer",
    "UI UX",
    "data projects",
    "portfolio",
  ],

  authors: [{ name: "Hanaanam Maliyyaa" }],

  alternates: {
    canonical: "https://folio-showcase.vercel.app/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Hanaanam Maliyyaa | Software Engineer Portfolio",
    description:
      "Explore projects by Hanaanam Maliyyaa: web development, mobile apps, data, UI/UX, and infrastructure.",
    url: "https://folio-showcase.vercel.app/",
    siteName: "Hana's Portfolio",
    type: "website",
  },

  metadataBase: new URL("https://folio-showcase.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="WVc_dhMyax5ltcQRwrSeX1_U4CF6QzrA2VSu_iblW4Y" />
        <title>Hana&#39;s Portfolio</title>
      </head>
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Overlay untuk mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar */}
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}