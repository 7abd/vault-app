"use client";

import "./globals.css";
import SideBar from "./components/sideBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { AuthProvider } from "@/lib/supabase/context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <html lang="en">
      <AuthProvider>
      <body className="flex h-screen relative">

        <aside className="hidden sm:block w-64 bg-[#121212]">
          <SideBar />
        </aside>

        <button
          className="sm:hidden absolute top-4 left-4 z-30 text-white"
          onClick={() => setMobileOpen(true)}
        >
          <Bars3Icon className="w-8 h-8" />
        </button>

        {mobileOpen && (
          <div 
            className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        <aside
          className={`
            sm:hidden fixed top-0 left-0 h-full w-64 bg-[#121212] z-30 transform 
            transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <SideBar />
        </aside>

        <main className="flex-1">{children}</main>
      </body>
      </AuthProvider>
    </html>
  );
}
