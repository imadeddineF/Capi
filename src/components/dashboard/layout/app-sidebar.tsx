"use client";

import * as React from "react";
import { Car, LayoutGrid, Settings2 } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
    useSidebar,
    SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
// import Image from "next/image";

const data = {
    navMain: [
        {
            title: "Getting Started",
            url: "#",
            items: [
                {
                    title: "Installation",
                    url: "#",
                },
                {
                    title: "Project Structure",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Overview",
            url: "/dashboard",
            icon: LayoutGrid,
        },
        {
            name: "Settings",
            url: "/dashboard/settings",
            icon: Settings2,
        },
    ],
};

const testAdmin = {
    id: "admin123",
    email: "admin@example.com",
    phone: "+1234567890",
    firstName: "John",
    lastName: "Doe",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: "en",
    profilePic: "/avatar.png",
    status: "active",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader
                className={`!flex justify-between border-b border-softligne ${
                    open ? "items-start ml-2" : "items-center"
                }`}
            >
                <Link href="/dashboard">
                    {open ? (
                        <div className="flex items-center gap-3">
                            {/* <Image src={logo} alt="logo" width={40} height={40} /> */}
                            <Car width={40} height={40} />
                            <span className="font-bold text-xl">Railflow</span>
                        </div>
                    ) : (
                        // <Image src={logo} alt="logo" width={30} height={30} />
                        <Car width={40} height={40} />
                    )}
                </Link>
            </SidebarHeader>
            <SidebarContent className="pt-4">
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                {/* <SettingsNav items={data.settingsNav} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={testAdmin} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
