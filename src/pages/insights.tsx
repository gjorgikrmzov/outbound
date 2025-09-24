import { Lead } from "@/components/columns";
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
import { getInitials, NICHES } from "@/lib/utils";
import { Refresh2 } from "iconsax-reactjs";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function Insights() {
  const { data: session } = useSession();
  const name = session?.user?.name || "";
  const email = session?.user?.email || "";
  const initials = getInitials(name) || "A";
  const emailPrefix = email ? email.split("@")[0] : "user";

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

  const headerRight = (
    <>
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
    <DashboardLayout headerRight={headerRight} title="Insights">
      {loading ? (
        <div className="text-sm justify-center h-full items-center flex">
          <Refresh2 size={32} variant="TwoTone" className="animate-spin-ease" />
        </div>
      ) : (
        <div className="text-sm font-medium">Comming Soon!</div>
      )}
    </DashboardLayout>
  );
}
