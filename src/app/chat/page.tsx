"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    Paperclip, 
    Send, 
    ChevronDown,
    Bot,
    User,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { DisplayOptionsDropdown } from "@/components/dashboard/chat/display-options-dropdown";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chatId = searchParams.get("id");
    
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gpt-4-turbo");
    const [selectedTools, setSelectedTools] = useState<string[]>(["data-analysis"]);
    const [selectedAgent, setSelectedAgent] = useState("agent-1");
    
    // Display options state
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [showAvatars, setShowAvatars] = useState(true);
    const [compactMode, setCompactMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                    title: "Data analysis and dataset overview",
                    messages: [],
                    createdAt: new Date()
                };
                setCurrentChat(newChat);
                saveChatToStorage(newChat);
            }
        } else {
            // No chat ID, redirect to create new chat
            const newChatId = uuidv4();
            router.push(`/chat?id=${newChatId}`);
        }
    }, [chatId, router]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

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
                    timestamp: new Date(msg.timestamp)
                }))
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

        const userMessage: Message = {
            id: uuidv4(),
            content: message.trim(),
            role: "user",
            timestamp: new Date()
        };

        // Update chat with user message
        const updatedChat = {
            ...currentChat,
            messages: [...currentChat.messages, userMessage]
        };
        setCurrentChat(updatedChat);
        saveChatToStorage(updatedChat);
        setMessage("");
        setIsLoading(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const assistantMessage: Message = {
                id: uuidv4(),
                content: generateMockResponse(userMessage.content),
                role: "assistant",
                timestamp: new Date()
            };

            const finalChat = {
                ...updatedChat,
                messages: [...updatedChat.messages, assistantMessage]
            };
            setCurrentChat(finalChat);
            saveChatToStorage(finalChat);
            setIsLoading(false);
        }, 1500);
    };

    const generateMockResponse = (userInput: string): string => {
        const responses = [
            "I can help you analyze your data. Could you please share more details about the dataset you're working with?",
            "Based on your query, I'll need to examine the data structure first. What type of analysis are you looking to perform?",
            "Let me process that information. I can provide insights on data patterns, statistical analysis, and visualization recommendations.",
            "Great question! I can help you with data cleaning, exploratory analysis, and generating meaningful insights from your dataset."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleModelSelect = (model: string) => {
        setSelectedModel(model);
    };

    const handleToolToggle = (tool: string) => {
        setSelectedTools(prev => 
            prev.includes(tool) 
                ? prev.filter(t => t !== tool)
                : [...prev, tool]
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
    const handleFontSizeChange = (size: "small" | "medium" | "large") => setFontSize(size);

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
            case "small": return "text-xs";
            case "large": return "text-base";
            default: return "text-sm";
        }
    };

    return (
        <div className={cn("flex flex-col h-full", darkMode ? "dark bg-gray-900" : "bg-white")}>
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between p-4 border-b border-border",
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white"
            )}>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Connected</span>
                    <Button variant="ghost" size="sm" className="text-imad">
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
                
                <h1 className={cn(
                    "text-lg font-semibold text-center flex-1",
                    darkMode ? "text-white" : "text-hiki"
                )}>
                    {currentChat.title}
                </h1>
                
                <div className="flex items-center gap-2">
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
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className={cn(
                "flex-1 overflow-y-auto p-6",
                darkMode ? "bg-gray-900" : "bg-white"
            )}>
                {isNewChat ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <h2 className={cn(
                                "text-3xl font-bold mb-2",
                                darkMode ? "text-white" : "text-hiki"
                            )}>
                                What would you like{" "}
                                <span className="text-maria">to uncover today?</span>
                            </h2>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {currentChat.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-4",
                                    msg.role === "user" ? "justify-end" : "justify-start",
                                    compactMode && "gap-2"
                                )}
                            >
                                {msg.role === "assistant" && showAvatars && (
                                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                
                                <Card className={cn(
                                    "max-w-[70%] border",
                                    compactMode ? "p-3" : "p-4",
                                    msg.role === "user" 
                                        ? "bg-maria text-white border-maria" 
                                        : darkMode 
                                            ? "bg-gray-800 border-gray-700 text-white"
                                            : "bg-white border-gray-200"
                                )}>
                                    <p className={cn("leading-relaxed", getFontSizeClass())}>
                                        {msg.content}
                                    </p>
                                    {showTimestamps && (
                                        <div className={cn(
                                            "text-xs mt-2",
                                            msg.role === "user" 
                                                ? "text-white/70" 
                                                : darkMode 
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                        )}>
                                            {msg.timestamp.toLocaleTimeString()}
                                        </div>
                                    )}
                                </Card>
                                
                                {msg.role === "user" && showAvatars && (
                                    <div className="w-8 h-8 rounded-full bg-maria flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-4 justify-start">
                                {showAvatars && (
                                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <Card className={cn(
                                    "max-w-[70%] border",
                                    compactMode ? "p-3" : "p-4",
                                    darkMode 
                                        ? "bg-gray-800 border-gray-700"
                                        : "bg-white border-gray-200"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                        <span className={cn(
                                            "text-sm",
                                            darkMode ? "text-gray-400" : "text-gray-500"
                                        )}>
                                            Thinking...
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className={cn(
                "p-6 border-t border-border",
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white"
            )}>
                <div className="max-w-4xl mx-auto">
                    {/* Model/Tools/Agents Selection */}
                    <div className="mb-4">
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
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={isNewChat ? "Link your data and ask anything..." : "Type your message..."}
                            className={cn(
                                "min-h-[60px] max-h-[200px] pr-20 resize-none border-gray-200",
                                darkMode 
                                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                    : "bg-white"
                            )}
                            disabled={isLoading}
                        />
                        
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-100"
                                disabled={isLoading}
                            >
                                <Paperclip className="w-4 h-4" />
                            </Button>
                            
                            <Button
                                onClick={handleSendMessage}
                                size="icon"
                                className="h-8 w-8 bg-hiki hover:bg-hiki/90"
                                disabled={!message.trim() || isLoading}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}