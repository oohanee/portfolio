'use client'

import "./globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

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

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="author" content="Hanaanam Maliyyaa" />
        <meta name="description" content="Portfolio of Hanaanam Maliyyaa, a software engineer specializing in web development, mobile apps, data-driven projects, UI/UX design, and infrastructure. Explore selected projects and technical skills." />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://folio-showcase.vercel.app/building-for-web" />

        <meta name="keywords" content="software engineer portfolio, web developer portfolio, mobile developer portfolio, full stack developer, backend developer, frontend developer, UI UX, data projects" />

        <meta property="og:title" content="Hanaanam Maliyyaa | Software Engineer Portfolio" />
        <meta property="og:description" content="Explore projects by Hanaanam Maliyyaa: web development, mobile apps, data, UI/UX, and infrastructure." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://folio-showcase.vercel.app/" />
        {/* <meta property="og:image" content="https://folio-showcase.vercel.app/og-image.png" /> */}
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