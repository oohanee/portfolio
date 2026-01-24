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