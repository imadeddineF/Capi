"use client";

import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  NodeProps,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { Bot, User, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatFlowProps {
  messages: ChatMessage[];
  className?: string;
}

// Custom User Node
const UserNode = ({
  data,
}: {
  data: { content: string; timestamp: string };
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-imad text-white rounded-lg p-3 shadow-lg min-w-[200px] max-w-[300px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4" />
        <span className="text-xs font-medium">User</span>
        <span className="text-xs opacity-75">{data.timestamp}</span>
      </div>
      <p className="text-sm leading-relaxed">{data.content}</p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </motion.div>
  );
};

// Custom Assistant Node
const AssistantNode = ({
  data,
}: {
  data: { content: string; timestamp: string };
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[200px] max-w-[300px]"
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-4 h-4 text-imad" />
        <span className="text-xs font-medium">Assistant</span>
        <span className="text-xs text-muted-foreground">{data.timestamp}</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{data.content}</p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </motion.div>
  );
};

// Custom Summary Node
const SummaryNode = ({ data }: { data: { content: string } }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-maria/10 border border-maria/20 rounded-lg p-4 shadow-lg min-w-[250px] max-w-[350px]"
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-maria" />
        <span className="text-sm font-medium text-maria">
          Conversation Summary
        </span>
      </div>
      <p className="text-sm text-foreground">{data.content}</p>
    </motion.div>
  );
};

const nodeTypes = {
  userNode: UserNode,
  assistantNode: AssistantNode,
  summaryNode: SummaryNode,
};

export function ChatFlow({ messages, className }: ChatFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    let yPosition = 0;
    const nodeSpacing = 150;

    messages.forEach((message, index) => {
      const nodeId = `node-${message.id}`;
      const isUser = message.role === "user";

      // Create node
      flowNodes.push({
        id: nodeId,
        type: isUser ? "userNode" : "assistantNode",
        position: {
          x: isUser ? 50 : 400,
          y: yPosition,
        },
        data: {
          content:
            message.content.length > 150
              ? message.content.substring(0, 150) + "..."
              : message.content,
          timestamp: message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      });

      // Create edge to next message
      if (index < messages.length - 1) {
        flowEdges.push({
          id: `edge-${index}`,
          source: nodeId,
          target: `node-${messages[index + 1].id}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
        });
      }

      yPosition += nodeSpacing;
    });

    // Add summary node if there are messages
    if (messages.length > 0) {
      const summaryContent = `Conversation with ${messages.length} messages. Topics discussed include data analysis and insights.`;

      flowNodes.push({
        id: "summary-node",
        type: "summaryNode",
        position: { x: 225, y: yPosition + 50 },
        data: {
          content: summaryContent,
        },
      });

      // Connect last message to summary
      if (messages.length > 0) {
        flowEdges.push({
          id: "edge-to-summary",
          source: `node-${messages[messages.length - 1].id}`,
          target: "summary-node",
          type: "smoothstep",
          animated: true,
          style: { stroke: "#ec4899", strokeWidth: 2 },
        });
      }
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [messages]);

  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-64 text-muted-foreground",
          className
        )}
      >
        <div className="text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No conversation to visualize</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-96 bg-background border rounded-lg overflow-hidden",
        className
      )}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.3}
        maxZoom={1.5}
        className="bg-background"
      >
        <Background color="#aaa" gap={16} />
        <Controls
          className="bg-card border border-border rounded-lg shadow-sm"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
