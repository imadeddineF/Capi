"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Sparkles, 
    Settings, 
    Users,
    ChevronDown,
    MessageSquarePlus
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function ChatStarter() {
    const router = useRouter();

    const handleStartNewChat = () => {
        const newChatId = uuidv4();
        router.push(`/chat?id=${newChatId}`);
    };

    const suggestedPrompts = [
        "Analyze my sales data for trends",
        "Help me clean this dataset",
        "Create visualizations for my data",
        "Find correlations in my data"
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                    What would you like{" "}
                    <span className="text-maria">to uncover today?</span>
                </h2>
                <p className="text-muted-foreground">
                    Start a conversation with our AI to analyze your data and get insights
                </p>
            </div>

            {/* Model/Tools/Agents Selection */}
            <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-accent">
                    <Sparkles className="w-3 h-3 text-imad" />
                    Model
                    <ChevronDown className="w-3 h-3" />
                </Badge>
                
                <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-accent">
                    <Settings className="w-3 h-3 text-maria" />
                    Tools
                    <ChevronDown className="w-3 h-3" />
                </Badge>
                
                <Badge variant="outline" className="gap-2 cursor-pointer hover:bg-accent">
                    <Users className="w-3 h-3 text-imad" />
                    Agents
                    <ChevronDown className="w-3 h-3" />
                </Badge>
            </div>

            {/* Start Chat Button */}
            <Button 
                onClick={handleStartNewChat}
                size="lg"
                className="mb-8 gap-2"
            >
                <MessageSquarePlus className="w-4 h-4" />
                Start New Chat
            </Button>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedPrompts.map((prompt, index) => (
                    <Card 
                        key={index}
                        className="p-4 cursor-pointer hover:bg-accent transition-colors"
                        onClick={handleStartNewChat}
                    >
                        <p className="text-sm">{prompt}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}