"use client";

import * as React from "react";
import {
	LayoutGrid,
	History,
	Workflow,
	Plus,
	Settings,
	ShieldEllipsisIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	useSidebar,
	SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import logoIcon from "../../../../public/logo-icon.svg";
import logoText from "../../../../public/logo-text.svg";
import logoTextDark from "../../../../public/logo-text-dark.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUrlParam } from "@/utils/url-params";
import { useTheme } from "next-themes";

interface Chat {
	id: string;
	title: string;
	messages: any[];
	createdAt: Date;
}

interface HistoryItem {
	title: string;
	url: string;
	date: Date;
	type: string;
	isActive?: boolean;
}

const data = {
	navMain: [
		{
			title: "My History",
			url: "#",
			icon: History,
			isActive: true,
			items: [] as HistoryItem[],
		},
		{
			title: "My Workflows",
			url: "#",
			icon: Workflow,
			isActive: false,
			workflows: [
				{
					name: "Customer Service",
					chats: [
						{
							title: "Support Ticket Analysis",
							url: "/chat?id=support-001",
						},
						{
							title: "Customer Feedback Review",
							url: "/chat?id=feedback-001",
						},
					],
				},
				{
					name: "Data Analysis",
					chats: [
						{
							title: "Sales Report Q4",
							url: "/chat?id=sales-q4-001",
						},
						{
							title: "User Behavior Study",
							url: "/chat?id=behavior-001",
						},
					],
				},
			],
		},
	],
	projects: [
		{
			name: "My files",
			url: "/my-files",
			icon: LayoutGrid,
		},
		{
			name: "Marketplace",
			url: "/marketplace",
			icon: ShieldEllipsisIcon,
		},
		{
			name: "Settings",
			url: "/settings",
			icon: Settings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { open } = useSidebar();
	const { theme } = useTheme();
	const router = useRouter();
	const [historyData, setHistoryData] = React.useState<HistoryItem[]>([]);
	const [currentChatId, setCurrentChatId] = React.useState<string | null>(
		null
	);

	// Load chat history from localStorage
	const loadChatHistory = React.useCallback(() => {
		if (typeof window === "undefined") return [];

		const history: HistoryItem[] = [];
		const keys = Object.keys(localStorage);

		keys.forEach((key) => {
			if (key.startsWith("chat_")) {
				try {
					const stored = localStorage.getItem(key);
					if (stored) {
						const chat: Chat = JSON.parse(stored);
						const chatId = key.replace("chat_", "");

						history.push({
							title: chat.title || "Untitled Chat",
							url: `/chat?id=${chatId}`,
							date: new Date(chat.createdAt),
							type: "chat",
							isActive: chatId === currentChatId,
						});
					}
				} catch (error) {
					console.error("Error parsing chat data:", error);
				}
			}
		});

		// Sort by date (newest first)
		return history.sort((a, b) => b.date.getTime() - a.date.getTime());
	}, [currentChatId]);

	// Get current chat ID from URL
	React.useEffect(() => {
		const id = getUrlParam("id");
		setCurrentChatId(id);
	}, []);

	// Listen for URL changes
	React.useEffect(() => {
		const handlePopState = () => {
			const id = getUrlParam("id");
			setCurrentChatId(id);
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	// Load history when component mounts or currentChatId changes
	React.useEffect(() => {
		const history = loadChatHistory();
		setHistoryData(history);
	}, [loadChatHistory]);

	// Listen for storage changes to update history
	React.useEffect(() => {
		const handleStorageChange = () => {
			const history = loadChatHistory();
			setHistoryData(history);
		};

		const handleChatStorageChange = () => {
			const history = loadChatHistory();
			setHistoryData(history);
		};

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("chatStorageChanged", handleChatStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener(
				"chatStorageChanged",
				handleChatStorageChange
			);
		};
	}, [loadChatHistory]);

	const handleDelete = (title: string) => {
		// Find the chat with this title and delete it from localStorage
		const chatToDelete = historyData.find((item) => item.title === title);
		if (chatToDelete) {
			const chatId = chatToDelete.url.split("=")[1];
			if (typeof window !== "undefined") {
				localStorage.removeItem(`chat_${chatId}`);
			}

			// Update history
			setHistoryData((prev) =>
				prev.filter((item) => item.title !== title)
			);

			// If we're currently viewing the deleted chat, redirect to new chat
			if (chatId === currentChatId) {
				router.push("/chat");
			}
		}
	};

	const handleRename = (oldTitle: string, newTitle: string) => {
		// Find the chat with this title and update it in localStorage
		const chatToRename = historyData.find(
			(item) => item.title === oldTitle
		);
		if (chatToRename) {
			const chatId = chatToRename.url.split("=")[1];
			if (typeof window !== "undefined") {
				const stored = localStorage.getItem(`chat_${chatId}`);
				if (stored) {
					const chat: Chat = JSON.parse(stored);
					chat.title = newTitle;
					localStorage.setItem(
						`chat_${chatId}`,
						JSON.stringify(chat)
					);
				}
			}

			// Update history
			setHistoryData((prev) =>
				prev.map((item) =>
					item.title === oldTitle
						? { ...item, title: newTitle }
						: item
				)
			);
		}
	};

	const handleNewChat = () => {
		// Clear the chat ID from URL and trigger a new chat
		router.push(`/chat`);
		// Dispatch a custom event to notify the chat page
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("newChatRequested"));
		}
	};

	// Update the navMain data with current history
	const updatedNavMain = React.useMemo(
		() => [
			{
				...data.navMain[0],
				items: historyData,
			},
			data.navMain[1],
		],
		[historyData]
	);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader
				className={`border-b h-16 border-border ${
					open ? "px-4 justify-start" : "px-0 justify-center"
				} flex items-center transition-all duration-200`}
			>
				<Link
					href="/chat"
					className="flex items-center gap-1 group w-full"
				>
					<Image
						src={logoIcon}
						alt="logo"
						className={`h-9 w-9 ${!open && "mx-auto"}`}
					/>
					{open && (
						<div className="flex items-center overflow-hidden">
							{theme === "dark" ? (
								<Image
									src={logoTextDark}
									alt="logo"
									className="h-6 animate-in fade-in slide-in-from-left-2 duration-200"
								/>
							) : (
								<Image
									src={logoText}
									alt="logo"
									className="h-6 animate-in fade-in slide-in-from-left-2 duration-200"
								/>
							)}
						</div>
					)}
				</Link>
			</SidebarHeader>

			<SidebarContent className="pt-3 sidebar-toolbar overflow-y-auto">
				<div
					className={`${
						open ? "px-3" : "px-2"
					} mb-3 transition-all duration-200`}
				>
					<Button
						onClick={handleNewChat}
						className={`w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 ${
							!open ? "h-8 w-8 p-0" : ""
						}`}
						size={!open ? "icon" : "default"}
						title={!open ? "New Chat" : undefined}
					>
						<Plus className={`flex-shrink-0 ${!open ? "h-4 w-4" : "h-4 w-4"}`} />
						{open && (
							<span className="animate-in fade-in slide-in-from-left-1 duration-200">
								New Chat
							</span>
						)}
					</Button>
				</div>

				<NavMain
					items={updatedNavMain}
					activeUrl={
						currentChatId ? `/chat?id=${currentChatId}` : undefined
					}
					onDeleteHistoryItem={handleDelete}
					onRenameHistoryItem={handleRename}
				/>

				<NavProjects projects={data.projects} />
			</SidebarContent>

			<SidebarFooter className="border-t border-border transition-all duration-200">
				<NavUser />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
