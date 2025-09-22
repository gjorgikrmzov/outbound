"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Element3 } from "iconsax-reactjs";
import { PropsWithChildren, useState } from "react";
import { Separator } from "../ui/separator";

export function DashboardLayout({
  headerRight,
  title = "Dashboard",
  children,
}: PropsWithChildren<{
  headerRight?: React.ReactNode; // put search+avatar here
  title?: string;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-background text-foreground">
      <div className="flex h-full">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex md:w-[260px] shrink-0">
          <Sidebar />
        </aside>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[84%] max-w-[300px] bg-card border-r shadow-xl">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 h-full overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 h-18 bg-background">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Element3 size={20} />
              </Button>
              <h3 className="text-foreground/90 font-medium">{title}</h3>
            </div>
            <div className="flex items-center gap-3">{headerRight}</div>
          </div>

          <Separator />

          <div className="h-[calc(100%-64px)] sm:h-[calc(100%-72px)] overflow-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
