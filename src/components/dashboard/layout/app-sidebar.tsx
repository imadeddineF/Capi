"use client";

import * as React from "react";
import {
    Car,
    LayoutGrid,
    Settings2,
    History,
    Workflow,
    FileText,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
    SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

const data = {
    navMain: [
        {
            title: "My History",
            url: "#",
            icon: History,
            isActive: false,
            items: [
                {
                    title: "Customer Support Chat",
                    url: "#",
                    date: new Date(),
                    type: "chat",
                },
                {
                    title: "Project Analysis",
                    url: "#",
                    date: new Date(Date.now() - 86400000),
                    type: "document",
                },
                {
                    title: "Data Processing Workflow",
                    url: "#",
                    date: new Date(Date.now() - 172800000),
                    type: "workflow",
                },
                {
                    title: "Weekly Report",
                    url: "#",
                    date: new Date(Date.now() - 604800000),
                    type: "document",
                },
                {
                    title: "Team Meeting Notes",
                    url: "#",
                    date: new Date(Date.now() - 2592000000),
                    type: "chat",
                },
            ],
        },
        {
            title: "My Workflows",
            url: "#",
            icon: Workflow,
            isActive: false,
            workflows: [
                {
                    name: "Customer Service",
                    chats: [
                        { title: "Support Ticket #123", url: "#" },
                        { title: "Billing Inquiry", url: "#" },
                    ],
                },
                {
                    name: "Data Analysis",
                    chats: [
                        { title: "Sales Report Q4", url: "#" },
                        { title: "User Behavior Study", url: "#" },
                    ],
                },
            ],
        },
    ],
    projects: [
        {
            name: "My files",
            url: "/dashboard/my-files",
            icon: LayoutGrid,
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
    const [selectedTab, setSelectedTab] = React.useState<string | null>(null);
    const [historyData, setHistoryData] = React.useState(
        data.navMain[0].items || []
    );

    const handleDelete = (title: string) => {
        setHistoryData((prev) => prev.filter((item) => item.title !== title));
    };

    const handleRename = (oldTitle: string, newTitle: string) => {
        setHistoryData((prev) =>
            prev.map((item) =>
                item.title === oldTitle ? { ...item, title: newTitle } : item
            )
        );
    };

    // Update the navMain data with current history
    const updatedNavMain = React.useMemo(
        () => [
            {
                ...data.navMain[0],
                items: historyData,
            },
            data.navMain[1],
        ],
        [historyData]
    );

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader
                className={`border-b border-softligne ${
                    open ? "px-4" : "px-2"
                }`}
            >
                <Link href="/dashboard" className="flex items-center gap-3">
                    <Car className="h-8 w-8" />
                    {open && (
                        <span className="text-lg font-semibold">Railflow</span>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className="pt-4 sidebar-toolbar">
                <div className="px-4">
                    <Button className="w-full gap-2 bg-white" variant="outline">
                        <Plus className="h-4 w-4" />
                        New
                    </Button>
                </div>

                <NavMain
                    items={updatedNavMain}
                    onDeleteHistoryItem={handleDelete}
                    onRenameHistoryItem={handleRename}
                />

                <NavProjects projects={data.projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={testAdmin} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
