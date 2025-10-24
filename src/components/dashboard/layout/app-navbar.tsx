"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";
import { Button } from "@/components/ui/button";
import {
	Share2,
	Download,
	Copy,
	Trash2,
	MoreHorizontal,
	PanelRight,
	Wifi,
	WifiOff,
	CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUrlParam } from "@/utils/url-params";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/custom-ui/toast";
import { useRightSidebar } from "../chat/right-sidebar-context";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Loader from "@/components/shared/loader";
import { ModelSelectorDropdown } from "@/components/dashboard/chat/model-selector-dropdown";
import { v4 as uuidv4 } from "uuid";

interface Chat {
	id: string;
	title: string;
	messages: any[];
	createdAt: Date;
}

interface DatabaseResponse {
	response: string;
	history: Array<{
		role: "user" | "ai";
		content: string;
	}>;
	total_revenue?: number;
	top_customers?: Array<{
		customer_name: string;
		total: number;
	}>;
}

export const DashboardNavbar = () => {
	const pathName = usePathname();
	const router = useRouter();
	const [copy] = useCopyToClipboard();
	const [chatId, setChatId] = useState<string | null>(null);
	const [chatTitle, setChatTitle] = useState<string>("Dashboard");
	const [currentChat, setCurrentChat] = useState<Chat | null>(null);
	const [isConnected, setIsConnected] = useState(true);
	const [selectedLanguage, setSelectedLanguage] = useState("Python");
	const { isOpen: isRightPanelOpen, toggle: toggleRightPanel } =
		useRightSidebar();
	const [dbDialogOpen, setDbDialogOpen] = useState(false);
	const [dbUrl, setDbUrl] = useState("");
	const [dbLoading, setDbLoading] = useState(false);
	const [dbError, setDbError] = useState("");
	const [dbTables, setDbTables] = useState<any[]>([]);
	const [selected, setSelected] = useState<{ [table: string]: string[] }>({});

	// New state for AI model selection and message
	const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
	const [selectedTools, setSelectedTools] = useState<string[]>([
		"data-analysis",
	]);
	const [selectedAgent, setSelectedAgent] = useState("agent-1");
	const [userMessage, setUserMessage] = useState(
		"Who are the top customers by total order value?"
	);
	const [isSendingToChat, setIsSendingToChat] = useState(false);
	const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
	const [loadingStep, setLoadingStep] = useState("");

	// Get chatId from URL parameters using native TypeScript
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

	useEffect(() => {
		if (pathName === "/chat") {
			if (chatId) {
				// Try to load chat from localStorage
				if (typeof window !== "undefined") {
					const stored = localStorage.getItem(`chat_${chatId}`);
					if (stored) {
						const chat = JSON.parse(stored);
						setChatTitle(chat.title || "Chat");
						setCurrentChat(chat);
					} else {
						setChatTitle("New Chat");
						setCurrentChat(null);
					}
				}
			} else {
				setChatTitle("New Chat");
				setCurrentChat(null);
			}
		} else {
			setChatTitle("Dashboard");
			setCurrentChat(null);
		}
	}, [pathName, chatId]);

	// Listen for chat storage changes to update title
	useEffect(() => {
		const handleChatStorageChange = (event: CustomEvent) => {
			if (event.detail.chatId === chatId) {
				// Reload the current chat data
				if (typeof window !== "undefined") {
					const stored = localStorage.getItem(`chat_${chatId}`);
					if (stored) {
						const chat = JSON.parse(stored);
						setChatTitle(chat.title || "Chat");
						setCurrentChat(chat);
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

	// Simulate connection status
	useEffect(() => {
		const interval = setInterval(() => {
			setIsConnected(Math.random() > 0.1); // 90% chance of being connected
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleShare = () => {
		if (chatId) {
			const shareUrl = `${window.location.origin}/chat?id=${chatId}`;
			copy(shareUrl);
			showToast.success(
				"Link copied!",
				"Chat link has been copied to clipboard."
			);
		} else {
			showToast.error(
				"No chat to share",
				"Please start a conversation first."
			);
		}
	};

	const handleCopyLink = () => {
		if (chatId) {
			const shareUrl = `${window.location.origin}/chat?id=${chatId}`;
			copy(shareUrl);
			showToast.success(
				"Link copied!",
				"Chat link has been copied to clipboard."
			);
		} else {
			showToast.error(
				"No chat to copy",
				"Please start a conversation first."
			);
		}
	};

	const handleExportChat = () => {
		if (!currentChat) {
			showToast.error(
				"No chat to export",
				"Please start a conversation first."
			);
			return;
		}

		const chatData = {
			title: currentChat.title,
			messages: currentChat.messages,
			createdAt: currentChat.createdAt,
			exportedAt: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(chatData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${currentChat.title.replace(/[^a-z0-9]/gi, "_")}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		showToast.success(
			"Chat exported!",
			"Your chat has been exported as JSON."
		);
	};

	const handleDeleteChat = () => {
		if (!chatId) {
			showToast.error(
				"No chat to delete",
				"Please start a conversation first."
			);
			return;
		}

		if (
			confirm(
				"Are you sure you want to delete this chat? This action cannot be undone."
			)
		) {
			// Remove from localStorage
			if (typeof window !== "undefined") {
				localStorage.removeItem(`chat_${chatId}`);
			}

			// Redirect to new chat
			router.push("/chat");

			showToast.success(
				"Chat deleted!",
				"The chat has been permanently deleted."
			);
		}
	};

	const handleLanguageChange = (language: string) => {
		setSelectedLanguage(language);
		showToast.success(
			"Language changed!",
			`Switched to ${language} for code generation.`
		);
	};

	const getConnectionStatus = () => {
		if (isConnected) {
			return {
				text: "Connected",
				icon: <Wifi className="w-4 h-4" />,
				variant: "default" as const,
				className: "text-imad border-imad/20 bg-imad/10",
			};
		} else {
			return {
				text: "Disconnected",
				icon: <WifiOff className="w-4 h-4" />,
				variant: "destructive" as const,
				className: "text-red-600 border-red-200 bg-red-50",
			};
		}
	};

	// const connectionStatus = getConnectionStatus();

	const handleDbConnect = async () => {
		setDbLoading(true);
		setDbError("");
		setDbTables([]);
		try {
			// TODO: Call API route to fetch tables/columns from Neon DB
			// Example: const res = await fetch("/api/neon-tables", { method: "POST", body: JSON.stringify({ dbUrl }) });
			// const data = await res.json();
			// setDbTables(data.tables);
			// For now, mock:
			setTimeout(() => {
				setDbTables([
					{
						name: "orders",
						columns: [
							"id",
							"customer_name",
							"quantity",
							"price",
							"order_date",
						],
					},
					{ name: "users", columns: ["id", "name", "email"] },
				]);
				setDbLoading(false);
			}, 1200);
		} catch {
			setDbError("Failed to connect to database.");
			setDbLoading(false);
		}
	};

	const handleSelect = (table: string, column: string) => {
		setSelected((prev) => {
			const cols = prev[table] || [];
			return {
				...prev,
				[table]: cols.includes(column)
					? cols.filter((c) => c !== column)
					: [...cols, column],
			};
		});
	};

	const handleSendToChat = async () => {
		if (
			!dbUrl ||
			Object.keys(selected).length === 0 ||
			!userMessage.trim()
		) {
			showToast.error(
				"Missing information",
				"Please fill in all required fields."
			);
			return;
		}

		setIsSendingToChat(true);
		setShowLoadingOverlay(true);
		setLoadingStep("Connecting to database...");

		try {
			// Prepare the payload
			const payload = {
				session_id: "chat-user-1",
				connection_string: dbUrl,
				selections: Object.entries(selected).map(
					([table, columns]) => ({
						table,
						columns,
					})
				),
				message: userMessage.trim(),
				model: selectedModel,
			};

			// Simulate loading steps
			setTimeout(() => {
				setLoadingStep("Processing query...");
			}, 800);

			setTimeout(() => {
				setLoadingStep("Analyzing data with AI...");
			}, 2000);

			setTimeout(() => {
				setLoadingStep("Generating insights...");
			}, 3500);

			// Call the backend endpoint
			const response = await fetch("/api/query-database", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: DatabaseResponse = await response.json();
			console.log("Received API response:", data);

			// Create a new chat with the response
			const newChatId = uuidv4();
			console.log("Generated new chat ID:", newChatId);

			// First, create a chat with just the user message and loading state
			const initialChat: Chat = {
				id: newChatId,
				title:
					userMessage.length > 50
						? userMessage.substring(0, 50) + "..."
						: userMessage,
				messages: [
					{
						id: uuidv4(),
						content: userMessage,
						role: "user",
						timestamp: new Date(),
					},
				],
				createdAt: new Date(),
			};

			// Save the initial chat to localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem(
					`chat_${newChatId}`,
					JSON.stringify(initialChat)
				);

				// Dispatch event to notify about new chat creation
				window.dispatchEvent(
					new CustomEvent("chatStorageChanged", {
						detail: {
							chatId: newChatId,
							action: "create",
							newChat: initialChat,
						},
					})
				);
				console.log(
					"Dispatched chatStorageChanged event for initial chat"
				);
			}

			// Close the dialog and reset form
			setDbDialogOpen(false);
			setDbUrl("");
			setSelected({});
			setUserMessage("Who are the top customers by total order value?");

			// Navigate to the new chat first
			console.log("Navigating to new chat:", `/chat?id=${newChatId}`);
			router.push(`/chat?id=${newChatId}`);

			// Save the complete chat with AI response immediately
			const finalChat: Chat = {
				...initialChat,
				messages: [
					...initialChat.messages,
					{
						id: uuidv4(),
						content: data.response,
						role: "assistant",
						timestamp: new Date(),
						// Add structured data if available
						...(data.top_customers && {
							structuredData: {
								type: "top_customers",
								data: data.top_customers,
								totalRevenue: data.total_revenue,
							},
						}),
					},
				],
			};

			// Save the final chat to localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem(
					`chat_${newChatId}`,
					JSON.stringify(finalChat)
				);
				console.log("Saved final chat to localStorage:", finalChat);
			}

			// Close the dialog and reset form
			setDbDialogOpen(false);
			setDbUrl("");
			setSelected({});
			setUserMessage("Who are the top customers by total order value?");

			setShowLoadingOverlay(false);
			setLoadingStep("");

			showToast.success(
				"Chat created!",
				"Your database query has been processed and a new chat has been created."
			);

			// Reload the page to show the new chat smoothly
			setTimeout(() => {
				window.location.href = `/chat?id=${newChatId}`;
			}, 1000);
		} catch (error) {
			console.error("Error sending to chat:", error);
			setShowLoadingOverlay(false);
			setLoadingStep("");
			showToast.error(
				"Failed to process query",
				"There was an error processing your database query. Please try again."
			);
		} finally {
			setIsSendingToChat(false);
		}
	};

	return (
		<nav className="sticky top-0 z-40 w-full border-b h-16 flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
				<SidebarTrigger />

				<Button
					variant="outline"
					size="sm"
					className="gap-2 text-imad border-imad/20 bg-imad/10 hover:bg-imad/20 hover:text-imad hidden sm:flex"
					onClick={() => setDbDialogOpen(true)}
				>
					Connect
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2 hidden md:flex">
							{selectedLanguage}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Code Language</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => handleLanguageChange("Python")}
						>
							Python
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleLanguageChange("R")}
						>
							R
						</DropdownMenuItem>
						{/* <DropdownMenuItem
              onClick={() => handleLanguageChange("JavaScript")}
            >
              JavaScript
            </DropdownMenuItem> */}
						<DropdownMenuItem
							onClick={() => handleLanguageChange("SQL")}
						>
							SQL
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<h1 className="capitalize font-bold text-base sm:text-lg truncate max-w-[200px] sm:max-w-none">{chatTitle}</h1>

			<div className="flex items-center gap-1 flex-1 justify-end min-w-0">
				<ModeToggle />

				<Button
					variant="outline"
					size="sm"
					className="gap-2 hidden lg:flex"
					onClick={handleShare}
				>
					<Share2 className="w-4 h-4" />
					<span className="hidden xl:inline">Share</span>
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem
							className="gap-2"
							onClick={handleExportChat}
						>
							<Download className="w-4 h-4" />
							Export Chat
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2"
							onClick={handleCopyLink}
						>
							<Copy className="w-4 h-4" />
							Copy Link
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 lg:hidden"
							onClick={handleShare}
						>
							<Share2 className="w-4 h-4" />
							Share
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 text-destructive"
							onClick={handleDeleteChat}
						>
							<Trash2 className="w-4 h-4" />
							Delete Chat
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant="ghost"
					size="sm"
					className="gap-2 hidden sm:flex"
					onClick={toggleRightPanel}
				>
					<PanelRight
						className={`w-4 h-4 transition-transform ${
							isRightPanelOpen ? "rotate-180" : ""
						}`}
					/>
				</Button>
			</div>

			<Dialog open={dbDialogOpen} onOpenChange={setDbDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Connect to Database & Query</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{/* Database Connection */}
						<div className="space-y-3">
							<Label htmlFor="db-url">
								Database Connection String
							</Label>
							<Input
								id="db-url"
								placeholder="Enter Neon DB PostgreSQL URL..."
								value={dbUrl}
								onChange={(e) => setDbUrl(e.target.value)}
								disabled={dbLoading}
							/>
							<Button
								onClick={handleDbConnect}
								disabled={dbLoading || !dbUrl}
								className="w-full"
							>
								{dbLoading ? <Loader /> : "Fetch Tables"}
							</Button>
							{dbError && (
								<div className="text-red-500 text-sm">
									{dbError}
								</div>
							)}
						</div>

						{/* Table/Column Selection */}
						{dbTables.length > 0 && (
							<div className="space-y-3">
								<Label>Select Tables & Columns</Label>
								<div className="max-h-48 overflow-y-auto border rounded p-3 bg-muted/20">
									{dbTables.map((table) => (
										<div
											key={table.name}
											className="mb-3 last:mb-0"
										>
											<div className="font-semibold mb-2 text-sm">
												{table.name}
											</div>
											<div className="flex flex-wrap gap-2">
												{table.columns.map(
													(col: string) => (
														<label
															key={col}
															className="flex items-center gap-1"
														>
															<Checkbox
																checked={
																	selected[
																		table
																			.name
																	]?.includes(
																		col
																	) || false
																}
																onCheckedChange={() =>
																	handleSelect(
																		table.name,
																		col
																	)
																}
															/>
															<span className="text-xs">
																{col}
															</span>
														</label>
													)
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* AI Model Selection */}
						<div className="space-y-3">
							<Label>AI Configuration</Label>
							<ModelSelectorDropdown
								selectedModel={selectedModel}
								selectedTools={selectedTools}
								selectedAgent={selectedAgent}
								onModelSelect={setSelectedModel}
								onToolToggle={(tool) =>
									setSelectedTools((prev) =>
										prev.includes(tool)
											? prev.filter((t) => t !== tool)
											: [...prev, tool]
									)
								}
								onAgentSelect={setSelectedAgent}
							/>
						</div>

						{/* User Message */}
						<div className="space-y-3">
							<Label htmlFor="user-message">Your Question</Label>
							<Textarea
								id="user-message"
								placeholder="What would you like to know about your data?"
								value={userMessage}
								onChange={(e) => setUserMessage(e.target.value)}
								className="min-h-[80px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={handleSendToChat}
							disabled={
								Object.keys(selected).length === 0 ||
								!dbUrl ||
								!userMessage.trim() ||
								isSendingToChat
							}
							className="w-full"
						>
							{isSendingToChat ? (
								<>
									<Loader />
									<span className="ml-2">Processing...</span>
								</>
							) : (
								"Send to Chat"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Loading Overlay */}
			{showLoadingOverlay && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<div className="bg-card border rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
						<div className="text-center space-y-4">
							<div className="relative">
								<div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
								<div className="absolute inset-0 flex items-center justify-center">
									<CheckCircle className="w-8 h-8 text-primary" />
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-lg font-semibold">
									Processing Your Query
								</h3>
								<p className="text-muted-foreground text-sm">
									{loadingStep}
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>Connecting to database...</span>
									<span className="text-primary">✓</span>
								</div>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>Analyzing data...</span>
									<span className="text-primary">✓</span>
								</div>
								<div className="flex justify-between text-xs">
									<span>Generating insights...</span>
									<span className="text-primary animate-pulse">
										●
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};
