"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";
import { Button } from "@/components/ui/button";
import { 
    ArrowLeftToLine, 
    EllipsisVertical, 
    Settings, 
    Share2, 
    Download,
    Copy,
    Trash2,
    MoreHorizontal,
    Workflow,
    BarChart3,
    FileText as FileTextIcon,
    FileCheck,
    ChevronRight,
    PanelBottom,
    PanelLeft,
    PanelRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const DashboardNavbar = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const chatId = searchParams.get("id");
    const [chatTitle, setChatTitle] = useState<string>("Dashboard");
    const [activeTab, setActiveTab] = useState("workflow");

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
        <nav className="relative w-full z-30 border-b h-14 flex items-center justify-between gap-1 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="capitalize font-bold text-lg">{chatTitle}</h1>
            </div>
            
            <div className="flex items-center gap-2">
                <ModeToggle />
                
                <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Export Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete Chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <PanelRight className="w-4 h-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] p-0">
                        <SheetHeader className="p-4 border-b bg-muted/30">
                            <SheetTitle className="text-left">Chat Details</SheetTitle>
                        </SheetHeader>
                        
                        {/* Panel Navigation */}
                        <div className="p-4 border-b">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="workflow" className="text-xs">
                                        <Workflow className="w-3 h-3 mr-1" />
                                        Workflow
                                    </TabsTrigger>
                                    <TabsTrigger value="diagrams" className="text-xs">
                                        <BarChart3 className="w-3 h-3 mr-1" />
                                        Diagrams
                                    </TabsTrigger>
                                    <TabsTrigger value="plain-text" className="text-xs">
                                        <FileTextIcon className="w-3 h-3 mr-1" />
                                        Text
                                    </TabsTrigger>
                                    <TabsTrigger value="resume" className="text-xs">
                                        <FileCheck className="w-3 h-3 mr-1" />
                                        Resume
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <Tabs value={activeTab} className="w-full">
                                <TabsContent value="workflow" className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Workflow className="w-4 h-4" />
                                                Analysis Workflow
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Data Loading</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span>Preprocessing</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span>Analysis</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                    <span>Visualization</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                                                <Download className="w-4 h-4" />
                                                Export Results
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                                                <Share2 className="w-4 h-4" />
                                                Share Analysis
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                                                <Copy className="w-4 h-4" />
                                                Copy Summary
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="diagrams" className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4" />
                                                Generated Charts
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                                <div className="p-3 border rounded-lg bg-muted/30">
                                                    <div className="text-sm font-medium">Sales Trend</div>
                                                    <div className="text-xs text-muted-foreground">Line Chart</div>
                                                </div>
                                                <div className="p-3 border rounded-lg bg-muted/30">
                                                    <div className="text-sm font-medium">Customer Distribution</div>
                                                    <div className="text-xs text-muted-foreground">Pie Chart</div>
                                                </div>
                                                <div className="p-3 border rounded-lg bg-muted/30">
                                                    <div className="text-sm font-medium">Performance Metrics</div>
                                                    <div className="text-xs text-muted-foreground">Bar Chart</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="plain-text" className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <FileTextIcon className="w-4 h-4" />
                                                Text Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm space-y-3">
                                                <p className="text-muted-foreground">
                                                    Analysis of customer feedback data reveals positive sentiment trends...
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Key insights include improved satisfaction scores and reduced response times...
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Recommendations focus on scaling successful initiatives and addressing pain points...
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="resume" className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <FileCheck className="w-4 h-4" />
                                                Session Resume
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Status</span>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                        Active
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Messages</span>
                                                    <span className="font-medium">12</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Created</span>
                                                    <span className="font-medium">2 hours ago</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Last updated</span>
                                                    <span className="font-medium">5 min ago</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Model</span>
                                                    <Badge variant="outline">GPT-4 Turbo</Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Temperature</span>
                                                    <span className="font-medium">0.7</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Max Tokens</span>
                                                    <span className="font-medium">4096</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
};
