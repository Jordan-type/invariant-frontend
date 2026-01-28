import * as React from "react";
import NonDashboardNavbar from "@/components/layout/NonDashboardNavbar";
import Footer from "@/components/footer/Footer";

export default function NonDashboardLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NonDashboardNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
