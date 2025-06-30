"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function DashboardOverview() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to chat with a new ID when accessing dashboard
        const newChatId = uuidv4();
        router.replace(`/chat?id=${newChatId}`);
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}