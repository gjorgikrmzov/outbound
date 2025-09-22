"use client";
import type { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { columns, type Lead } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { InputWithIcon } from "@/components/iconInput";
import { Kpis } from "@/components/kpis";
import { DashboardLayout } from "@/components/layout/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { Refresh2, SearchNormal1 } from "iconsax-reactjs";

const NICHES = [
  { label: "Content Marketing", gid: "0" },
  { label: "Paid Ads", gid: "994785354" },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = await getToken({
    req: ctx.req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    const callbackUrl = encodeURIComponent(ctx.resolvedUrl || "/");
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default function Page() {
  const { data: session } = useSession();
  const [q, setQ] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGid, setSelectedGid] = useState<string>(NICHES[0].gid);

  const fetchLeads = useCallback(async (gid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?gid=${gid}&ts=${Date.now()}`, {
        cache: "no-store",
      });
      const { leads } = await res.json();
      setLeads(leads);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(selectedGid);
  }, [fetchLeads, selectedGid]);

  const name = session?.user?.name || "";
  const email = session?.user?.email || "";
  const initials = getInitials(name, email);
  const emailPrefix = email ? email.split("@")[0] : "";

  const headerRight = (
    <>
      {/* Search */}
      <InputWithIcon
        value={q}
        onChange={(e: any) => setQ(typeof e === "string" ? e : e.target.value)}
        placeholder="Search name, email, company…"
        className="w-[260px]"
        icon={<SearchNormal1 variant="Linear" size={15} color="#292929" />}
      />

      {/* Niche select (same state 'gid') */}
      <div className="flex items-center gap-2">
        <Select
          value={selectedGid}
          onValueChange={(value) => setSelectedGid(value)}
        >
          <SelectTrigger className="h-9 w-[200px] sm:w-[220px]">
            <SelectValue placeholder="Select Niche" />
          </SelectTrigger>
          <SelectContent>
            {NICHES.map((n) => (
              <SelectItem key={n.gid} value={n.gid}>
                {n.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Refresh with loading indicator */}
        <Button
          variant="ghost"
          size="default"
          onClick={() => fetchLeads(selectedGid)}
          disabled={loading}
          className="gap-2"
        >
          <Refresh2
            variant="Bulk"
            size={16}
            className={loading ? "animate-spin-ease" : ""}
          />
          {loading ? "Loading…" : "Refresh"}
        </Button>
      </div>

      {/* User */}
      {session?.user ? (
        <div className="flex items-center gap-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={""} alt={name} />
            <AvatarFallback className="text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-foreground text-[15px] font-medium">
              {name || initials}
            </p>
            <p className="leading-3 text-foreground/80 text-xs font-medium">
              {emailPrefix}@
            </p>
          </div>
        </div>
      ) : null}
    </>
  );

  return (
    <DashboardLayout headerRight={headerRight} title="Dashboard">
      {loading ? (
        <div className="text-sm justify-center h-full items-center flex">
          <Refresh2 size={32} variant="TwoTone" className="animate-spin-ease" />
        </div>
      ) : (
        <>
          <Kpis leads={leads} />
          <DataTable
            columns={columns}
            data={leads}
            globalFilter={q}
            onGlobalFilterChange={setQ}
          />
        </>
      )}
    </DashboardLayout>
  );
}
