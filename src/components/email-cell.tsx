// in the same file (columns.tsx) or a separate component file
import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function EmailCell({ email }: { email?: string }) {
  const [copied, setCopied] = React.useState(false);

  if (!email) return <span className="text-muted-foreground">N/A</span>;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onCopy}
            className="text-left   cursor-pointer focus:outline-none"
            aria-label="Copy email to clipboard"
          >
            {email}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span>{copied ? "Copied!" : "Click to copy"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
