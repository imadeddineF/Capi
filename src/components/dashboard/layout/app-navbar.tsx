"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";

export const DashboardNavbar = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const chatId = searchParams.get("id");
    const [chatTitle, setChatTitle] = useState<string>("Dashboard");

    useEffect(() => {
        if (pathName === "/chat") {
            if (chatId) {
                // Try to load chat title from localStorage
                if (typeof window !== "undefined") {
                    const stored = localStorage.getItem(`chat_${chatId}`);
                    if (stored) {
                        const chat = JSON.parse(stored);
                        setChatTitle(chat.title || "Chat");
                    } else {
                        setChatTitle("New Chat");
                    }
                }
            } else {
                setChatTitle("New Chat");
            }
        } else {
            setChatTitle("Dashboard");
        }
    }, [pathName, chatId]);

    return (
        <nav className="relative w-full z-30 border-b h-14 flex items-center justify-between gap-1 px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="capitalize font-bold">{chatTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
                <ModeToggle />
            </div>
        </nav>
    );
};
