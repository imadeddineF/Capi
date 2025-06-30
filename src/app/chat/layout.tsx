"use client";

import { DashboardNavbar } from "@/components/dashboard/layout/app-navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/layout/app-sidebar";

export default function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<TooltipProvider delayDuration={0}>
			<SidebarProvider>
				<AppSidebar className="z-50" />
				<main className="flex flex-col flex-1 w-full">
					<DashboardNavbar />
					<div className="flex-1 overflow-y-auto p-6">{children}</div>
				</main>
			</SidebarProvider>
		</TooltipProvider>
	);
}