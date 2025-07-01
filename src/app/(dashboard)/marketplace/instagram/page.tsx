import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function InstagramMarketplacePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image
              src="/logo-icon.svg"
              alt="Instagram"
              width={48}
              height={48}
            />
            <CardTitle>Instagram Integration</CardTitle>
            <Badge className="ml-2">Tool</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Automate posts, analyze engagement, and manage DMs with Instagram
            business tools. Grow your audience and streamline your social media
            workflow.
          </p>
          <ul className="list-disc pl-6 mb-6 text-muted-foreground">
            <li>Automated post scheduling</li>
            <li>DM management and auto-replies</li>
            <li>Engagement analytics</li>
            <li>Hashtag and trend suggestions</li>
            <li>Integration with marketing tools</li>
          </ul>
          <Button className="w-full bg-imad hover:bg-imad/90">
            Add to Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
