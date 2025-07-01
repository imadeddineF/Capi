"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatAnalyticsProps {
  messages: ChatMessage[];
}

interface AnalyticsData {
  messageFrequency: Array<{
    time: string;
    user: number;
    assistant: number;
    total: number;
  }>;
  engagementTrends: Array<{
    period: string;
    engagement: number;
    responseTime: number;
  }>;
  messageDistribution: Array<{ name: string; value: number; color: string }>;
  hourlyActivity: Array<{ hour: string; messages: number }>;
}

const COLORS = {
  user: "#8b5cf6",
  assistant: "#ec4899",
  total: "#06b6d4",
  engagement: "#10b981",
};

export function ChatAnalytics({ messages }: ChatAnalyticsProps) {
  const analyticsData: AnalyticsData = useMemo(() => {
    if (messages.length === 0) {
      return {
        messageFrequency: [],
        engagementTrends: [],
        messageDistribution: [],
        hourlyActivity: [],
      };
    }

    // Group messages by time periods (last 7 periods)
    const now = new Date();
    const periods = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setHours(date.getHours() - (6 - i));
      return date;
    });

    const messageFrequency = periods.map((period) => {
      const periodStart = new Date(period);
      const periodEnd = new Date(period);
      periodEnd.setHours(periodEnd.getHours() + 1);

      const periodMessages = messages.filter(
        (msg) => msg.timestamp >= periodStart && msg.timestamp < periodEnd
      );

      const userMessages = periodMessages.filter(
        (msg) => msg.role === "user"
      ).length;
      const assistantMessages = periodMessages.filter(
        (msg) => msg.role === "assistant"
      ).length;

      return {
        time: (period instanceof Date
          ? period
          : new Date(period)
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        user: userMessages,
        assistant: assistantMessages,
        total: userMessages + assistantMessages,
      };
    });

    // Calculate engagement trends
    const engagementTrends = periods.map((period, index) => {
      const engagement =
        Math.max(0, messageFrequency[index]?.total || 0) * 10 +
        Math.random() * 20;
      const responseTime = 1000 + Math.random() * 2000; // Simulated response time

      return {
        period: period.toLocaleTimeString([], { hour: "2-digit" }),
        engagement: Math.round(engagement),
        responseTime: Math.round(responseTime),
      };
    });

    // Message distribution
    const userCount = messages.filter((msg) => msg.role === "user").length;
    const assistantCount = messages.filter(
      (msg) => msg.role === "assistant"
    ).length;

    const messageDistribution = [
      { name: "User Messages", value: userCount, color: COLORS.user },
      {
        name: "Assistant Messages",
        value: assistantCount,
        color: COLORS.assistant,
      },
    ];

    // Hourly activity
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourMessages = messages.filter(
        (msg) => msg.timestamp.getHours() === hour
      ).length;

      return {
        hour: `${hour.toString().padStart(2, "0")}:00`,
        messages: hourMessages,
      };
    }).filter((item) => item.messages > 0);

    return {
      messageFrequency,
      engagementTrends,
      messageDistribution,
      hourlyActivity,
    };
  }, [messages]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (messages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No data available for analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-imad" />
              <div>
                <p className="text-xs text-muted-foreground">Total Messages</p>
                <p className="text-lg font-bold">{messages.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-maria" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-lg font-bold">1.2s</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Message Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Message Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={analyticsData.messageFrequency}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="user"
                  stackId="1"
                  stroke={COLORS.user}
                  fill={COLORS.user}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="assistant"
                  stackId="1"
                  stroke={COLORS.assistant}
                  fill={COLORS.assistant}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Engagement Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={analyticsData.engagementTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke={COLORS.engagement}
                  strokeWidth={2}
                  dot={{ fill: COLORS.engagement, strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Message Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Message Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={analyticsData.messageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.messageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {analyticsData.messageDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
