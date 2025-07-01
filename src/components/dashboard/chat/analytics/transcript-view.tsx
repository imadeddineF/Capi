"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Copy,
  Search,
  User,
  Bot,
  Clock,
  Hash,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { showToast } from "@/components/custom-ui/toast";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isEdited?: boolean;
}

interface TranscriptViewProps {
  messages: ChatMessage[];
  chatTitle: string;
  chatId: string;
}

export function TranscriptView({
  messages,
  chatTitle,
  chatId,
}: TranscriptViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copy, isCopied] = useCopyToClipboard();

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;

    return messages.filter((message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const summary = useMemo(() => {
    const userMessages = messages.filter((msg) => msg.role === "user").length;
    const assistantMessages = messages.filter(
      (msg) => msg.role === "assistant"
    ).length;
    const totalWords = messages.reduce(
      (acc, msg) => acc + msg.content.split(" ").length,
      0
    );
    const avgWordsPerMessage = totalWords / messages.length || 0;

    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    const duration =
      firstMessage && lastMessage
        ? lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime()
        : 0;

    const durationMinutes = Math.round(duration / (1000 * 60));

    return {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      totalWords: Math.round(totalWords),
      avgWordsPerMessage: Math.round(avgWordsPerMessage),
      duration: durationMinutes,
      startTime: firstMessage?.timestamp,
      endTime: lastMessage?.timestamp,
    };
  }, [messages]);

  const handleExportTranscript = () => {
    const transcript = messages
      .map((msg, index) => {
        const timestamp = showTimestamps
          ? `[${msg.timestamp.toLocaleString()}] `
          : "";
        const speaker = msg.role === "user" ? "User" : "Assistant";
        const edited = msg.isEdited ? " (edited)" : "";

        return `${index + 1}. ${timestamp}${speaker}${edited}: ${msg.content}`;
      })
      .join("\n\n");

    const fullTranscript = `# Chat Transcript: ${chatTitle}
Chat ID: ${chatId}
Generated: ${new Date().toLocaleString()}

## Summary
- Total Messages: ${summary.totalMessages}
- User Messages: ${summary.userMessages}
- Assistant Messages: ${summary.assistantMessages}
- Total Words: ${summary.totalWords}
- Average Words per Message: ${summary.avgWordsPerMessage}
- Duration: ${summary.duration} minutes
- Start Time: ${summary.startTime?.toLocaleString() || "N/A"}
- End Time: ${summary.endTime?.toLocaleString() || "N/A"}

## Transcript

${transcript}

---
Exported from Chat Analytics Dashboard`;

    const blob = new Blob([fullTranscript], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-transcript-${chatId}-${
      new Date().toISOString().split("T")[0]
    }.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast.success(
      "Transcript exported!",
      "Your chat transcript has been downloaded as a Markdown file."
    );
  };

  const handleCopyTranscript = () => {
    const transcript = messages
      .map((msg, index) => {
        const timestamp = showTimestamps
          ? `[${msg.timestamp.toLocaleString()}] `
          : "";
        const speaker = msg.role === "user" ? "User" : "Assistant";
        const edited = msg.isEdited ? " (edited)" : "";

        return `${index + 1}. ${timestamp}${speaker}${edited}: ${msg.content}`;
      })
      .join("\n\n");

    copy(transcript);
    showToast.success(
      "Transcript copied!",
      "The transcript has been copied to your clipboard."
    );
  };

  if (messages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No messages to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={showTimestamps ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTimestamps(!showTimestamps)}
                className="h-7 text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Timestamps
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTranscript}
                className="h-7 text-xs"
              >
                {isCopied ? (
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportTranscript}
                className="h-7 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Total Messages</p>
              <p className="font-semibold">{summary.totalMessages}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold">{summary.duration}m</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Words</p>
              <p className="font-semibold">{summary.totalWords}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Words</p>
              <p className="font-semibold">{summary.avgWordsPerMessage}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-imad" />
              <span>{summary.userMessages} messages</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-3 h-3 text-maria" />
              <span>{summary.assistantMessages} messages</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Messages
            {searchQuery && (
              <Badge variant="outline" className="text-xs">
                {filteredMessages.length} of {messages.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span>{index + 1}</span>
                    {showTimestamps && (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp.toLocaleString()}</span>
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      {message.role === "user" ? (
                        <User className="w-3 h-3 text-imad" />
                      ) : (
                        <Bot className="w-3 h-3 text-maria" />
                      )}
                      <span className="capitalize">{message.role}</span>
                      {message.isEdited && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          edited
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-imad/10 border border-imad/20"
                        : "bg-card border border-border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {searchQuery ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: message.content.replace(
                              new RegExp(`(${searchQuery})`, "gi"),
                              '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>

                  {index < filteredMessages.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
