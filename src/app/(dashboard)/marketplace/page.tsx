"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Database,
  Brain,
  Zap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/custom-ui/toast";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: "dataset" | "model" | "template" | "tool";
  price: number;
  rating: number;
  downloads: number;
  author: string;
  authorAvatar: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  thumbnail: string;
  previewImages: string[];
}

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "E-commerce Customer Analytics Dataset",
    description:
      "Comprehensive dataset with customer behavior, purchase history, and demographic data for e-commerce analysis.",
    category: "dataset",
    price: 49,
    rating: 4.8,
    downloads: 1250,
    author: "DataCorp Analytics",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    tags: ["e-commerce", "customer-analytics", "retail", "behavior"],
    featured: true,
    trending: true,
    createdAt: new Date("2024-01-15"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    previewImages: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: "2",
    name: "Advanced Sales Forecasting Model",
    description:
      "Pre-trained machine learning model for accurate sales forecasting with 95% accuracy rate.",
    category: "model",
    price: 99,
    rating: 4.9,
    downloads: 890,
    author: "ML Solutions Inc",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    tags: ["forecasting", "sales", "machine-learning", "prediction"],
    featured: true,
    trending: false,
    createdAt: new Date("2024-01-12"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    previewImages: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: "3",
    name: "Financial Dashboard Template",
    description:
      "Professional financial dashboard template with interactive charts and KPI tracking.",
    category: "template",
    price: 29,
    rating: 4.6,
    downloads: 2100,
    author: "Design Studio Pro",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    tags: ["dashboard", "finance", "template", "visualization"],
    featured: false,
    trending: true,
    createdAt: new Date("2024-01-10"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    previewImages: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: "4",
    name: "Data Cleaning Automation Tool",
    description:
      "Powerful tool for automated data cleaning, validation, and preprocessing with custom rules.",
    category: "tool",
    price: 79,
    rating: 4.7,
    downloads: 650,
    author: "AutoData Labs",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    tags: ["data-cleaning", "automation", "preprocessing", "validation"],
    featured: false,
    trending: false,
    createdAt: new Date("2024-01-08"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    previewImages: ["/placeholder.svg?height=300&width=400"],
  },
  {
    id: "5",
    name: "Social Media Sentiment Dataset",
    description:
      "Large-scale social media sentiment analysis dataset with labeled emotions and topics.",
    category: "dataset",
    price: 39,
    rating: 4.5,
    downloads: 1800,
    author: "Social Analytics Co",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    tags: ["sentiment", "social-media", "nlp", "emotions"],
    featured: false,
    trending: true,
    createdAt: new Date("2024-01-05"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    previewImages: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
];

const categories = [
  { id: "all", name: "All", icon: Globe },
  { id: "dataset", name: "Datasets", icon: Database },
  { id: "model", name: "Models", icon: Brain },
  { id: "template", name: "Templates", icon: BarChart3 },
  { id: "tool", name: "Tools", icon: Zap },
];

const categoryColors = {
  dataset:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  model:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  template:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  tool: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
};

const tabs = [
  { id: "browse", name: "Browse" },
  { id: "featured", name: "Featured" },
  { id: "trending", name: "Trending" },
  { id: "my-purchases", name: "My Purchases" },
];

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");
  const [sortBy, setSortBy] = useState<
    "popular" | "newest" | "rating" | "price"
  >("popular");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesTab =
      activeTab === "browse" ||
      (activeTab === "featured" && item.featured) ||
      (activeTab === "trending" && item.trending) ||
      activeTab === "my-purchases";

    return matchesSearch && matchesCategory && matchesTab;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads;
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "rating":
        return b.rating - a.rating;
      case "price":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const handlePurchase = (item: MarketplaceItem) => {
    showToast.success(
      "Purchase successful!",
      `${item.name} has been added to your library`
    );
  };

  const handlePreview = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const ItemCard = ({ item }: { item: MarketplaceItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 shadow-sm hover:shadow-xl hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
            <img
              src={item.thumbnail || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            {item.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {item.trending && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              className={cn("text-xs border", categoryColors[item.category])}
            >
              {item.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <div className="text-right ml-3">
              <p className="font-bold text-xl text-primary">${item.price}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{item.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="truncate">{item.author}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-6">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-muted/50">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 group-hover:border-primary/50 transition-colors"
              onClick={() => handlePreview(item)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="flex-1 shadow-sm"
              onClick={() => handlePurchase(item)}
            >
              Purchase
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Marketplace
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover datasets, models, templates, and tools for your
                projects
              </p>
            </div>

            <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
              <ExternalLink className="w-4 h-4" />
              Sell Your Work
            </Button>
          </div>

          {/* Vercel-style Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeMarketplaceTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 300,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-0 bg-muted/50 focus:bg-background transition-colors"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-background border-0 shadow-sm"
                >
                  <Filter className="w-4 h-4" />
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setSortBy("popular")}>
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price")}>
                  Lowest Price
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "gap-2 whitespace-nowrap transition-all duration-200",
                    selectedCategory === category.id
                      ? "shadow-sm"
                      : "border-0 bg-muted/50 hover:bg-background hover:shadow-sm"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {sortedItems.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  {selectedItem.name}
                  <Badge
                    className={cn(
                      "text-xs border",
                      categoryColors[selectedItem.category]
                    )}
                  >
                    {selectedItem.category}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base">
                  by {selectedItem.author}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Preview Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedItem.previewImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">
                        {selectedItem.rating}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Download className="w-5 h-5" />
                      <span className="font-bold text-lg">
                        {selectedItem.downloads.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-bold text-lg">
                        {selectedItem.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Created</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-muted/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between w-full pt-6">
                <div className="text-3xl font-bold text-primary">
                  ${selectedItem.price}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    onClick={() => handlePurchase(selectedItem)}
                    className="gap-2 shadow-sm"
                  >
                    Purchase Now
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
