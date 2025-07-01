"use client";

import * as React from "react";
import {
  LayoutGrid,
  History,
  Workflow,
  Plus,
  Settings,
  ShieldEllipsisIcon,
} from "lucide-react";
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
import { getUrlParam } from "@/utils/url-params";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

interface HistoryItem {
  title: string;
  url: string;
  date: Date;
  type: string;
  isActive?: boolean;
}

const data = {
  navMain: [
    {
      title: "My History",
      url: "#",
      icon: History,
      isActive: true,
      items: [] as HistoryItem[],
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
      url: "/my-files",
      icon: LayoutGrid,
    },
    {
      name: "Marketplace",
      url: "/marketplace",
      icon: ShieldEllipsisIcon,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
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
  const [historyData, setHistoryData] = React.useState<HistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);

  // Load chat history from localStorage
  const loadChatHistory = React.useCallback(() => {
    if (typeof window === "undefined") return [];

    const history: HistoryItem[] = [];
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("chat_")) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const chat: Chat = JSON.parse(stored);
            const chatId = key.replace("chat_", "");

            history.push({
              title: chat.title || "Untitled Chat",
              url: `/chat?id=${chatId}`,
              date: new Date(chat.createdAt),
              type: "chat",
              isActive: chatId === currentChatId,
            });
          }
        } catch (error) {
          console.error("Error parsing chat data:", error);
        }
      }
    });

    // Sort by date (newest first)
    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [currentChatId]);

  // Get current chat ID from URL
  React.useEffect(() => {
    const id = getUrlParam("id");
    setCurrentChatId(id);
  }, []);

  // Listen for URL changes
  React.useEffect(() => {
    const handlePopState = () => {
      const id = getUrlParam("id");
      setCurrentChatId(id);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Load history when component mounts or currentChatId changes
  React.useEffect(() => {
    const history = loadChatHistory();
    setHistoryData(history);
  }, [loadChatHistory]);

  // Listen for storage changes to update history
  React.useEffect(() => {
    const handleStorageChange = () => {
      const history = loadChatHistory();
      setHistoryData(history);
    };

    const handleChatStorageChange = () => {
      const history = loadChatHistory();
      setHistoryData(history);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("chatStorageChanged", handleChatStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chatStorageChanged", handleChatStorageChange);
    };
  }, [loadChatHistory]);

  const handleDelete = (title: string) => {
    // Find the chat with this title and delete it from localStorage
    const chatToDelete = historyData.find((item) => item.title === title);
    if (chatToDelete) {
      const chatId = chatToDelete.url.split("=")[1];
      if (typeof window !== "undefined") {
        localStorage.removeItem(`chat_${chatId}`);
      }

      // Update history
      setHistoryData((prev) => prev.filter((item) => item.title !== title));

      // If we're currently viewing the deleted chat, redirect to new chat
      if (chatId === currentChatId) {
        router.push("/chat");
      }
    }
  };

  const handleRename = (oldTitle: string, newTitle: string) => {
    // Find the chat with this title and update it in localStorage
    const chatToRename = historyData.find((item) => item.title === oldTitle);
    if (chatToRename) {
      const chatId = chatToRename.url.split("=")[1];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`chat_${chatId}`);
        if (stored) {
          const chat: Chat = JSON.parse(stored);
          chat.title = newTitle;
          localStorage.setItem(`chat_${chatId}`, JSON.stringify(chat));
        }
      }

      // Update history
      setHistoryData((prev) =>
        prev.map((item) =>
          item.title === oldTitle ? { ...item, title: newTitle } : item
        )
      );
    }
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

      <SidebarContent className="pt-4 sidebar-toolbar">
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
          activeUrl={currentChatId ? `/chat?id=${currentChatId}` : undefined}
          onDeleteHistoryItem={handleDelete}
          onRenameHistoryItem={handleRename}
        />

        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
