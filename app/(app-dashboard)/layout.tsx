import * as React from "react";
import PageShell from "@/components/layout/PageShell";
import { WalletConnectButton } from "@/components/profile/wallet/WalletConnectButton";

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      title="Dashboard"
      rightSlot={<WalletConnectButton />}
      showSearch
    >
      {children}
    </PageShell>
  );
}
