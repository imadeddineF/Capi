"use client";

import { DashboardNavbar } from "@/components/dashboard/layout/app-navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/layout/app-sidebar";
import { RightSidebarProvider } from "@/components/dashboard/chat/right-sidebar-context";
import { AuthChecker } from "@/components/auth/auth-checker";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <RightSidebarProvider>
          <AuthChecker />
          <AppSidebar className="z-50" />
          <main className="flex flex-col flex-1 w-full">
            <DashboardNavbar />
            <div className="flex-1 overflow-hidden">{children}</div>
          </main>
        </RightSidebarProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
}
