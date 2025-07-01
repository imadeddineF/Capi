"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  BarChart3,
  FileTextIcon,
  FileCheck,
  Download,
  Share2,
  Copy,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightSidebar } from "./right-sidebar-context";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { showToast } from "@/components/custom-ui/toast";
import { getUrlParam } from "@/utils/url-params";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

const tabs = [
  { id: "workflow", label: "Workflow", icon: Workflow },
  { id: "diagrams", label: "Diagrams", icon: BarChart3 },
  { id: "plain-text", label: "Text", icon: FileTextIcon },
  { id: "resume", label: "Resume", icon: FileCheck },
];

export function RightSidebar() {
  const { isOpen, setIsOpen } = useRightSidebar();
  const [activeTab, setActiveTab] = useState("workflow");
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [copy] = useCopyToClipboard();
  const [selectedLanguage, setSelectedLanguage] = useState("Python");

  useEffect(() => {
    const id = getUrlParam("id");
    setChatId(id);
  }, []);

  useEffect(() => {
    if (chatId) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`chat_${chatId}`);
        if (stored) {
          const chat = JSON.parse(stored);
          setCurrentChat(chat);
        }
      }
    }
  }, [chatId]);

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

  const getMessageCount = () => {
    return currentChat?.messages?.length || 0;
  };

  const getLastActivity = () => {
    if (!currentChat?.messages?.length) return "Never";

    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    const lastDate = new Date(lastMessage.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed right-0 top-14 bottom-0 w-[500px] bg-background border-l border-border z-50 flex flex-col shadow-xl"
          >
            {/* Modern Tab Navigation */}
            <div className="p-4 border-b">
              <div className="flex space-x-1 p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        activeTab === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>

                      {/* Modern underline indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {activeTab === "workflow" && (
                    <>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Workflow className="w-4 h-4" />
                            Analysis Workflow
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-imad rounded-full"></div>
                              <span>Data Loading</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Preprocessing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <span>Visualization</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={handleExportChat}
                          >
                            <Download className="w-4 h-4" />
                            Export Results
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={handleShare}
                          >
                            <Share2 className="w-4 h-4" />
                            Share Analysis
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={() => {
                              if (currentChat?.messages) {
                                const summary = currentChat.messages
                                  .filter((msg) => msg.role === "assistant")
                                  .map((msg) => msg.content)
                                  .join("\n\n");
                                copy(summary);
                                showToast.success(
                                  "Summary copied!",
                                  "Analysis summary copied to clipboard."
                                );
                              }
                            }}
                          >
                            <Copy className="w-4 h-4" />
                            Copy Summary
                          </Button>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {activeTab === "diagrams" && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Generated Charts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="text-sm font-medium">
                              Sales Trend
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Line Chart
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="text-sm font-medium">
                              Customer Distribution
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Pie Chart
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="text-sm font-medium">
                              Performance Metrics
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Bar Chart
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === "plain-text" && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileTextIcon className="w-4 h-4" />
                          Text Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-3">
                          {currentChat?.messages?.length ? (
                            currentChat.messages
                              .filter((msg) => msg.role === "assistant")
                              .slice(-3)
                              .map((msg, index) => (
                                <p
                                  key={index}
                                  className="text-muted-foreground"
                                >
                                  {msg.content.length > 150
                                    ? msg.content.substring(0, 150) + "..."
                                    : msg.content}
                                </p>
                              ))
                          ) : (
                            <p className="text-muted-foreground">
                              No analysis content available yet. Start a
                              conversation to see summaries here.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === "resume" && (
                    <>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileCheck className="w-4 h-4" />
                            Session Resume
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Status
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-imad/10 text-imad"
                              >
                                Active
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Messages
                              </span>
                              <span className="font-medium">
                                {getMessageCount()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Created
                              </span>
                              <span className="font-medium">
                                {currentChat?.createdAt
                                  ? new Date(
                                      currentChat.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Last updated
                              </span>
                              <span className="font-medium">
                                {getLastActivity()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Model
                              </span>
                              <Badge variant="outline">GPT-4 Turbo</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Language
                              </span>
                              <Badge variant="outline">
                                {selectedLanguage}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Temperature
                              </span>
                              <span className="font-medium">0.7</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Max Tokens
                              </span>
                              <span className="font-medium">4096</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
