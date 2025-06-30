"use client";

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
    Settings2,
    Monitor,
    Moon,
    Sun,
    Type,
    Palette,
    Layout,
    Eye,
    EyeOff,
    MessageSquare,
    Clock,
    User
} from "lucide-react";

interface DisplayOptionsDropdownProps {
    showTimestamps: boolean;
    showAvatars: boolean;
    compactMode: boolean;
    darkMode: boolean;
    fontSize: "small" | "medium" | "large";
    onToggleTimestamps: () => void;
    onToggleAvatars: () => void;
    onToggleCompactMode: () => void;
    onToggleDarkMode: () => void;
    onFontSizeChange: (size: "small" | "medium" | "large") => void;
}

export function DisplayOptionsDropdown({
    showTimestamps,
    showAvatars,
    compactMode,
    darkMode,
    fontSize,
    onToggleTimestamps,
    onToggleAvatars,
    onToggleCompactMode,
    onToggleDarkMode,
    onFontSizeChange
}: DisplayOptionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Display Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Theme Options */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Theme
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                    checked={darkMode}
                    onCheckedChange={onToggleDarkMode}
                    className="flex items-center gap-2"
                >
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    Dark Mode
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                {/* Layout Options */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Layout
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                    checked={compactMode}
                    onCheckedChange={onToggleCompactMode}
                    className="flex items-center gap-2"
                >
                    <Layout className="w-4 h-4" />
                    Compact Mode
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                    checked={showTimestamps}
                    onCheckedChange={onToggleTimestamps}
                    className="flex items-center gap-2"
                >
                    <Clock className="w-4 h-4" />
                    Show Timestamps
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuCheckboxItem
                    checked={showAvatars}
                    onCheckedChange={onToggleAvatars}
                    className="flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    Show Avatars
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator />
                
                {/* Font Size Options */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Font Size
                </DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => onFontSizeChange("small")}
                    className="flex items-center gap-2"
                >
                    <Type className="w-3 h-3" />
                    Small
                    {fontSize === "small" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onFontSizeChange("medium")}
                    className="flex items-center gap-2"
                >
                    <Type className="w-4 h-4" />
                    Medium
                    {fontSize === "medium" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onFontSizeChange("large")}
                    className="flex items-center gap-2"
                >
                    <Type className="w-5 h-5" />
                    Large
                    {fontSize === "large" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}