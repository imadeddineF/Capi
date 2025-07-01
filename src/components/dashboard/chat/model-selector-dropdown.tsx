"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorDropdownProps {
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
    description: "Most capable model for complex reasoning",
    icon: Sparkles,
    badge: "Latest",
    color: "text-blue-600",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "High-quality responses for complex tasks",
    icon: Brain,
    badge: "Popular",
    color: "text-purple-600",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Excellent for analysis and creative tasks",
    icon: Zap,
    badge: "New",
    color: "text-orange-600",
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    description: "Balanced performance and speed",
    icon: MessageSquare,
    badge: "",
    color: "text-imad",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's advanced multimodal AI",
    icon: Sparkles,
    badge: "",
    color: "text-red-600",
  },
];

const AI_TOOLS = [
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Statistical analysis and data processing",
    icon: BarChart3,
    color: "text-blue-600",
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute Python code and analyze data",
    icon: Code,
    color: "text-imad",
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for current information",
    icon: Search,
    color: "text-purple-600",
  },
  {
    id: "file-upload",
    name: "File Upload",
    description: "Upload and analyze documents and datasets",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    id: "image-analysis",
    name: "Image Analysis",
    description: "Analyze and process images",
    icon: ImageIcon,
    color: "text-pink-600",
  },
  {
    id: "database-query",
    name: "Database Query",
    description: "Connect and query databases",
    icon: Database,
    color: "text-indigo-600",
  },
];

const AI_AGENTS = [
  {
    id: "agent-1",
    name: "Research Agent",
    description: "Specialized in data research and analysis",
    avatar: "1",
  },
  {
    id: "agent-2",
    name: "Data Scientist",
    description: "Expert in statistical analysis and ML",
    avatar: "2",
  },
  {
    id: "agent-3",
    name: "Business Analyst",
    description: "Focused on business insights and KPIs",
    avatar: "3",
  },
  {
    id: "agent-4",
    name: "Code Assistant",
    description: "Helps with programming and automation",
    avatar: "4",
  },
  {
    id: "agent-5",
    name: "Report Writer",
    description: "Creates comprehensive reports and summaries",
    avatar: "5",
  },
  {
    id: "agent-6",
    name: "Visualization Expert",
    description: "Specializes in charts and data visualization",
    avatar: "6",
  },
];

export function ModelSelectorDropdown({
  selectedModel,
  selectedTools,
  selectedAgent,
  onModelSelect,
  onToolToggle,
  onAgentSelect,
}: ModelSelectorDropdownProps) {
  const getModelName = () => {
    const model = AI_MODELS.find((m) => m.id === selectedModel);
    return model?.name || "GPT-4 Turbo";
  };

  const getAgentName = () => {
    const agent = AI_AGENTS.find((a) => a.id === selectedAgent);
    return agent?.name || "Research Agent";
  };

  return (
    <div className="flex items-center gap-4">
      {/* Model Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className="gap-2 cursor-pointer hover:bg-purple-50 border-purple-200 px-4 py-2 text-purple-700"
          >
            <Sparkles className="w-4 h-4" />
            {getModelName()}
            <ChevronDown className="w-3 h-3" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {AI_MODELS.map((model) => {
            const IconComponent = model.icon;
            const isSelected = selectedModel === model.id;

            return (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelSelect(model.id)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div
                  className={cn("p-1.5 rounded-md bg-gray-100", model.color)}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{model.name}</span>
                    {model.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
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
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className="gap-2 cursor-pointer hover:bg-blue-50 border-blue-200 px-4 py-2 text-blue-700"
          >
            <Settings className="w-4 h-4" />
            Tools ({selectedTools.length})
            <ChevronDown className="w-3 h-3" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {AI_TOOLS.map((tool) => {
            const IconComponent = tool.icon;
            const isSelected = selectedTools.includes(tool.id);

            return (
              <DropdownMenuCheckboxItem
                key={tool.id}
                checked={isSelected}
                onCheckedChange={() => onToolToggle(tool.id)}
                className="flex items-start gap-3 p-3"
              >
                <div className={cn("p-1.5 rounded-md bg-gray-100", tool.color)}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{tool.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Agents Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className="gap-2 cursor-pointer hover:bg-purple-50 border-purple-200 px-4 py-2 text-purple-700"
          >
            <Users className="w-4 h-4" />
            {getAgentName()}
            <ChevronDown className="w-3 h-3" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Agent</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {AI_AGENTS.map((agent) => {
            const isSelected = selectedAgent === agent.id;

            return (
              <DropdownMenuItem
                key={agent.id}
                onClick={() => onAgentSelect(agent.id)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-imad to-maria flex items-center justify-center text-white font-semibold text-xs">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{agent.name}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}