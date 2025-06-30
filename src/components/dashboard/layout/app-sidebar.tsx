"use client";

import * as React from "react";
import { Car, LayoutGrid, History, Workflow, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import logo from "../../../../public/logo.svg";
import logoIcon from "../../../../public/logo-icon.svg";
import logoText from "../../../../public/logo-text.svg";
import Image from "next/image";

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
    profilePic: "/placeholder.svg?height=32&width=32",
    status: "active",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open, state } = useSidebar();
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

    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader
                className={`border-b h-14 border-border ${
                    open ? "px-4" : "px-2"
                } flex items-start`}
            >
                <Link href="/dashboard" className="flex items-end">
                    <Image src={logoIcon} alt="logo" className="h-8" />
                    {open && (
                        <Image src={logoText} alt="logo" className="h-7" />
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className="pt-4">
                <div className={`${open ? "px-4" : "px-2"} mb-4`}>
                    <Button
                        className={`w-full gap-2 bg-white hover:bg-gray-50 text-gray-900 border ${
                            !open ? "px-2" : ""
                        }`}
                        variant="outline"
                        size={!open ? "icon" : "default"}
                    >
                        <Plus className="h-4 w-4" />
                        {open && "New"}
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
