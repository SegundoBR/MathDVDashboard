"use client";

import { BackofficeShell } from "@/components/backoffice-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <BackofficeShell>{children}</BackofficeShell>;
}
