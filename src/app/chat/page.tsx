"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Bot, User, Copy, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { DisplayOptionsDropdown } from "@/components/dashboard/chat/display-options-dropdown";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getUrlParam, setUrlParam } from "@/utils/url-params";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isEdited?: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatPageContent() {
  // const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(null);

  // Initialize chatId from URL parameters
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

  const [copy, isCopied] = useCopyToClipboard();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo");
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "data-analysis",
  ]);
  const [selectedAgent, setSelectedAgent] = useState("agent-1");

  // Display options state
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showAvatars, setShowAvatars] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  // Message editing state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or load chat
  useEffect(() => {
    if (chatId) {
      // Load existing chat (in real app, this would be from API/database)
      const existingChat = loadChatFromStorage(chatId);
      if (existingChat) {
        setCurrentChat(existingChat);
      } else {
        // Create new chat with the provided ID
        const newChat: Chat = {
          id: chatId,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
        };
        setCurrentChat(newChat);
        saveChatToStorage(newChat);
      }
    } else {
      // No chat ID, create a temporary chat without saving
      const tempChat: Chat = {
        id: "",
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      };
      setCurrentChat(tempChat);
    }
  }, [chatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  // Focus edit textarea when editing starts
  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingMessageId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatFromStorage = (id: string): Chat | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`chat_${id}`);
    if (stored) {
      const chat = JSON.parse(stored);
      return {
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      };
    }
    return null;
  };

  const saveChatToStorage = (chat: Chat) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`chat_${chat.id}`, JSON.stringify(chat));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat || isLoading) return;

    // If this is a new chat without ID, create one
    let chatToUpdate = currentChat;
    if (!currentChat.id) {
      const newChatId = uuidv4();
      chatToUpdate = {
        ...currentChat,
        id: newChatId,
        title:
          message.trim().length > 50
            ? message.trim().substring(0, 50) + "..."
            : message.trim(),
      };
      // Update URL using pure TypeScript
      setUrlParam("id", newChatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Update chat with user message
    const updatedChat = {
      ...chatToUpdate,
      messages: [...chatToUpdate.messages, userMessage],
    };
    setCurrentChat(updatedChat);

    // Only save if chat has an ID
    if (updatedChat.id) {
      saveChatToStorage(updatedChat);
    }

    setMessage("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: generateMockResponse(userMessage.content),
        role: "assistant",
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
      };
      setCurrentChat(finalChat);

      // Only save if chat has an ID
      if (finalChat.id) {
        saveChatToStorage(finalChat);
      }

      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      "I can help you analyze your data. Could you please share more details about the dataset you're working with?",
      "Based on your query, I'll need to examine the data structure first. What type of analysis are you looking to perform?",
      "Let me process that information. I can provide insights on data patterns, statistical analysis, and visualization recommendations.",
      "Great question! I can help you with data cleaning, exploratory analysis, and generating meaningful insights from your dataset.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId || !currentChat || !editingContent.trim()) return;

    const updatedMessages = currentChat.messages.map((msg) =>
      msg.id === editingMessageId
        ? { ...msg, content: editingContent.trim(), isEdited: true }
        : msg
    );

    // Remove any assistant messages that came after the edited message
    const editedMessageIndex = updatedMessages.findIndex(
      (msg) => msg.id === editingMessageId
    );
    const filteredMessages = updatedMessages.filter((msg, index) => {
      // Keep all messages up to and including the edited message
      if (index <= editedMessageIndex) return true;
      // Remove any assistant messages that came after the edited message
      if (msg.role === "assistant") return false;
      // Keep any user messages that came after (in case of multiple user messages)
      return true;
    });

    const updatedChat = {
      ...currentChat,
      messages: filteredMessages,
    };

    setCurrentChat(updatedChat);
    if (updatedChat.id) {
      saveChatToStorage(updatedChat);
    }

    setEditingMessageId(null);
    setEditingContent("");

    // Resend the edited message
    handleResendMessage(editingContent.trim());
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleCopyMessage = (content: string) => {
    copy(content);
  };

  const handleResendMessage = async (content: string) => {
    if (!currentChat || isLoading) return;

    setIsLoading(true);

    // Simulate AI response to the edited message
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: generateMockResponse(content),
        role: "assistant",
        timestamp: new Date(),
      };

      const finalChat = {
        ...currentChat,
        messages: [...currentChat.messages, assistantMessage],
      };
      setCurrentChat(finalChat);

      if (finalChat.id) {
        saveChatToStorage(finalChat);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleAgentSelect = (agent: string) => {
    setSelectedAgent(agent);
  };

  // Display options handlers
  const handleToggleTimestamps = () => setShowTimestamps(!showTimestamps);
  const handleToggleAvatars = () => setShowAvatars(!showAvatars);
  const handleToggleCompactMode = () => setCompactMode(!compactMode);
  const handleToggleDarkMode = () => setDarkMode(!darkMode);
  const handleFontSizeChange = (size: "small" | "medium" | "large") =>
    setFontSize(size);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isNewChat = currentChat.messages.length === 0;

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-xs";
      case "large":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <div className={cn("flex flex-col h-full bg-background")}>
        {/* Messages Area */}
        <div className={cn("flex-1 overflow-y-auto bg-background")}>
          {isNewChat ? (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-6">
              <div className="mb-8">
                <h2 className={cn("text-3xl font-bold mb-2 text-hiki")}>
                  What would you like{" "}
                  <span className="text-maria">to uncover today?</span>
                </h2>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
              {currentChat.messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 group",
                    msg.role === "user" ? "justify-end" : "justify-start",
                    compactMode && "gap-2"
                  )}
                >
                  {/* Avatar for Assistant */}
                  {msg.role === "assistant" && showAvatars && (
                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="">
                    <div className="flex gap-1">
                      {msg.role === "user" && (
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 text-xs hover:bg-muted/50"
                            onClick={() => handleStartEdit(msg.id, msg.content)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 text-xs hover:bg-muted/50"
                            onClick={() => handleCopyMessage(msg.content)}
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex flex-col gap-1",
                          msg.role === "user" ? "items-end" : "items-start"
                        )}
                      >
                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "relative rounded-2xl px-4 py-3 shadow-sm",
                            msg.role === "user"
                              ? "bg-imad text-white"
                              : "bg-card border border-border/50"
                          )}
                        >
                          {editingMessageId === msg.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                              <Textarea
                                ref={editTextareaRef}
                                value={editingContent}
                                onChange={(e) =>
                                  setEditingContent(e.target.value)
                                }
                                onKeyDown={handleEditKeyPress}
                                className={cn(
                                  "min-h-[60px] resize-none border-0 bg-transparent p-0",
                                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                                  msg.role === "user"
                                    ? "text-white"
                                    : "text-foreground"
                                )}
                                placeholder="Edit your message..."
                              />
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={handleCancelEdit}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-3 text-xs text-white/70 hover:text-white hover:bg-white/10"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={handleSaveEdit}
                                  size="sm"
                                  className="h-7 px-3 text-xs bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Normal Mode
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "leading-relaxed whitespace-pre-wrap",
                                    getFontSizeClass(),
                                    msg.role === "user"
                                      ? "text-white"
                                      : "text-foreground"
                                  )}
                                >
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timestamp and Status */}
                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {showTimestamps && (
                        <span className="text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      {msg.role === "user" && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span className="text-muted-foreground">
                            {msg.isEdited ? "Edited" : "Delivered"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar for User */}
                  {msg.role === "user" && showAvatars && (
                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  {showAvatars && (
                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-1">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={cn("border-t border-border bg-background")}>
          <div className="max-w-4xl mx-auto p-6">
            {/* Model/Tools/Agents Selection */}
            <div className="mb-4 flex items-center justify-between">
              <ModelSelectorDropdown
                selectedModel={selectedModel}
                selectedTools={selectedTools}
                selectedAgent={selectedAgent}
                onModelSelect={handleModelSelect}
                onToolToggle={handleToolToggle}
                onAgentSelect={handleAgentSelect}
              />
              <DisplayOptionsDropdown
                showTimestamps={showTimestamps}
                showAvatars={showAvatars}
                compactMode={compactMode}
                darkMode={darkMode}
                fontSize={fontSize}
                onToggleTimestamps={handleToggleTimestamps}
                onToggleAvatars={handleToggleAvatars}
                onToggleCompactMode={handleToggleCompactMode}
                onToggleDarkMode={handleToggleDarkMode}
                onFontSizeChange={handleFontSizeChange}
              />
            </div>

            {/* Message Input */}
            <div className="relative">
              <div className="relative bg-card border border-border rounded-2xl shadow-sm">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    isNewChat
                      ? "Link your data and ask anything..."
                      : "Type your message..."
                  }
                  className={cn(
                    "min-h-[60px] max-h-[200px] pr-24 resize-none border-0 bg-transparent rounded-2xl",
                    "focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                  disabled={isLoading}
                />

                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted/50 rounded-xl"
                    disabled={isLoading}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-8 w-8 bg-hiki hover:bg-hiki/90 rounded-xl shadow-sm"
                    disabled={!message.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Input Footer */}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <div className="text-xs text-muted-foreground">
                  {message.length}/4000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
