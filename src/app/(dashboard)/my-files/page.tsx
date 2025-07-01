"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Download,
  Share2,
  Trash2,
  Eye,
  Calendar,
  User,
  HardDrive,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  FolderPlus,
  Folder,
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
  jpg: Image,
  png: Image,
  folder: Folder,
};

const fileTypeColors = {
  csv: "text-green-600",
  xlsx: "text-green-600",
  pdf: "text-red-600",
  txt: "text-blue-600",
  docx: "text-blue-600",
  jpg: "text-purple-600",
  png: "text-purple-600",
  folder: "text-yellow-600",
};

export default function MyFiles() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "files" && file.type === "file") ||
      (selectedTab === "folders" && file.type === "folder") ||
      (selectedTab === "shared" && file.isShared);

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
        ? "text-yellow-600"
        : fileTypeColors[file.fileType || "txt"] || "text-gray-600";

    return <IconComponent className={cn("w-8 h-8", colorClass)} />;
  };

  const FileCard = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{file.name}</h3>
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
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

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {file.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
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
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Calendar className="w-3 h-3" />
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
      className="group"
    >
      <div className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getFileIcon(file)}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{file.name}</h3>
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

        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {file.isShared && (
            <Badge variant="outline" className="text-xs">
              Shared
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">My Files</h1>
            <p className="text-muted-foreground">
              Manage and organize your data files
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog
              open={isCreateFolderDialogOpen}
              onOpenChange={setIsCreateFolderDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateFolderDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                  >
                    Create Folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                  <DialogDescription>
                    Drag and drop files here or click to browse
                  </DialogDescription>
                </DialogHeader>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drop files here or click to upload
                  </p>
                  <Button variant="outline">Choose Files</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search files and folders..."
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
                  Date Modified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>
                  Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Storage Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Storage Used</p>
                  <p className="text-sm text-muted-foreground">
                    2.4 GB of 10 GB used
                  </p>
                </div>
              </div>
              <div className="w-32 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "24%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid/List */}
        {sortedFiles.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Upload your first file to get started"}
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {sortedFiles.map((file) => (
                  <FileListItem key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
