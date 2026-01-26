"use client";

import * as React from "react";
import AppTopbar from "@/components/layout/AppTopbar";
import AppSidebar  from "@/components/layout/AppSidebar";

import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

type PageShellProps = {
  children: React.ReactNode;
  title?: string;
  rightSlot?: React.ReactNode; // inject chain toggles, WalletConnectButton, etc.
  showSearch?: boolean;
};

export default function PageShell({
  children,
  rightSlot,
  showSearch = true,

}: PageShellProps) {
    

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset>
        <AppTopbar
          rightSlot={rightSlot}
          showSearch={showSearch}
        />

        <main className="w-full px-6 py-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
