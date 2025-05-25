"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Loader({ className, size = 48, text }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-8", className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
