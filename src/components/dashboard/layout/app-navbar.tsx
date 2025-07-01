"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Share2,
  Download,
  Copy,
  Trash2,
  MoreHorizontal,
  PanelRight,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUrlParam, setUrlParam } from "@/utils/url-params";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/custom-ui/toast";
import { useRightSidebar } from "../chat/right-sidebar-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/shared/loader";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

export const DashboardNavbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [copy, isCopied] = useCopyToClipboard();
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("Dashboard");
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const { isOpen: isRightPanelOpen, toggle: toggleRightPanel } =
    useRightSidebar();
  const [dbDialogOpen, setDbDialogOpen] = useState(false);
  const [dbUrl, setDbUrl] = useState("");
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ [table: string]: string[] }>({});

  // Get chatId from URL parameters using native TypeScript
  useEffect(() => {
    const id = getUrlParam("id");
    setChatId(id);
  }, []);

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const id = getUrlParam("id");
      setChatId(id);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (pathName === "/chat") {
      if (chatId) {
        // Try to load chat from localStorage
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`chat_${chatId}`);
          if (stored) {
            const chat = JSON.parse(stored);
            setChatTitle(chat.title || "Chat");
            setCurrentChat(chat);
          } else {
            setChatTitle("New Chat");
            setCurrentChat(null);
          }
        }
      } else {
        setChatTitle("New Chat");
        setCurrentChat(null);
      }
    } else {
      setChatTitle("Dashboard");
      setCurrentChat(null);
    }
  }, [pathName, chatId]);

  // Listen for chat storage changes to update title
  useEffect(() => {
    const handleChatStorageChange = (event: CustomEvent) => {
      if (event.detail.chatId === chatId) {
        // Reload the current chat data
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`chat_${chatId}`);
          if (stored) {
            const chat = JSON.parse(stored);
            setChatTitle(chat.title || "Chat");
            setCurrentChat(chat);
          }
        }
      }
    };

    window.addEventListener(
      "chatStorageChanged",
      handleChatStorageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "chatStorageChanged",
        handleChatStorageChange as EventListener
      );
    };
  }, [chatId]);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% chance of being connected
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (chatId) {
      const shareUrl = `${window.location.origin}/chat?id=${chatId}`;
      copy(shareUrl);
      showToast.success(
        "Link copied!",
        "Chat link has been copied to clipboard."
      );
    } else {
      showToast.error("No chat to share", "Please start a conversation first.");
    }
  };

  const handleCopyLink = () => {
    if (chatId) {
      const shareUrl = `${window.location.origin}/chat?id=${chatId}`;
      copy(shareUrl);
      showToast.success(
        "Link copied!",
        "Chat link has been copied to clipboard."
      );
    } else {
      showToast.error("No chat to copy", "Please start a conversation first.");
    }
  };

  const handleExportChat = () => {
    if (!currentChat) {
      showToast.error(
        "No chat to export",
        "Please start a conversation first."
      );
      return;
    }

    const chatData = {
      title: currentChat.title,
      messages: currentChat.messages,
      createdAt: currentChat.createdAt,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentChat.title.replace(/[^a-z0-9]/gi, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast.success("Chat exported!", "Your chat has been exported as JSON.");
  };

  const handleDeleteChat = () => {
    if (!chatId) {
      showToast.error(
        "No chat to delete",
        "Please start a conversation first."
      );
      return;
    }

    if (
      confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(`chat_${chatId}`);
      }

      // Redirect to new chat
      router.push("/chat");

      showToast.success(
        "Chat deleted!",
        "The chat has been permanently deleted."
      );
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    showToast.success(
      "Language changed!",
      `Switched to ${language} for code generation.`
    );
  };

  const getConnectionStatus = () => {
    if (isConnected) {
      return {
        text: "Connected",
        icon: <Wifi className="w-4 h-4" />,
        variant: "default" as const,
        className: "text-imad border-imad/20 bg-imad/10",
      };
    } else {
      return {
        text: "Disconnected",
        icon: <WifiOff className="w-4 h-4" />,
        variant: "destructive" as const,
        className: "text-red-600 border-red-200 bg-red-50",
      };
    }
  };

  const connectionStatus = getConnectionStatus();

  const handleDbConnect = async () => {
    setDbLoading(true);
    setDbError("");
    setDbTables([]);
    try {
      // TODO: Call API route to fetch tables/columns from Neon DB
      // Example: const res = await fetch("/api/neon-tables", { method: "POST", body: JSON.stringify({ dbUrl }) });
      // const data = await res.json();
      // setDbTables(data.tables);
      // For now, mock:
      setTimeout(() => {
        setDbTables([
          { name: "users", columns: ["id", "name", "email"] },
          { name: "orders", columns: ["id", "user_id", "amount"] },
        ]);
        setDbLoading(false);
      }, 1200);
    } catch (e) {
      setDbError("Failed to connect to database.");
      setDbLoading(false);
    }
  };

  const handleSelect = (table: string, column: string) => {
    setSelected((prev) => {
      const cols = prev[table] || [];
      return {
        ...prev,
        [table]: cols.includes(column)
          ? cols.filter((c) => c !== column)
          : [...cols, column],
      };
    });
  };

  const handleSendToChat = () => {
    // TODO: Send { dbUrl, selected } to chat as a query
    setDbDialogOpen(false);
    showToast.success(
      "Query sent to chat!",
      "Your selected tables/columns have been sent."
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b h-14 flex items-center justify-between gap-1 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hidden md:block" />

        <Button
          variant="outline"
          size="sm"
          className="gap-2 ml-2 text-imad border-imad/20 bg-imad/10 hover:bg-imad/20 hover:text-imad"
          onClick={() => setDbDialogOpen(true)}
        >
          Connect
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {selectedLanguage}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Code Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLanguageChange("Python")}>
              Python
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("R")}>
              R
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => handleLanguageChange("JavaScript")}
            >
              JavaScript
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handleLanguageChange("SQL")}>
              SQL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h1 className="capitalize font-bold text-lg">{chatTitle}</h1>

      <div className="flex items-center gap-1">
        <ModeToggle />

        <Button
          variant="outline"
          size="sm"
          className="gap-2 ml-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={handleExportChat}>
              <Download className="w-4 h-4" />
              Export Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleCopyLink}>
              <Copy className="w-4 h-4" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive"
              onClick={handleDeleteChat}
            >
              <Trash2 className="w-4 h-4" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={toggleRightPanel}
        >
          <PanelRight
            className={`w-4 h-4 transition-transform ${
              isRightPanelOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <Dialog open={dbDialogOpen} onOpenChange={setDbDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect to Neon DB</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter Neon DB PostgreSQL URL..."
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              disabled={dbLoading}
            />
            <Button onClick={handleDbConnect} disabled={dbLoading || !dbUrl}>
              {dbLoading ? <Loader /> : "Fetch Tables"}
            </Button>
            {dbError && <div className="text-red-500 text-sm">{dbError}</div>}
            {dbTables.length > 0 && (
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {dbTables.map((table) => (
                  <div key={table.name} className="mb-2">
                    <div className="font-semibold mb-1">{table.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {table.columns.map((col: string) => (
                        <label key={col} className="flex items-center gap-1">
                          <Checkbox
                            checked={
                              selected[table.name]?.includes(col) || false
                            }
                            onCheckedChange={() =>
                              handleSelect(table.name, col)
                            }
                          />
                          <span className="text-xs">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSendToChat}
              disabled={Object.keys(selected).length === 0 || !dbUrl}
            >
              Send to Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
