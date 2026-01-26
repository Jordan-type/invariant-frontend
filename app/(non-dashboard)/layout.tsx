import * as React from "react";

export default function NonDashboardLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
