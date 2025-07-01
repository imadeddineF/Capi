"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Search,
  MoreVertical,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Share2,
  Trash2,
  Eye,
  Calendar,
  User,
  HardDrive,
  Grid3X3,
  List,
  SortAsc,
  FolderPlus,
  Folder,
  Clock,
  Filter,
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/custom-ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: "csv" | "xlsx" | "pdf" | "txt" | "jpg" | "png" | "docx";
  size?: string;
  uploadedAt: Date;
  lastModified: Date;
  uploadedBy: string;
  tags: string[];
  isShared: boolean;
  thumbnail?: string;
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Sales Data Q4 2024",
    type: "file",
    fileType: "csv",
    size: "2.4 MB",
    uploadedAt: new Date("2024-01-15"),
    lastModified: new Date("2024-01-20"),
    uploadedBy: "John Doe",
    tags: ["sales", "quarterly", "analytics"],
    isShared: true,
  },
  {
    id: "2",
    name: "Customer Analysis",
    type: "folder",
    uploadedAt: new Date("2024-01-10"),
    lastModified: new Date("2024-01-18"),
    uploadedBy: "Jane Smith",
    tags: ["customer", "analysis"],
    isShared: false,
  },
  {
    id: "3",
    name: "Marketing Report",
    type: "file",
    fileType: "pdf",
    size: "1.8 MB",
    uploadedAt: new Date("2024-01-12"),
    lastModified: new Date("2024-01-16"),
    uploadedBy: "Mike Johnson",
    tags: ["marketing", "report"],
    isShared: true,
  },
  {
    id: "4",
    name: "Product Images",
    type: "folder",
    uploadedAt: new Date("2024-01-08"),
    lastModified: new Date("2024-01-14"),
    uploadedBy: "Sarah Wilson",
    tags: ["images", "products"],
    isShared: false,
  },
  {
    id: "5",
    name: "Financial Dashboard",
    type: "file",
    fileType: "xlsx",
    size: "3.2 MB",
    uploadedAt: new Date("2024-01-05"),
    lastModified: new Date("2024-01-12"),
    uploadedBy: "David Brown",
    tags: ["finance", "dashboard"],
    isShared: true,
  },
];

const fileTypeIcons = {
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  pdf: FileText,
  txt: FileText,
  docx: FileText,
  jpg: ImageIcon,
  png: ImageIcon,
  folder: Folder,
  file: File,
};

const fileTypeColors = {
  csv: "text-imad dark:text-imad",
  xlsx: "text-imad dark:text-imad",
  pdf: "text-red-600 dark:text-red-400",
  txt: "text-blue-600 dark:text-blue-400",
  docx: "text-blue-600 dark:text-blue-400",
  jpg: "text-purple-600 dark:text-purple-400",
  png: "text-purple-600 dark:text-purple-400",
  folder: "text-yellow-600 dark:text-yellow-400",
  file: "text-maria dark:text-maria",
};

const tabs = [
  { id: "all", name: "All Files" },
  { id: "recent", name: "Recent" },
  { id: "shared", name: "Shared" },
  { id: "starred", name: "Starred" },
];

