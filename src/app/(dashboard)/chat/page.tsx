"use client";

import type React from "react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Bot, User, Copy, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { DisplayOptionsDropdown } from "@/components/dashboard/chat/display-options-dropdown";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getUrlParam, setUrlParam } from "@/utils/url-params";
import { TextAnimate } from "@/components/magicui/text-animate";
import { useRightSidebar } from "@/components/dashboard/chat/right-sidebar-context";
import { RightSidebar } from "@/components/dashboard/chat/right-sidebar";

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
  const { isOpen: isRightSidebarOpen } = useRightSidebar();
  const [chatId, setChatId] = useState<string | null>(null);
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

  // Animation state for cycling text
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Initialize or load chat
  useEffect(() => {
    if (chatId) {
      const existingChat = loadChatFromStorage(chatId);
      if (existingChat) {
        setCurrentChat(existingChat);
      } else {
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
      const tempChat: Chat = {
        id: "",
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      };
      setCurrentChat(tempChat);
    }
  }, [chatId]);

  // Listen for chat storage changes to update content when switching chats
  useEffect(() => {
    const handleChatStorageChange = (event: CustomEvent) => {
      if (
        event.detail.action === "navigate" &&
        event.detail.chatId === chatId
      ) {
        // Reload the current chat data when navigating to a different chat
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`chat_${chatId}`);
          if (stored) {
            const chat = JSON.parse(stored);
            setCurrentChat(chat);
          }
        }
      } else if (
        event.detail.chatId === chatId &&
        event.detail.action === "save"
      ) {
        // Reload the current chat data when the current chat is updated
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`chat_${chatId}`);
          if (stored) {
            const chat = JSON.parse(stored);
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

  // Cycling text animation effect
  const animatedWords = [
    "to uncover today?",
    "to explore next?",
    "to analyze now?",
    "to discover here?",
    "to investigate?",
    "to understand better?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % animatedWords.length
      );
      setAnimationKey((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [animatedWords.length]);

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
    window.dispatchEvent(
      new CustomEvent("chatStorageChanged", {
        detail: { chatId: chat.id, action: "save" },
      })
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat || isLoading) return;

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
      setUrlParam("id", newChatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      role: "user",
      timestamp: new Date(),
    };

    const updatedChat = {
      ...chatToUpdate,
      messages: [...chatToUpdate.messages, userMessage],
    };

    setCurrentChat(updatedChat);
    if (updatedChat.id) {
      saveChatToStorage(updatedChat);
    }

    setMessage("");
    setIsLoading(true);

    // Simulate AI response
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

    // Update the edited message
    const updatedMessages = currentChat.messages.map((msg) =>
      msg.id === editingMessageId
        ? { ...msg, content: editingContent.trim(), isEdited: true }
        : msg
    );

    // Find the index of the edited message
    const editedMessageIndex = updatedMessages.findIndex(
      (msg) => msg.id === editingMessageId
    );

    // Remove the assistant response and all subsequent messages after the edited user message
    const filteredMessages = updatedMessages.slice(0, editedMessageIndex + 1);

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

    // Generate new response to the edited message
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

  const handleToggleTimestamps = () => setShowTimestamps(!showTimestamps);
  const handleToggleAvatars = () => setShowAvatars(!showAvatars);
  const handleToggleCompactMode = () => setCompactMode(!compactMode);
  const handleToggleDarkMode = () => setDarkMode(!darkMode);
  const handleFontSizeChange = (size: "small" | "medium" | "large") =>
    setFontSize(size);

  const predefinedPrompts = [
    "Summarize my uploaded CSV file.",
    "Show me trends in my sales data.",
    "What are the top 5 products by revenue?",
    "Find anomalies in this dataset.",
    "Visualize customer churn over time.",
  ];

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

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
      <div className="flex h-full bg-background relative">
        {/* Main Chat Content */}
        <motion.div
          animate={{
            marginRight: isRightSidebarOpen ? "500px" : "0px",
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            duration: 0.3,
          }}
          className="flex flex-col flex-1 h-full"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-background">
            {isNewChat ? (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-6">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-hiki flex items-center gap-2">
                    What would you like{" "}
                    <span className="text-maria">
                      <TextAnimate animation="blurInUp" by="word" once>
                        {animatedWords[currentWordIndex]}
                      </TextAnimate>
                    </span>
                  </h2>
                </div>
                {/* Centered Input */}
                <div className="w-full max-w-xl mx-auto mb-6">
                  <div className="relative bg-card border border-border rounded-2xl shadow-sm">
                    <Textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Link your data and ask anything..."
                      className="min-h-[60px] max-h-[200px] pr-24 resize-none border-0 bg-transparent rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="text-xs text-muted-foreground">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.length}/4000
                    </div>
                  </div>
                </div>
                {/* Predefined Prompts */}
                <div className="w-full max-w-2xl mx-auto">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {predefinedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        className="w-32 h-32 rounded-xl border border-border bg-card p-3 text-center text-xs hover:bg-muted transition flex items-center justify-center"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
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
                            <div className="w-1.5 h-1.5 rounded-full bg-imad"></div>
                            <span className="text-muted-foreground">
                              {msg.isEdited ? "Edited" : "Delivered"}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Action buttons for user messages - ChatGPT style */}
                      {msg.role === "user" && editingMessageId !== msg.id && (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded"
                            onClick={() => handleStartEdit(msg.id, msg.content)}
                            title="Edit message"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded"
                            onClick={() => handleCopyMessage(msg.content)}
                            title="Copy message"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-imad" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                      {/* Action buttons for assistant messages - ChatGPT style */}
                      {msg.role === "assistant" && (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded"
                            onClick={() => handleCopyMessage(msg.content)}
                            title="Copy message"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-imad" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
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

          {/* Input Area (bottom) */}
          {!isNewChat && (
            <div className="bg-background">
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
                      placeholder="Type your message..."
                      className="min-h-[60px] max-h-[200px] pr-24 resize-none border-0 bg-transparent rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
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
          )}
        </motion.div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </Suspense>
  );
}
