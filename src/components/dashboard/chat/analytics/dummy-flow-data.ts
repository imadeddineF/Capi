// This file exports dummy React Flow data for testing purposes.
import { Node, Edge } from "@xyflow/react";

export const nodes: Node[] = [
  {
    id: "dataCollection",
    type: "input",
    data: { label: "Data Collection" },
    position: { x: 100, y: 50 },
  },
  {
    id: "websiteAnalytics",
    data: { label: "Website Analytics" },
    position: { x: 100, y: 150 },
  },
  {
    id: "oms",
    data: { label: "Order Management System" },
    position: { x: 100, y: 250 },
  },
  {
    id: "crm",
    data: { label: "Customer Relationship Management" },
    position: { x: 100, y: 350 },
  },
  {
    id: "shippingAPI",
    data: { label: "Shipping Carrier APIs" },
    position: { x: 100, y: 450 },
  },
  {
    id: "paymentAPI",
    data: { label: "Payment Gateway APIs" },
    position: { x: 100, y: 550 },
  },
  {
    id: "inventorySystem",
    data: { label: "Inventory Management System" },
    position: { x: 100, y: 650 },
  },
  {
    id: "dataAnalysis",
    data: { label: "Data Analysis" },
    position: { x: 400, y: 350 },
  },
  {
    id: "aiPrediction",
    data: { label: "AI-Powered Cancellation Prediction" },
    position: { x: 400, y: 150 },
  },
  {
    id: "rootCause",
    data: { label: "Root Cause Analysis" },
    position: { x: 400, y: 250 },
  },
  {
    id: "sentimentAnalysis",
    data: { label: "Sentiment Analysis" },
    position: { x: 400, y: 450 },
  },
  {
    id: "automatedActions",
    data: { label: "Automated Actions" },
    position: { x: 700, y: 350 },
  },
  {
    id: "proactiveComms",
    data: { label: "Proactive Customer Communication" },
    position: { x: 700, y: 150 },
  },
  {
    id: "automatedCS",
    data: { label: "Automated Customer Service" },
    position: { x: 700, y: 250 },
  },
  {
    id: "inventoryOpt",
    data: { label: "Inventory Management Optimization" },
    position: { x: 700, y: 450 },
  },
  {
    id: "shippingOpt",
    data: { label: "Shipping Optimization" },
    position: { x: 700, y: 550 },
  },
  {
    id: "feedbackLoop",
    data: { label: "Feedback Loop" },
    position: { x: 1000, y: 350 },
  },
  {
    id: "continuousMonitoring",
    data: { label: "Continuous Monitoring" },
    position: { x: 1000, y: 150 },
  },
  {
    id: "abTesting",
    data: { label: "A/B Testing" },
    position: { x: 1000, y: 250 },
  },
  {
    id: "customerFeedback",
    data: { label: "Customer Feedback Collection" },
    position: { x: 1000, y: 450 },
  },
];

export const edges: Edge[] = [
  { id: "e1-2", source: "dataCollection", target: "websiteAnalytics" },
  { id: "e1-3", source: "dataCollection", target: "oms" },
  { id: "e1-4", source: "dataCollection", target: "crm" },
  { id: "e1-5", source: "dataCollection", target: "shippingAPI" },
  { id: "e1-6", source: "dataCollection", target: "paymentAPI" },
  { id: "e1-7", source: "dataCollection", target: "inventorySystem" },
  { id: "e2-8", source: "websiteAnalytics", target: "dataAnalysis" },
  { id: "e3-8", source: "oms", target: "dataAnalysis" },
  { id: "e4-8", source: "crm", target: "dataAnalysis" },
  { id: "e5-8", source: "shippingAPI", target: "dataAnalysis" },
  { id: "e6-8", source: "paymentAPI", target: "dataAnalysis" },
  { id: "e7-8", source: "inventorySystem", target: "dataAnalysis" },
  { id: "e8-9", source: "dataAnalysis", target: "aiPrediction" },
  { id: "e8-10", source: "dataAnalysis", target: "rootCause" },
  { id: "e8-11", source: "dataAnalysis", target: "sentimentAnalysis" },
  { id: "e8-12", source: "dataAnalysis", target: "automatedActions" },
  { id: "e9-13", source: "aiPrediction", target: "automatedActions" },
  { id: "e10-14", source: "rootCause", target: "automatedActions" },
  { id: "e11-15", source: "sentimentAnalysis", target: "automatedActions" },
  { id: "e12-16", source: "automatedActions", target: "proactiveComms" },
  { id: "e12-17", source: "automatedActions", target: "automatedCS" },
  { id: "e12-18", source: "automatedActions", target: "inventoryOpt" },
  { id: "e12-19", source: "automatedActions", target: "shippingOpt" },
  { id: "e12-20", source: "automatedActions", target: "feedbackLoop" },
  { id: "e17-20", source: "automatedCS", target: "feedbackLoop" },
  { id: "e18-20", source: "inventoryOpt", target: "feedbackLoop" },
  { id: "e19-20", source: "shippingOpt", target: "feedbackLoop" },
  { id: "e20-21", source: "feedbackLoop", target: "continuousMonitoring" },
  { id: "e20-22", source: "feedbackLoop", target: "abTesting" },
  { id: "e20-23", source: "feedbackLoop", target: "customerFeedback" },
];

const dummyFlowData = { nodes, edges };
export default dummyFlowData;
