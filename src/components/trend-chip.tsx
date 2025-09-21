// components/trend-chip.tsx
"use client";
import { TrendUp, TrendDown, MinusCirlce } from "iconsax-reactjs";

export function TrendChip({ current, previous }: { current?: number; previous?: number }) {
  if (previous == null || current == null) return null;

  if (previous === 0 && current === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <MinusCirlce size={16} /> 0%
      </span>
    );
  }

  if (previous === 0) {
    // everything is up from 0
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <TrendUp size={16} /> ∞%
      </span>
    );
  }

  const delta = current - previous;
  const pct = Math.round((Math.abs(delta) / previous) * 100);

  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <TrendUp size={16} /> {pct}%
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-rose-600">
        <TrendDown size={16} /> {pct}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <MinusCirlce size={16} /> 0%
    </span>
  );
}
