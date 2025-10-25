"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-auto pt-4 border-t border-border transition-all duration-200">
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={`transition-all duration-200 ${
                  !open ? "h-8 w-8 p-2" : ""
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <a href={item.url} className={`flex items-center gap-2 ${open ? "min-w-0" : "justify-center w-full"}`}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {open && <span className="font-medium truncate animate-in fade-in slide-in-from-left-1 duration-200">{item.name}</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
