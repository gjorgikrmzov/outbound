// StatusBadge.tsx
"use client";
import { Badge } from "@/components/ui/badge";

type KnownStatus =
  | "new lead"
  | "contacted"
  | "interested"
  | "removed"
  | "out of office";

const STATUS_STYLES: Record<
  KnownStatus,
  { bg: string; text: string; label: string }
> = {
  "out of office": {
    bg: "bg-[#292929]/10",
    text: "text-[#292929]",
    label: "Out of Office",
  },
  contacted: {
    bg: "bg-[#4F89C6]/10",
    text: "text-[#4F89C6]",
    label: "Contacted",
  },
  removed: { bg: "bg-[#C73B3A]/10", text: "text-[#C73B3A]", label: "Removed" },
  interested: {
    bg: "bg-[#3F9065]/10",
    text: "text-[#3F9065]",
    label: "Interested",
  },
  "new lead": {
    bg: "bg-[#5e27f6]/10",
    text: "text-[#5e27f6]",
    label: "New Lead",
  }, // (spelled)
};

export function StatusBadge({ value }: { value?: string }) {
  const k = (value ?? "").trim().toLowerCase() as KnownStatus;
  const style = STATUS_STYLES[k];
  if (!style) {
    return (
      <Badge variant="secondary" className="rounded-full">
        —
      </Badge>
    );
  }
  return (
    <Badge
      className={[
        "rounded-full font-medium",
        style.bg, // bg with /10 opacity
        style.text, // solid text color
        "border-0", // optional: no border
      ].join(" ")}
    >
      {style.label}
    </Badge>
  );
}
