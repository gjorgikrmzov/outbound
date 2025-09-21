"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { CloseCircle, MinusCirlce, TickCircle } from "iconsax-reactjs";
import { StatusBadge } from "./ui/status-badge";
import { SequenceText } from "./seq-text";
import { EmailCell } from "./email-cell";

export interface Lead {
  [key: string]: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  website: string;
  status: string;
  has_replied: string;
  sequence: string;
}

// helpers
const getInitials = (first?: string, last?: string, fallback?: string) => {
  const a = (first || "").trim();
  const b = (last || "").trim();
  if (a || b) return `${a?.[0] ?? ""}${b?.[0] ?? ""}`.toUpperCase() || "?";
  return (fallback?.[0] ?? "?").toUpperCase();
};

const normalizeUrl = (url?: string) => {
  if (!url) return "";
  const hasProto = /^https?:\/\//i.test(url);
  return hasProto ? url : `https://${url}`;
};

const hostFromUrl = (url?: string) => {
  if (!url) return "";
  try {
    const u = new URL(normalizeUrl(url));
    return u.host;
  } catch {
    return url;
  }
};

export const columns: ColumnDef<Lead>[] = [
  // Name column with avatar + full name + website under
  {
    id: "lead",
    header: "Name",
    cell: ({ row }) => {
      const lead = row.original;
      const name =
        `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim() || "Unknown";
      const initials = getInitials(
        lead.first_name,
        lead.last_name,
        lead.company || lead.email
      );
      const siteUrl = normalizeUrl(lead.website);
      const siteHost = hostFromUrl(lead.website);

      return (
        <div className="flex gap-3  items-center">
          <Avatar className="h-9 w-9">
            {/* If you ever have profile pics, pass src here */}
            <AvatarImage src={""} alt={name} />
            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="font-medium leading-none text-foreground">
              {name}
            </div>
            {siteHost ? (
              <a
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                {siteHost}
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      );
    },
  },

  // keep the rest (email, company, status, sequence)
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <EmailCell email={row.original.email} />,
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "has_replied",
    header: "Replied",
    cell: ({ row }) => {
      const v = String(row.original.has_replied ?? "").toLowerCase();
      const yes = v === "true" || v === "yes" || v === "1";
      return yes ? (
        <TickCircle size={20} color="#3F9065" variant="Bulk" />
      ) : (
        <MinusCirlce size={20} color="#C73B3A" variant="Bulk" />
      );
    },
    // make filtering robust to true/false/yes/no/1/0
    filterFn: (row, id, value) => {
      if (!value) return true; // not filtering
      const v = String(row.getValue(id) ?? "").toLowerCase();
      const yes = v === "true" || v === "yes" || v === "1";
      return value === "true" ? yes : !yes;
    },
  },
  {
    accessorKey: "sequence",
    header: "Sequence",
    cell: ({ row }) => <SequenceText value={row.original.sequence} />,
  },
];
