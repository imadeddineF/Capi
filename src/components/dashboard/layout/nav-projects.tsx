"use client";

import { type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	// useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

export function NavProjects({
	projects,
}: {
	projects: {
		name: string;
		url: string;
		icon: LucideIcon;
	}[];
}) {
	// const { isMobile } = useSidebar();
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name} className="h-10">
						<SidebarMenuButton
							asChild
							className={
								pathname === item.url
									? "bg-primary text-white hover:text-white hover:bg-primary" // Active tab styling
									: "" // Inactive tab styling
							}
						>
							<Link href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
