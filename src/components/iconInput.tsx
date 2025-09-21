// components/input-with-icon.tsx
"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> & {
  value: string;
  onChange: (v: string) => void; // fired AFTER debounce
  icon?: React.ReactNode;
  delay?: number;                // ms, default 300
};

function _InputWithIcon({
  value: initialValue,
  onChange,
  icon,
  className,
  delay = 300,
  ...props
}: Props) {
  // local input value for instant typing
  const [value, setValue] = React.useState(initialValue);

  // keep local value in sync when parent changes externally
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // debounce parent onChange calls
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (value !== initialValue) onChange(value);
    }, delay);
    return () => clearTimeout(t);
  }, [value, initialValue, onChange, delay]);

  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      )}
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(icon && "pl-9", className)}
        autoComplete="off"
      />
    </div>
  );
}

// Avoid re-render unless props actually change
export const InputWithIcon = React.memo(_InputWithIcon);
