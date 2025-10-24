"use client";

import * as React from "react";

import {
  ChevronRight,
  Search,
  MoreVertical,
  Pin,
  Edit3,
  Trash2,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface HistoryItem {
  title: string;
  url: string;
  date: Date;
  type: string;
  isActive?: boolean;
}

interface WorkflowChat {
  title: string;
  url: string;
  isActive?: boolean;
}

interface Workflow {
  name: string;
  chats: WorkflowChat[];
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: HistoryItem[];
  workflows?: Workflow[];
}

interface NavMainProps {
  items: NavItem[];
  activeUrl?: string;
  onDeleteHistoryItem?: (title: string) => void;
  onRenameHistoryItem?: (oldTitle: string, newTitle: string) => void;
}

export function NavMain({
  items,
  activeUrl,
  onDeleteHistoryItem,
  onRenameHistoryItem,
}: NavMainProps) {
  const { open } = useSidebar();
  const router = useRouter();
  const [searchQueries, setSearchQueries] = React.useState<
    Record<string, string>
  >({});
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});

  // const handleNewChat = () => {
  //   const newChatId = uuidv4();
  //   router.push(`/chat?id=${newChatId}`);
  // };

  const groupHistoryByDate = (items: HistoryItem[]) => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    const weekAgo = new Date(now.getTime() - 604800000);
    const monthAgo = new Date(now.getTime() - 2592000000);

    const groups = {
      today: [] as HistoryItem[],
      yesterday: [] as HistoryItem[],
      week: [] as HistoryItem[],
      month: [] as HistoryItem[],
      older: [] as HistoryItem[],
    };

    items.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate.toDateString() === now.toDateString()) {
        groups.today.push(item);
      } else if (itemDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(item);
      } else if (itemDate > weekAgo) {
        groups.week.push(item);
      } else if (itemDate > monthAgo) {
        groups.month.push(item);
      } else {
        groups.older.push(item);
      }
    });

    return groups;
  };

  const handleSearch = (itemTitle: string, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [itemTitle]: query }));
  };

  const handleRename = (oldTitle: string) => {
    const newTitle = prompt("Enter new title:", oldTitle);
    if (newTitle && onRenameHistoryItem) {
      onRenameHistoryItem(oldTitle, newTitle);
    }
  };

  const toggleSection = (itemTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  const isItemActive = (itemUrl: string) => {
    return activeUrl === itemUrl;
  };

  const renderHistoryItems = (item: NavItem) => {
    if (!item.items || !open) return null;

    const searchQuery = searchQueries[item.title] || "";
    const groupedHistory = groupHistoryByDate(item.items);

    return (
      <div className="space-y-2 px-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => handleSearch(item.title, e.target.value)}
            className="pl-9 border-none bg-transparent focus-visible:border-0 focus-visible:ring-0 ring-0"
          />
        </div>

        <div className="space-y-2">
          {Object.entries(groupedHistory).map(([key, historyItems]) => {
            if (historyItems.length === 0) return null;

            const groupTitle =
              {
                today: "Today",
                yesterday: "Yesterday",
                week: "This Week",
                month: "This Month",
                older: "Older",
              }[key] || key;

            const filteredItems = searchQuery
              ? historyItems.filter((historyItem) =>
                  historyItem.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              : historyItems;

            if (filteredItems.length === 0) return null;

            return (
              <div key={key}>
                <div className="text-xs font-medium text-muted-foreground px-2 mb-1">
                  {groupTitle}
                </div>
                <div className="space-y-1">
                  {filteredItems.map((historyItem) => {
                    const isActive =
                      historyItem.isActive || isItemActive(historyItem.url);

                    return (
                      <div
                        key={historyItem.title}
                        className={`group flex items-center justify-between rounded-lg px-2.5 py-2 transition-all duration-200 cursor-pointer
                                                        ${
                                                          isActive
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "hover:bg-accent hover:text-accent-foreground"
                                                        }
                                                    `}
                        onClick={() => {
                          router.push(historyItem.url);
                          // Trigger storage change event to notify chat page
                          window.dispatchEvent(
                            new CustomEvent("chatStorageChanged", {
                              detail: {
                                chatId: historyItem.url.split("=")[1],
                                action: "navigate",
                              },
                            })
                          );
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                          <span className="text-sm truncate font-medium">
                            {historyItem.title}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* <DropdownMenuItem>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => handleRename(historyItem.title)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() =>
                                onDeleteHistoryItem?.(historyItem.title)
                              }
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWorkflowItems = (item: NavItem) => {
    if (!item.workflows || !open) return null;

    const searchQuery = searchQueries[item.title] || "";

    return (
      <div className="space-y-2 px-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => handleSearch(item.title, e.target.value)}
            className="pl-9 border-none bg-transparent focus-visible:border-0 focus-visible:ring-0 ring-0"
          />
        </div>

        <div className="space-y-2">
          {item.workflows.map((workflow) => (
            <div key={workflow.name}>
              <div className="text-sm font-medium text-muted-foreground px-2 mb-1">
                {workflow.name}
              </div>
              <div className="space-y-1">
                {workflow.chats
                  .filter((chat) =>
                    searchQuery
                      ? chat.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((chat) => {
                    const isActive = chat.isActive || isItemActive(chat.url);

                    return (
                      <div
                        key={chat.title}
                        className={`group flex items-center justify-between rounded-md px-2 py-1 transition-colors cursor-pointer
                                                    ${
                                                      isActive
                                                        ? "bg-[var(--imad)] text-white"
                                                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                    }
                                                `}
                        onClick={() => {
                          router.push(chat.url);
                          // Trigger storage change event to notify chat page
                          window.dispatchEvent(
                            new CustomEvent("chatStorageChanged", {
                              detail: {
                                chatId: chat.url.split("=")[1],
                                action: "navigate",
                              },
                            })
                          );
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{chat.title}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-sidebar-accent-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SidebarGroup>
      {open && <SidebarGroupLabel className="animate-in fade-in slide-in-from-left-1 duration-200">Workspace</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openSections[item.title]}
            onOpenChange={() => toggleSection(item.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`w-full justify-between transition-all duration-200 ${
                    item.isActive || isItemActive(item.url)
                      ? "bg-imad text-white hover:bg-imad/90"
                      : ""
                  }`}
                  isActive={item.isActive || isItemActive(item.url)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                    {open && (
                      <span className="truncate animate-in fade-in slide-in-from-left-1 duration-200">
                        {item.title} (
                        {item.items?.length ||
                          item.workflows?.reduce(
                            (acc, w) => acc + w.chats.length,
                            0
                          ) ||
                          0}
                        )
                      </span>
                    )}
                  </div>
                  {open && (
                    <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items && renderHistoryItems(item)}
                  {item.workflows && renderWorkflowItems(item)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
