"use client";

import type React from "react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, ArrowUp, Bot, User, Copy, Edit, Check, X, Sparkles, Settings, Users, ChevronDown, Upload, FileText, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { DisplayOptionsDropdown } from "@/components/dashboard/chat/display-options-dropdown";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getUrlParam, setUrlParam } from "@/utils/url-params";
import { TextAnimate } from "@/components/magicui/text-animate";
import { useRightSidebar } from "@/components/dashboard/chat/right-sidebar-context";
import { RightSidebar } from "@/components/dashboard/chat/right-sidebar";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/custom-ui/toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isEdited?: boolean;
  attachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
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
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

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
  const [isAnimating, setIsAnimating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

  // Cycling text animation effect with super smooth transitions
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
      setIsAnimating(true);
      
      // Smooth delay for exit animation
      setTimeout(() => {
        setCurrentWordIndex(
          (prevIndex) => (prevIndex + 1) % animatedWords.length
        );
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [animatedWords.length]);

  // Drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = e.dataTransfer?.files;
      if (files) {
        handleFileSelect(files);
      }
    };

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

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

  // File handling functions
  const handleFileSelect = (files: FileList) => {
    const newAttachments: FileAttachment[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast.error("File too large", `${file.name} exceeds 10MB limit`);
        return;
      }
      
      const attachment: FileAttachment = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
      };
      
      newAttachments.push(attachment);
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    showToast.success("Files attached", `${newAttachments.length} file(s) ready to send`);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || !currentChat || isLoading) return;

    let chatToUpdate = currentChat;
    if (!currentChat.id) {
      const newChatId = uuidv4();
      chatToUpdate = {
        ...currentChat,
        id: newChatId,
        title:
          message.trim().length > 50
            ? message.trim().substring(0, 50) + "..."
            : message.trim() || "File Upload",
      };
      setUrlParam("id", newChatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: message.trim() || "Uploaded files",
      role: "user",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
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
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: generateMockResponse(userMessage.content, userMessage.attachments),
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

  const generateMockResponse = (userInput: string, attachments?: FileAttachment[]): string => {
    if (attachments && attachments.length > 0) {
      const fileTypes = attachments.map(att => att.type).join(", ");
      return `I can see you've uploaded ${attachments.length} file(s) (${fileTypes}). I'll analyze the data and provide insights. What specific analysis would you like me to perform on these files?`;
    }
    
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
      <div 
        ref={dropZoneRef}
        className={cn(
          "flex h-full bg-background relative transition-all duration-300",
          isDragOver && "bg-blue-50 border-2 border-dashed border-blue-300"
        )}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50/90 backdrop-blur-sm">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-xl font-semibold text-blue-700">Drop files here to upload</p>
              <p className="text-blue-600">CSV, Excel, PDF, and more supported</p>
            </div>
          </div>
        )}

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
              <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center p-6">
                {/* Large Title */}
                <div className="mb-12">
                  <h1 className="text-5xl font-bold mb-2 text-black flex items-center gap-2 justify-center whitespace-nowrap">
                    What would you like{" "}
                    <span className="text-purple-600 inline-block min-w-[300px] text-left">
                      {!isAnimating && (
                        <TextAnimate 
                          key={currentWordIndex}
                          animation="blurInUp" 
                          by="word" 
                          once={false}
                          duration={0.8}
                          className="inline whitespace-nowrap"
                        >
                          {animatedWords[currentWordIndex]}
                        </TextAnimate>
                      )}
                    </span>
                  </h1>
                </div>

                {/* Large Input Field */}
                <div className="w-full max-w-3xl mx-auto mb-8">
                  <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <Textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Link your data and ask anything..."
                      className="min-h-[80px] max-h-[200px] pr-24 resize-none border-0 bg-transparent rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                    
                    {/* Attachments */}
                    {attachments.length > 0 && (
                      <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                          >
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">{attachment.name}</span>
                            <span className="text-gray-500">({formatFileSize(attachment.size)})</span>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-gray-400 hover:text-red-500 ml-1"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        accept=".csv,.xlsx,.xls,.pdf,.txt,.json,.xml"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover:bg-gray-100 rounded-xl"
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="h-10 w-10 bg-gray-200 hover:bg-gray-300 rounded-xl shadow-sm"
                        disabled={(!message.trim() && attachments.length === 0) || isLoading}
                      >
                        <ArrowUp className="w-5 h-5 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Model/Tools/Agents Selection */}
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className="gap-2 cursor-pointer hover:bg-purple-50 border-purple-200 px-4 py-2 text-purple-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    Model
                    <ChevronDown className="w-3 h-3" />
                  </Badge>
                  
                  <Badge
                    variant="outline"
                    className="gap-2 cursor-pointer hover:bg-blue-50 border-blue-200 px-4 py-2 text-blue-700"
                  >
                    <Settings className="w-4 h-4" />
                    Tools
                    <ChevronDown className="w-3 h-3" />
                  </Badge>
                  
                  <Badge
                    variant="outline"
                    className="gap-2 cursor-pointer hover:bg-purple-50 border-purple-200 px-4 py-2 text-purple-700"
                  >
                    <Users className="w-4 h-4" />
                    Agents
                    <ChevronDown className="w-3 h-3" />
                  </Badge>
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
                                
                                {/* Attachments */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {msg.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className={cn(
                                          "flex items-center gap-2 p-2 rounded-lg",
                                          msg.role === "user"
                                            ? "bg-white/20"
                                            : "bg-muted/50"
                                        )}
                                      >
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm">{attachment.name}</span>
                                        <span className="text-xs opacity-70">
                                          ({formatFileSize(attachment.size)})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
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
                    
                    {/* Attachments */}
                    {attachments.length > 0 && (
                      <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{attachment.name}</span>
                            <span className="text-muted-foreground">({formatFileSize(attachment.size)})</span>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="text-muted-foreground hover:text-destructive ml-1"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        accept=".csv,.xlsx,.xls,.pdf,.txt,.json,.xml"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted/50 rounded-xl"
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="h-8 w-8 bg-hiki hover:bg-hiki/90 rounded-xl shadow-sm"
                        disabled={(!message.trim() && attachments.length === 0) || isLoading}
                      >
                        <ArrowUp className="w-4 h-4" />
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