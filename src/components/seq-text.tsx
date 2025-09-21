// components/sequence-text.tsx
"use client";

type SeqState = "needs_f1" | "needs_f2" | "done" | "unknown";

function normalizeSequence(v?: string | number): SeqState {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "0") return "needs_f1";                       // only initial sent → next: F1
  if (s === "1") return "needs_f2";                       // F1 sent → next: F2
  if (s === "2" || s === "done" || s === "completed") return "done"; // F2 sent
  return "unknown";
}

const LABEL: Record<SeqState, string> = {
  needs_f1: "Initial",
  needs_f2: "1st",
  done:     "2nd (Finished)",
  unknown:  "N/A",
};



export function SequenceText({ value }: { value?: string | number }) {
  const k = normalizeSequence(value);
  return <span className={``}>{LABEL[k]}</span>;
}
