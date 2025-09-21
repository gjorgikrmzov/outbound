// components/kpis.tsx
"use client";
import { TrendChip } from "@/components/trend-chip";
import {
    Activity,
    Back,
    Box1,
    Graph,
    Like1,
    Profile2User,
    Sms
} from "iconsax-reactjs";
import * as React from "react";

type Lead = { [k: string]: string; status: string; has_replied: string };

function isTruthy(v?: string) {
  const s = String(v ?? "").toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

type Previous = {
  drafted?: number;
  sent?: number;
  replies?: number;
  interested?: number;
};

export function Kpis({
  leads,
  previous,
}: {
  leads: Lead[];
  previous?: Previous;
}) {
  const drafted = React.useMemo(
    () =>
      leads.filter((l) => (l.status || "").toLowerCase() === "new lead").length,
    [leads]
  );
  const sent = React.useMemo(
    () =>
      leads.filter((l) => (l.status || "").toLowerCase() === "contacted")
        .length,
    [leads]
  );
  const replies = React.useMemo(
    () => leads.filter((l) => isTruthy(l.has_replied)).length,
    [leads]
  );
  const interested = React.useMemo(
    () =>
      leads.filter((l) => (l.status || "").toLowerCase() === "interested")
        .length,
    [leads]
  );
  const replyRate = sent > 0 ? Math.round((replies / sent) * 100) : 0;
  const totalLeads = leads.length;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Initiation */}
      <CardSection title="Initiation">
        <ThreeUp>
          <Stat
            icon={<Box1 size={24} color="#292929" variant="Bulk" />}
            label="Total Leads"
            value={totalLeads}
            sublabel="All campaign leads"
          />
          <Stat
            icon={<Profile2User size={24} color="#292929" variant="Bulk" />}
            label="Drafted"
            value={drafted}
            trend={<TrendChip current={drafted} previous={previous?.drafted} />}
            sublabel="New Leads"
          />
          <Stat
            icon={<Sms size={24} color="#292929" variant="Bulk" />}
            label="Sent"
            value={sent}
            trend={<TrendChip current={sent} previous={previous?.sent} />}
            sublabel="Contacted"
          />
        </ThreeUp>
      </CardSection>

      {/* Engagement */}
      <CardSection title="Engagement">
        <ThreeUp>
          <Stat
            icon={<Back size={24} color="#292929" variant="Bulk" />}
            label="Replies"
            value={replies}
            trend={<TrendChip current={replies} previous={previous?.replies} />}
            sublabel="Total Replies"
          />
          <Stat
            icon={<Graph size={24} color="#292929" variant="Bulk" />}
            label="Reply Rate"
            value={`${replyRate}%`}
            // optional: trend for rate if you also compute previous rate
            sublabel="Replies / Sent"
          />
          <Stat
            icon={<Like1 size={24} color="#292929" variant="Bulk" />}
            label="Interested"
            value={interested}
            trend={
              <TrendChip current={interested} previous={previous?.interested} />
            }
            sublabel="Marked as Interested"
          />
        </ThreeUp>
      </CardSection>
    </div>
  );
}

/* ------- UI primitives (unchanged style except help→trend+sublabel) -------- */

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#ccc]/15 overflow-hidden">
      <div className="px-5 py-3.5 text-lg font-medium text-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function ThreeUp({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const count = items.length;

  return (
    <div
      className={`grid border rounded-xl bg-background`}
      style={{
        gridTemplateColumns: items
          .map(() => "1fr") // each child = 1fr
          .join(" auto "), // add "auto" spacer between each
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex py-5 flex-col items-center justify-center px-4">
            {item}
          </div>
          {i < count - 1 && (
            <span
              aria-hidden
              className="justify-self-center self-stretch w-px bg-border"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}


function Stat({
  icon,
  label,
  value,
  trend, // new
  sublabel, // was "help"
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  trend?: React.ReactNode;
  sublabel?: string;
}) {
  return (
    <div className="w-fit">
      <div className="text-md font-medium text-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-x-2">
        {icon ? <span className="text-foreground/80">{icon}</span> : null}
        <div className="text-2xl font-semibold">{value}</div>
        {trend ? <div className="ml-1">{trend}</div> : null}
      </div>
      {sublabel ? (
        <div className="mt-3 text-sm text-foreground/80 font-medium">
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}
