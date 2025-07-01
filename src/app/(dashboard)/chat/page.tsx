"use client";

import type React from "react";
import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Paperclip,
  ArrowUp,
  Bot,
  User,
  Copy,
  Edit,
  Check,
  X,
  FileText,
  XIcon,
  CloudUpload,
  File,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getUrlParam, setUrlParam } from "@/utils/url-params";
import { TextAnimate } from "@/components/magicui/text-animate";
import { useRightSidebar } from "@/components/dashboard/chat/right-sidebar-context";
import { RightSidebar } from "@/components/dashboard/chat/right-sidebar";
import { showToast } from "@/components/custom-ui/toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isEdited?: boolean;
  attachments?: FileAttachment[];
  structuredData?: {
    type: string;
    data: any[];
    totalRevenue?: number;
  };
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
  const [, setDragCounter] = useState(0);

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
    console.log("Chat ID changed:", chatId);
    if (chatId) {
      const existingChat = loadChatFromStorage(chatId);
      console.log("Loaded existing chat:", existingChat);
      if (existingChat) {
        setCurrentChat(existingChat);
      } else {
        console.log("No existing chat found, creating new empty chat");
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
      // Always reset to a new chat state when no chatId
      console.log("No chat ID, resetting to new chat state");
      setCurrentChat({
        id: "",
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      });
    }
  }, [chatId]);

  // Listen for chat storage changes to update content when switching chats
  useEffect(() => {
    const handleChatStorageChange = (event: CustomEvent) => {
      console.log("Chat storage change event:", event.detail);

      if (event.detail.action === "create" && event.detail.chatId === chatId) {
        // Handle new chat creation
        console.log("Loading newly created chat:", event.detail.newChat);
        // Ensure proper timestamp conversion for newly created chat
        const processedChat = {
          ...event.detail.newChat,
          createdAt: ensureTimestamp(event.detail.newChat.createdAt),
          messages: event.detail.newChat.messages.map((msg: any) => ({
            ...msg,
            timestamp: ensureTimestamp(msg.timestamp),
          })),
        };
        setCurrentChat(processedChat);
      } else if (
        event.detail.action === "navigate" &&
        event.detail.chatId === chatId
      ) {
        // Reload the current chat data when navigating to a different chat
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`chat_${chatId}`);
          if (stored) {
            const chat = JSON.parse(stored);
            // Ensure proper timestamp conversion
            const processedChat = {
              ...chat,
              createdAt: ensureTimestamp(chat.createdAt),
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: ensureTimestamp(msg.timestamp),
              })),
            };
            setCurrentChat(processedChat);
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
            // Ensure proper timestamp conversion
            const processedChat = {
              ...chat,
              createdAt: ensureTimestamp(chat.createdAt),
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: ensureTimestamp(msg.timestamp),
              })),
            };
            setCurrentChat(processedChat);
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

  // Enhanced drag and drop handlers - now covering entire page
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if the dragged items contain files
      if (e.dataTransfer?.types.includes("Files")) {
        setDragCounter((prev) => prev + 1);
        setIsDragOver(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer?.types.includes("Files")) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCounter((prev) => {
        const newCounter = prev - 1;
        if (newCounter <= 0) {
          setIsDragOver(false);
          return 0;
        }
        return newCounter;
      });
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCounter(0);
      setIsDragOver(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFileSelect(files);
      }
    };

    // Add paste event listener for file uploads
    const handlePaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        handleFileSelect(files);
      }
    };

    // Attach to document to cover entire page
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Utility function to ensure timestamp is always a Date object
  const ensureTimestamp = (timestamp: any): Date => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === "string" || typeof timestamp === "number") {
      return new Date(timestamp);
    }
    // Fallback to current date if timestamp is invalid
    return new Date();
  };

  const loadChatFromStorage = useCallback((id: string): Chat | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`chat_${id}`);
    if (stored) {
      const chat = JSON.parse(stored);
      return {
        ...chat,
        createdAt: ensureTimestamp(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: ensureTimestamp(msg.timestamp),
        })),
      };
    }
    return null;
  }, []);

  const saveChatToStorage = useCallback((chat: Chat) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`chat_${chat.id}`, JSON.stringify(chat));
    window.dispatchEvent(
      new CustomEvent("chatStorageChanged", {
        detail: { chatId: chat.id, action: "save" },
      })
    );
  }, []);

  // File handling functions
  const handleFileSelect = (files: FileList) => {
    const newAttachments: FileAttachment[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
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

    setAttachments((prev) => [...prev, ...newAttachments]);
    showToast.success(
      "Files attached",
      `${newAttachments.length} file(s) ready to send`
    );
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.includes("pdf")) return FileText;
    if (
      type.includes("csv") ||
      type.includes("excel") ||
      type.includes("sheet")
    )
      return FileText;
    return File;
  };

  const handleSendMessage = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      !currentChat ||
      isLoading
    )
      return;

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
        content: generateMockResponse(
          userMessage.content,
          userMessage.attachments
        ),
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

  const generateMockResponse = (
    userInput: string,
    attachments?: FileAttachment[]
  ): string => {
    if (attachments && attachments.length > 0) {
      const fileTypes = attachments.map((att) => att.type).join(", ");
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
    showToast.success("Model updated", `Switched to ${model}`);
  };

  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
    const action = selectedTools.includes(tool) ? "removed" : "added";
    showToast.success("Tools updated", `${tool} ${action}`);
  };

  const handleAgentSelect = (agent: string) => {
    setSelectedAgent(agent);
    showToast.success("Agent updated", `Switched to ${agent}`);
  };

  // These functions are kept for future use in settings or context menus
  // const handleToggleTimestamps = () => setShowTimestamps(!showTimestamps);
  // const handleToggleAvatars = () => setShowAvatars(!showAvatars);
  // const handleToggleCompactMode = () => setCompactMode(!compactMode);
  // const handleToggleDarkMode = () => setDarkMode(!darkMode);
  // const handleFontSizeChange = (size: "small" | "medium" | "large") =>
  //   setFontSize(size);

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
        {/* Enhanced Drag Overlay - Covers entire viewport */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-[linear-gradient(135deg,rgba(99,102,241,0.1)_0%,rgba(168,85,247,0.1)_50%,rgba(236,72,153,0.1)_100%)] backdrop-blur-[20px]"
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      scale: 0,
                    }}
                    animate={{
                      y: [null, Math.random() * window.innerHeight],
                      x: [null, Math.random() * window.innerWidth],
                      scale: [0, 1, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Ripple Effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: [0, 2, 4], opacity: [0.8, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-96 h-96 border-4 border-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: [0, 1.5, 3], opacity: [0.6, 0.2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                >
                  <div className="w-96 h-96 border-4 border-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
                </motion.div>
              </div>

              {/* Main Drop Zone Content */}
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 flex flex-col items-center gap-6 p-12 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.1)_100%)] [box-shadow:0_25px_50px_-12px_rgba(0,0,0,0.25),_inset_0_1px_0_rgba(255,255,255,0.2)]"
              >
                {/* Animated Upload Icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <CloudUpload className="relative w-24 h-24 text-white drop-shadow-lg" />
                </motion.div>

                {/* Main Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                    Drop files anywhere
                  </h2>
                  <p className="text-xl text-white/90 mb-6 drop-shadow">
                    Release to upload your files instantly
                  </p>
                </motion.div>

                {/* File Type Icons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4 mb-4"
                >
                  {[FileText, ImageIcon, File].map((Icon, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.2,
                        ease: "easeInOut",
                      }}
                      className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Feature Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-3 justify-center"
                >
                  {[
                    "CSV & Excel",
                    "PDF Documents",
                    "Images",
                    "Max 10MB/file",
                    "Multiple files",
                  ].map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm border border-white/30 shadow-lg"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Pulsing Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Content */}
        <motion.div
          animate={{
            x: isRightSidebarOpen ? -500 : 0,
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
                        {attachments.map((attachment) => {
                          const IconComponent = getFileIcon(attachment.type);
                          return (
                            <motion.div
                              key={attachment.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-2 text-sm"
                            >
                              <IconComponent className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700 font-medium">
                                {attachment.name}
                              </span>
                              <span className="text-gray-500">
                                ({formatFileSize(attachment.size)})
                              </span>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="text-gray-400 hover:text-red-500 ml-1 transition-colors"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && handleFileSelect(e.target.files)
                        }
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
                        disabled={
                          (!message.trim() && attachments.length === 0) ||
                          isLoading
                        }
                      >
                        <ArrowUp className="w-5 h-5 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Model/Tools/Agents Selection */}
                <ModelSelectorDropdown
                  selectedModel={selectedModel}
                  selectedTools={selectedTools}
                  selectedAgent={selectedAgent}
                  onModelSelect={handleModelSelect}
                  onToolToggle={handleToolToggle}
                  onAgentSelect={handleAgentSelect}
                />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-6 space-y-8">
                {currentChat.messages.map((msg) => (
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

                                {/* Structured Data Display */}
                                {msg.structuredData &&
                                  msg.structuredData.type ===
                                    "top_customers" && (
                                    <div className="mt-4 space-y-3">
                                      {msg.structuredData.totalRevenue && (
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                                          <div className="text-sm font-medium text-blue-900">
                                            Total Revenue: $
                                            {msg.structuredData.totalRevenue.toFixed(
                                              2
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                          <h4 className="font-medium text-gray-900">
                                            Top Customers by Total Order Value
                                          </h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                          <table className="w-full">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Customer Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  Total Value
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {msg.structuredData.data.map(
                                                (customer, index) => (
                                                  <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                  >
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                      {customer.customer_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                      $
                                                      {customer.total.toFixed(
                                                        2
                                                      )}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {/* Attachments */}
                                {msg.attachments &&
                                  msg.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      {msg.attachments.map((attachment) => {
                                        const IconComponent = getFileIcon(
                                          attachment.type
                                        );
                                        return (
                                          <div
                                            key={attachment.id}
                                            className={cn(
                                              "flex items-center gap-2 p-2 rounded-lg",
                                              msg.role === "user"
                                                ? "bg-white/20"
                                                : "bg-muted/50"
                                            )}
                                          >
                                            <IconComponent className="w-4 h-4" />
                                            <span className="text-sm">
                                              {attachment.name}
                                            </span>
                                            <span className="text-xs opacity-70">
                                              ({formatFileSize(attachment.size)}
                                              )
                                            </span>
                                          </div>
                                        );
                                      })}
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
                            {ensureTimestamp(msg.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
                        {attachments.map((attachment) => {
                          const IconComponent = getFileIcon(attachment.type);
                          return (
                            <motion.div
                              key={attachment.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-2 text-sm"
                            >
                              <IconComponent className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">
                                {attachment.name}
                              </span>
                              <span className="text-muted-foreground">
                                ({formatFileSize(attachment.size)})
                              </span>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="text-muted-foreground hover:text-destructive ml-1 transition-colors"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && handleFileSelect(e.target.files)
                        }
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
                        disabled={
                          (!message.trim() && attachments.length === 0) ||
                          isLoading
                        }
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