export default function MyFiles() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starred, setStarred] = useState<{ [id: string]: boolean }>({});

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" &&
        new Date().getTime() - file.lastModified.getTime() <
          7 * 24 * 60 * 60 * 1000) ||
      (activeTab === "shared" && file.isShared) ||
      activeTab === "starred";

    return matchesSearch && matchesTab;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return b.lastModified.getTime() - a.lastModified.getTime();
      case "size":
        if (!a.size || !b.size) return 0;
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  const handleFileAction = (action: string, fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    switch (action) {
      case "download":
        showToast.success("Download started", `Downloading ${file.name}`);
        break;
      case "share":
        showToast.success("Link copied", "Share link copied to clipboard");
        break;
      case "delete":
        setFiles(files.filter((f) => f.id !== fileId));
        showToast.success("File deleted", `${file.name} has been deleted`);
        break;
      case "view":
        showToast.info("Opening file", `Opening ${file.name}`);
        break;
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName,
      type: "folder",
      uploadedAt: new Date(),
      lastModified: new Date(),
      uploadedBy: "You",
      tags: [],
      isShared: false,
    };

    setFiles([newFolder, ...files]);
    setNewFolderName("");
    setIsCreateFolderDialogOpen(false);
    showToast.success("Folder created", `${newFolderName} has been created`);
  };

  const getFileIcon = (file: FileItem) => {
    const IconComponent =
      file.type === "folder"
        ? Folder
        : fileTypeIcons[file.fileType || "txt"] || File;

    const colorClass =
      file.type === "folder"
        ? "text-yellow-600 dark:text-yellow-400"
        : fileTypeColors[file.fileType || "txt"] || "text-gray-600";

    return <IconComponent className={cn("w-8 h-8", colorClass)} />;
  };

  const handleStarToggle = (fileId: string) => {
    setStarred((prev) => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  const FileCard = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {file.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <User className="w-3 h-3" />
                  <span>{file.uploadedBy}</span>
                  {file.size && (
                    <>
                      <span>•</span>
                      <span>{file.size}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleFileAction("view", file.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFileAction("download", file.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFileAction("share", file.id)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleFileAction("delete", file.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap gap-1">
              {file.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-muted/50"
                >
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{file.tags.length - 2}
                </Badge>
              )}
            </div>
            {file.isShared && (
              <Badge
                variant="outline"
                className="text-xs border-imad/20 text-imad bg-imad/10 dark:border-imad/30 dark:text-imad dark:bg-imad/10"
              >
                Shared
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{file.lastModified.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FileListItem = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="flex items-center gap-4 p-4 hover:bg-muted/30 rounded-lg transition-all duration-200">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {getFileIcon(file)}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate group-hover:text-primary transition-colors">
              {file.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{file.uploadedBy}</span>
              <span>•</span>
              <span>{file.lastModified.toLocaleDateString()}</span>
              {file.size && (
                <>
                  <span>•</span>
                  <span>{file.size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {file.isShared && (
            <Badge
              variant="outline"
              className="text-xs border-imad/20 text-imad bg-imad/10 dark:border-imad/30 dark:text-imad dark:bg-imad/10"
            >
              Shared
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleFileAction("view", file.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFileAction("download", file.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFileAction("share", file.id)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleFileAction("delete", file.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-imad">My Files</h1>
            <Badge className="bg-maria/10 text-maria border-maria/20">
              Beta
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateFolderDialogOpen(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2 text-maria" /> New Folder
            </Button>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="bg-imad text-white hover:bg-imad/90"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>

        {/* Filter/Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium",
                  activeTab === tab.id
                    ? "bg-imad text-white"
                    : "bg-muted text-maria border-maria/20 hover:bg-maria/10 hover:text-maria"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SortAsc className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>
                  Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              className={
                viewMode === "grid"
                  ? "bg-maria text-white"
                  : "bg-muted text-maria border-maria/20 hover:bg-maria/10 hover:text-maria"
              }
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              className={
                viewMode === "list"
                  ? "bg-maria text-white"
                  : "bg-muted text-maria border-maria/20 hover:bg-maria/10 hover:text-maria"
              }
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Drag-and-drop upload area */}
        <AnimatePresence>
          {isUploadDialogOpen && (
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                  <DialogDescription>
                    Drag and drop files here or click to select files.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-imad/40 rounded-xl p-8 bg-imad/5 cursor-pointer hover:bg-imad/10 transition min-h-[180px]">
                  <Upload className="w-10 h-10 text-imad mb-2" />
                  <span className="text-imad font-medium">
                    Drop files here or click to upload
                  </span>
                  <Input type="file" multiple className="mt-4" />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsUploadDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-imad text-white hover:bg-imad/90">
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Create Folder Dialog */}
        <AnimatePresence>
          {isCreateFolderDialogOpen && (
            <Dialog
              open={isCreateFolderDialogOpen}
              onOpenChange={setIsCreateFolderDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="mb-4"
                />
                <DialogFooter>
                  <Button
                    onClick={() => setIsCreateFolderDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-maria text-white hover:bg-maria/90"
                    onClick={() => {
                      if (newFolderName.trim()) {
                        setFiles([
                          ...files,
                          {
                            id: Math.random().toString(),
                            name: newFolderName,
                            type: "folder",
                            uploadedAt: new Date(),
                            lastModified: new Date(),
                            uploadedBy: "You",
                            tags: [],
                            isShared: false,
                          },
                        ]);
                        setNewFolderName("");
                        setIsCreateFolderDialogOpen(false);
                        showToast.success(
                          "Folder created!",
                          `Created folder '${newFolderName}'.`
                        );
                      }
                    }}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Loading/Error State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-imad mb-4"></div>
            <span className="text-maria">Loading files...</span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-destructive mb-2">{error}</span>
            <Button variant="outline" onClick={() => setError(null)}>
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <FolderPlus className="w-16 h-16 text-maria mb-4" />
            <h2 className="text-xl font-bold mb-2 text-maria">
              No files found
            </h2>
            <p className="text-muted-foreground mb-4">
              Upload your first file or create a new folder to get started.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-imad text-white hover:bg-imad/90"
              >
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
              <Button
                onClick={() => setIsCreateFolderDialogOpen(true)}
                className="bg-maria text-white hover:bg-maria/90"
              >
                <FolderPlus className="w-4 h-4 mr-2" /> New Folder
              </Button>
            </div>
          </div>
        )}

        {/* Files Grid/List */}
        {!loading && !error && sortedFiles.length > 0 && (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            )}
          >
            {sortedFiles.map((file) => (
              <Card key={file.id} className="relative group overflow-hidden">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-lg p-2 bg-muted",
                        fileTypeColors[file.fileType || file.type]
                      )}
                    >
                      {React.createElement(
                        fileTypeIcons[file.fileType || file.type] || File,
                        { className: "w-6 h-6" }
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate text-imad">
                          {file.name}
                        </span>
                        {file.isShared && (
                          <Badge
                            variant="outline"
                            className="text-xs border-imad/20 text-imad bg-imad/10 ml-1"
                          >
                            Shared
                          </Badge>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() => handleStarToggle(file.id)}
                            >
                              {starred[file.id] ? (
                                <Star className="w-4 h-4 text-maria fill-maria" />
                              ) : (
                                <StarOff className="w-4 h-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {starred[file.id] ? "Unstar" : "Star"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground mt-1">
                        <User className="w-3 h-3 mr-1" /> {file.uploadedBy}
                        <Clock className="w-3 h-3 ml-2 mr-1" />{" "}
                        {file.uploadedAt.toLocaleDateString()}
                        <Calendar className="w-3 h-3 ml-2 mr-1" />{" "}
                        {file.lastModified.toLocaleDateString()}
                        {file.size && <span className="ml-2">{file.size}</span>}
                      </div>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {file.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-maria/10 text-maria border-maria/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-imad/10"
                          onClick={() =>
                            showToast.info("Preview", `Previewing ${file.name}`)
                          }
                        >
                          <Eye className="w-4 h-4 text-maria" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Preview</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-imad/10"
                          onClick={() =>
                            showToast.success(
                              "Download",
                              `Downloading ${file.name}`
                            )
                          }
                        >
                          <Download className="w-4 h-4 text-imad" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-maria/10"
                          onClick={() =>
                            showToast.info("Share", `Sharing ${file.name}`)
                          }
                        >
                          <Share2 className="w-4 h-4 text-maria" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-destructive/10"
                          onClick={() =>
                            showToast.error("Deleted", `${file.name} deleted!`)
                          }
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
