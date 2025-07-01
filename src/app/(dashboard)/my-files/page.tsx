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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Grid3X3,
  List,
  SortAsc,
  FolderPlus,
  Folder,
  Clock,
  Filter,
  Star,
  StarOff,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/custom-ui/toast";

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
  csv: "text-imad",
  xlsx: "text-imad",
  pdf: "text-red-500",
  txt: "text-blue-500",
  docx: "text-blue-500",
  jpg: "text-purple-500",
  png: "text-purple-500",
  folder: "text-maria",
  file: "text-gray-500",
};

export default function MyFiles() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [starred, setStarred] = useState<{ [id: string]: boolean }>({});

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
        ? "text-maria"
        : fileTypeColors[file.fileType || "txt"] || "text-gray-500";

    return <IconComponent className={cn("w-6 h-6", colorClass)} />;
  };

  const handleStarToggle = (fileId: string) => {
    setStarred((prev) => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Files</h1>
              <p className="text-muted-foreground mt-1">
                Manage your data files and folders
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderDialogOpen(true)}
                className="gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="gap-2 bg-imad hover:bg-imad/90"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SortAsc className="w-4 h-4" />
                  Sort by {sortBy}
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

            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-imad hover:bg-imad/90" : ""}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-imad hover:bg-imad/90" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {sortedFiles.length === 0 ? (
          <div className="text-center py-16">
            <FolderPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first file or create a new folder to get started.
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-imad hover:bg-imad/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
              <Button
                onClick={() => setIsCreateFolderDialogOpen(true)}
                variant="outline"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-2"
            )}
          >
            {sortedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "group",
                  viewMode === "list" && "flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg"
                )}
              >
                {viewMode === "grid" ? (
                  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        {getFileIcon(file)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleStarToggle(file.id)}
                          >
                            {starred[file.id] ? (
                              <Star className="w-3 h-3 text-maria fill-maria" />
                            ) : (
                              <StarOff className="w-3 h-3" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="w-3 h-3" />
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

                      <h3 className="font-medium text-sm mb-2 line-clamp-2">
                        {file.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <User className="w-3 h-3" />
                        <span>{file.uploadedBy}</span>
                        {file.size && (
                          <>
                            <span>•</span>
                            <span>{file.size}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {file.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{file.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{file.lastModified.toLocaleDateString()}</span>
                        </div>
                        {file.isShared && (
                          <Badge
                            variant="outline"
                            className="text-xs border-imad/20 text-imad bg-imad/10"
                          >
                            Shared
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    <div className="flex items-center gap-2">
                      {file.isShared && (
                        <Badge
                          variant="outline"
                          className="text-xs border-imad/20 text-imad bg-imad/10"
                        >
                          Shared
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleStarToggle(file.id)}
                      >
                        {starred[file.id] ? (
                          <Star className="w-3 h-3 text-maria fill-maria" />
                        ) : (
                          <StarOff className="w-3 h-3" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-3 h-3" />
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
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
            <Button className="bg-imad hover:bg-imad/90">
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
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
              className="bg-maria hover:bg-maria/90"
              onClick={handleCreateFolder}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}