"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Activity,
  ArrowLeft2,
  HomeHashtag,
  LogoutCurve,
} from "iconsax-reactjs";
import { signOut } from "next-auth/react";

export type NavItem = {
  label: string;
  href: string;
  icon: any;
  size?: number;
};

export function Sidebar({
  onClose,
  title = "AA / Outbound",
}: {
  onClose?: () => void;
  title?: string;
}) {
  const router = useRouter();
  const active = router.pathname;

  const NAV: NavItem[] = [
    { label: "Overview", href: "/", icon: HomeHashtag, size: 20 },
    { label: "Insights", href: "/insights", icon: Activity, size: 20 },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-background border-r">
      {/* Header */}
      <div className="flex items-center justify-between h-18 px-6">
        <h3 className="font-medium">{title}</h3>
        {onClose ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <ArrowLeft2 size={18} />
          </Button>
        ) : null}
      </div>

      <Separator />

      {/* Nav links */}
      <ScrollArea className="flex-1">
        <nav className="px-4 py-3 gap-y-1 flex flex-col">
          {NAV.map(({ label, href, icon: Icon, size = 20 }) => {
            const isActive = active === href;
            return (
              <Link key={href} href={href} className="group">
                <div
                  className={`w-full flex items-center gap-x-4 rounded-xl px-3 py-3 transition-all
                    ${isActive ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <Icon size={24} variant="Bulk" color="#292929" />
                  <span className="text-[15px] font-medium">{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Sign out pinned to bottom */}
      <div className="px-4 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="w-full cursor-pointer flex items-center gap-x-4 rounded-xl px-3 py-3 text-left transition-all hover:bg-accent"
        >
          <LogoutCurve size={24} variant="Bulk" color="#C73B3A" />
          <span className="text-[15px] font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}
