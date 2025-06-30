"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    Sparkles, 
    Settings, 
    Users, 
    Check,
    Zap,
    Brain,
    Database,
    FileText,
    BarChart3,
    Search,
    Code,
    Image as ImageIcon,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activeTab: "models" | "tools" | "agents";
    selectedModel: string;
    selectedTools: string[];
    selectedAgent: string;
    onModelSelect: (model: string) => void;
    onToolToggle: (tool: string) => void;
    onAgentSelect: (agent: string) => void;
}

const AI_MODELS = [
    {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        description: "Most capable model for complex reasoning and analysis",
        icon: Sparkles,
        badge: "Latest",
        color: "text-blue-600"
    },
    {
        id: "gpt-4",
        name: "GPT-4",
        description: "High-quality responses for complex tasks",
        icon: Brain,
        badge: "Popular",
        color: "text-purple-600"
    },
    {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Excellent for analysis and creative tasks",
        icon: Zap,
        badge: "New",
        color: "text-orange-600"
    },
    {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        description: "Balanced performance and speed",
        icon: MessageSquare,
        badge: "",
        color: "text-green-600"
    },
    {
        id: "gemini-pro",
        name: "Gemini Pro",
        description: "Google's advanced multimodal AI",
        icon: Sparkles,
        badge: "",
        color: "text-red-600"
    }
];

const AI_TOOLS = [
    {
        id: "data-analysis",
        name: "Data Analysis",
        description: "Statistical analysis and data processing",
        icon: BarChart3,
        color: "text-blue-600"
    },
    {
        id: "code-interpreter",
        name: "Code Interpreter",
        description: "Execute Python code and analyze data",
        icon: Code,
        color: "text-green-600"
    },
    {
        id: "web-search",
        name: "Web Search",
        description: "Search the internet for current information",
        icon: Search,
        color: "text-purple-600"
    },
    {
        id: "file-upload",
        name: "File Upload",
        description: "Upload and analyze documents and datasets",
        icon: FileText,
        color: "text-orange-600"
    },
    {
        id: "image-analysis",
        name: "Image Analysis",
        description: "Analyze and process images",
        icon: ImageIcon,
        color: "text-pink-600"
    },
    {
        id: "database-query",
        name: "Database Query",
        description: "Connect and query databases",
        icon: Database,
        color: "text-indigo-600"
    }
];

const AI_AGENTS = [
    {
        id: "agent-1",
        name: "Research Agent",
        description: "Specialized in data research and analysis",
        avatar: "1"
    },
    {
        id: "agent-2",
        name: "Data Scientist",
        description: "Expert in statistical analysis and ML",
        avatar: "2"
    },
    {
        id: "agent-3",
        name: "Business Analyst",
        description: "Focused on business insights and KPIs",
        avatar: "3"
    },
    {
        id: "agent-4",
        name: "Code Assistant",
        description: "Helps with programming and automation",
        avatar: "4"
    },
    {
        id: "agent-5",
        name: "Report Writer",
        description: "Creates comprehensive reports and summaries",
        avatar: "5"
    },
    {
        id: "agent-6",
        name: "Visualization Expert",
        description: "Specializes in charts and data visualization",
        avatar: "6"
    },
    {
        id: "agent-7",
        name: "Quality Checker",
        description: "Reviews and validates data quality",
        avatar: "7"
    },
    {
        id: "agent-8",
        name: "Strategy Advisor",
        description: "Provides strategic recommendations",
        avatar: "8"
    }
];

export function ModelSelectorSheet({
    open,
    onOpenChange,
    activeTab,
    selectedModel,
    selectedTools,
    selectedAgent,
    onModelSelect,
    onToolToggle,
    onAgentSelect
}: ModelSelectorSheetProps) {
    const renderModels = () => (
        <div className="space-y-3">
            {AI_MODELS.map((model) => {
                const IconComponent = model.icon;
                const isSelected = selectedModel === model.id;
                
                return (
                    <Card
                        key={model.id}
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                            isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onModelSelect(model.id)}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg bg-gray-100", model.color)}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{model.name}</h3>
                                    {model.badge && (
                                        <Badge variant="secondary" className="text-xs">
                                            {model.badge}
                                        </Badge>
                                    )}
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary ml-auto" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {model.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );

    const renderTools = () => (
        <div className="space-y-3">
            {AI_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                const isSelected = selectedTools.includes(tool.id);
                
                return (
                    <Card
                        key={tool.id}
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                            isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onToolToggle(tool.id)}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg bg-gray-100", tool.color)}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary ml-auto" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {tool.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );

    const renderAgents = () => (
        <div className="space-y-3">
            {AI_AGENTS.map((agent) => {
                const isSelected = selectedAgent === agent.id;
                
                return (
                    <Card
                        key={agent.id}
                        className={cn(
                            "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                            isSelected 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onAgentSelect(agent.id)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-imad to-maria flex items-center justify-center text-white font-semibold text-sm">
                                {agent.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary ml-auto" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {agent.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );

    const getSheetTitle = () => {
        switch (activeTab) {
            case "models":
                return "Select AI Model";
            case "tools":
                return "Choose Tools";
            case "agents":
                return "Pick an Agent";
            default:
                return "Configuration";
        }
    };

    const getSheetDescription = () => {
        switch (activeTab) {
            case "models":
                return "Choose the AI model that best fits your task";
            case "tools":
                return "Select tools to enhance your AI capabilities";
            case "agents":
                return "Choose a specialized agent for your workflow";
            default:
                return "Configure your AI assistant";
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[80vh] overflow-hidden">
                <SheetHeader className="pb-4">
                    <SheetTitle>{getSheetTitle()}</SheetTitle>
                    <SheetDescription>{getSheetDescription()}</SheetDescription>
                </SheetHeader>
                
                <div className="h-full overflow-y-auto pr-2">
                    {activeTab === "models" && renderModels()}
                    {activeTab === "tools" && renderTools()}
                    {activeTab === "agents" && renderAgents()}
                </div>
            </SheetContent>
        </Sheet>
    );
}