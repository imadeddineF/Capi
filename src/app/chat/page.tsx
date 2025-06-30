"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Paperclip, 
    Send, 
    Sparkles, 
    Settings, 
    Users,
    ChevronDown,
    Bot,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

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
    const [selectedModel, setSelectedModel] = useState("GPT-4");
    const [selectedTools, setSelectedTools] = useState("Data Analysis");
    const [selectedAgents, setSelectedAgents] = useState("Research Agent");
    
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

    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isNewChat = currentChat.messages.length === 0;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Connected</span>
                    <Button variant="ghost" size="sm" className="text-imad">
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
                
                <h1 className="text-lg font-semibold text-center flex-1 text-hiki">
                    {currentChat.title}
                </h1>
                
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Users className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                {isNewChat ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-hiki">
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
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                
                                <Card className={cn(
                                    "max-w-[70%] p-4 border",
                                    msg.role === "user" 
                                        ? "bg-maria text-white border-maria" 
                                        : "bg-white border-gray-200"
                                )}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className={cn(
                                        "text-xs mt-2",
                                        msg.role === "user" ? "text-white/70" : "text-gray-500"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString()}
                                    </div>
                                </Card>
                                
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-maria flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 rounded-full bg-imad flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <Card className="max-w-[70%] p-4 bg-white border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                        <span className="text-sm text-gray-500">Thinking...</span>
                                    </div>
                                </Card>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-white">
                <div className="max-w-4xl mx-auto">
                    {/* Model/Tools/Agents Selection */}
                    <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-gray-50 border-gray-200">
                            <Sparkles className="w-3 h-3 text-imad" />
                            Model
                            <ChevronDown className="w-3 h-3" />
                        </Badge>
                        
                        <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-gray-50 border-gray-200">
                            <Settings className="w-3 h-3 text-maria" />
                            Tools
                            <ChevronDown className="w-3 h-3" />
                        </Badge>
                        
                        <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-gray-50 border-gray-200">
                            <Users className="w-3 h-3 text-imad" />
                            Agents
                            <ChevronDown className="w-3 h-3" />
                        </Badge>
                    </div>

                    {/* Message Input */}
                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={isNewChat ? "Link your data and ask anything..." : "Type your message..."}
                            className="min-h-[60px] max-h-[200px] pr-20 resize-none bg-white border-gray-200"
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