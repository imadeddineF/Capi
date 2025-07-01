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
  Sparkles,
  BarChart3,
  Database,
  Brain,
  Zap,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/custom-ui/toast";
import Link from "next/link";

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
    id: "whatsapp",
    name: "WhatsApp Integration",
    description:
      "Seamlessly connect your business with WhatsApp for customer support and marketing.",
    category: "tool",
    price: 0,
    rating: 4.9,
    downloads: 3200,
    author: "Meta Platforms",
    authorAvatar: "/logo-icon.svg",
    tags: ["messaging", "integration", "whatsapp"],
    featured: true,
    trending: true,
    createdAt: new Date("2024-01-20"),
    thumbnail: "/logo-icon.svg",
    previewImages: ["/logo-icon.svg"],
  },
  {
    id: "instagram",
    name: "Instagram Integration",
    description:
      "Automate posts, analyze engagement, and manage DMs with Instagram business tools.",
    category: "tool",
    price: 0,
    rating: 4.8,
    downloads: 2100,
    author: "Meta Platforms",
    authorAvatar: "/logo-icon.svg",
    tags: ["social", "integration", "instagram"],
    featured: true,
    trending: false,
    createdAt: new Date("2024-01-18"),
    thumbnail: "/logo-icon.svg",
    previewImages: ["/logo-icon.svg"],
  },
  {
    id: "facebook",
    name: "Facebook Integration",
    description:
      "Connect your Facebook page, automate replies, and access analytics in one place.",
    category: "tool",
    price: 0,
    rating: 4.7,
    downloads: 1800,
    author: "Meta Platforms",
    authorAvatar: "/logo-icon.svg",
    tags: ["social", "integration", "facebook"],
    featured: false,
    trending: true,
    createdAt: new Date("2024-01-15"),
    thumbnail: "/logo-icon.svg",
    previewImages: ["/logo-icon.svg"],
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
  dataset: "bg-imad/10 text-imad border-imad/20",
  model: "bg-maria/10 text-maria border-maria/20",
  template: "bg-hiki/10 text-hiki border-hiki/20",
  tool: "bg-soyed/10 text-soyed border-soyed/20",
};

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

    return matchesSearch && matchesCategory;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Marketplace
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover datasets, models, templates, and tools for your
                projects
              </p>
            </div>

            <Button className="gap-2 bg-imad hover:bg-imad/90">
              <ExternalLink className="w-4 h-4" />
              Sell Your Work
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
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
                    "gap-2 whitespace-nowrap",
                    selectedCategory === category.id
                      ? "bg-imad hover:bg-imad/90"
                      : ""
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
      <div className="p-6">
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
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-imad/20 to-maria/20 flex items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-imad/50" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.featured && (
                        <Badge className="bg-gradient-to-r from-imad to-maria text-white border-0 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {item.trending && (
                        <Badge className="bg-gradient-to-r from-maria to-hiki text-white border-0 shadow-lg">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={cn(
                          "text-xs border",
                          categoryColors[item.category]
                        )}
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                        {item.name}
                      </h3>
                      <div className="text-right ml-3">
                        <p className="font-bold text-xl text-imad">
                          ${item.price}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-maria text-maria" />
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
                        <Badge
                          variant="secondary"
                          className="text-xs bg-muted/50"
                        >
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/marketplace/${item.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-imad hover:bg-imad/90"
                        onClick={() => handlePurchase(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
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
                <div className="aspect-video bg-gradient-to-br from-imad/20 to-maria/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-imad/50" />
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
                      <Star className="w-5 h-5 fill-maria text-maria" />
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
                <div className="text-3xl font-bold text-imad">
                  ${selectedItem.price}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    onClick={() => handlePurchase(selectedItem)}
                    className="gap-2 bg-imad hover:bg-imad/90"
                  >
                    <ShoppingCart className="w-4 h-4" />
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
