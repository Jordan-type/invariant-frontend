"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: number; // px
  label?: string;
};

export function Spinner({ className, size = 18, label = "Loading" }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={label} role="status">
      <Loader2 className="animate-spin" style={{ width: size, height: size }} />
    </span>
  );
}
