import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function FacebookMarketplacePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image src="/logo-icon.svg" alt="Facebook" width={48} height={48} />
            <CardTitle>Facebook Integration</CardTitle>
            <Badge className="ml-2">Tool</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Connect your Facebook page, automate replies, and access analytics
            in one place. Enhance your social presence and customer engagement.
          </p>
          <ul className="list-disc pl-6 mb-6 text-muted-foreground">
            <li>Page messaging automation</li>
            <li>Comment moderation tools</li>
            <li>Audience insights and analytics</li>
            <li>Ad campaign integration</li>
            <li>Multi-page management</li>
          </ul>
          <Button className="w-full bg-imad hover:bg-imad/90">
            Add to Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
