"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Invariant. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="https://x.com" target="_blank" className="text-muted-foreground hover:text-foreground">
            X
          </Link>
        </div>
      </div>
    </footer>
  );
}
