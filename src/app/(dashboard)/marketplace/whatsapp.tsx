import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function WhatsAppMarketplacePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image src="/logo-icon.svg" alt="WhatsApp" width={48} height={48} />
            <CardTitle>WhatsApp Integration</CardTitle>
            <Badge className="ml-2">Tool</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Seamlessly connect your business with WhatsApp for customer support
            and marketing. Automate replies, manage conversations, and analyze
            engagement.
          </p>
          <ul className="list-disc pl-6 mb-6 text-muted-foreground">
            <li>Direct messaging with customers</li>
            <li>Automated replies and chatbots</li>
            <li>Broadcast marketing messages</li>
            <li>Analytics dashboard for engagement</li>
            <li>Easy integration with your CRM</li>
          </ul>
          <Button className="w-full bg-imad hover:bg-imad/90">
            Add to Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
