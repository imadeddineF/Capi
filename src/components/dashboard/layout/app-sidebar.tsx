"use client";

import * as React from "react";
import { LayoutGrid, History, Workflow, Plus } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const data = {
  navMain: [
    {
      title: "My History",
      url: "#",
      icon: History,
      isActive: false,
      items: [
        {
          title: "Data analysis and dataset overview",
          url: "/chat?id=d4f6f32e-70c5-4a02-ae6d-f6727b494510",
          date: new Date(),
          type: "chat",
        },
        {
          title: "Customer Support Analysis",
          url: "/chat?id=a1b2c3d4-e5f6-7890-1234-567890abcdef",
          date: new Date(Date.now() - 86400000),
          type: "chat",
        },
        {
          title: "Sales Data Processing",
          url: "/chat?id=f9e8d7c6-b5a4-9382-7160-504938271605",
          date: new Date(Date.now() - 172800000),
          type: "chat",
        },
        {
          title: "Weekly Report Generation",
          url: "/chat?id=12345678-9abc-def0-1234-56789abcdef0",
          date: new Date(Date.now() - 604800000),
          type: "chat",
        },
        {
          title: "Team Meeting Notes Analysis",
          url: "/chat?id=abcdef01-2345-6789-abcd-ef0123456789",
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
            {
              title: "Support Ticket Analysis",
              url: "/chat?id=support-001",
            },
            {
              title: "Customer Feedback Review",
              url: "/chat?id=feedback-001",
            },
          ],
        },
        {
          name: "Data Analysis",
          chats: [
            {
              title: "Sales Report Q4",
              url: "/chat?id=sales-q4-001",
            },
            {
              title: "User Behavior Study",
              url: "/chat?id=behavior-001",
            },
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: "My files",
      url: "/chat/my-files",
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
  const router = useRouter();
  //   const [selectedTab, setSelectedTab] = React.useState<string | null>(null);
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

  const handleNewChat = () => {
    router.push(`/chat`);
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
        <Link href="/chat" className="flex items-end -space-x-1">
          <Image src={logoIcon} alt="logo" className="h-8" />
          {open && <Image src={logoText} alt="logo" className="h-7" />}
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <div className={`${open ? "px-4" : "px-2"} mb-4`}>
          <Button
            onClick={handleNewChat}
            className={`w-full gap-2 bg-white hover:bg-gray-50 text-gray-900 border ${
              !open ? "px-2" : ""
            }`}
            variant="outline"
            size={!open ? "icon" : "default"}
            title={!open ? "New Chat" : undefined}
          >
            {open ? (
              <>
                <Plus className="h-4 w-4" />
                New Chat
              </>
            ) : (
              <Plus className="h-4 w-4" />
            )}
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
