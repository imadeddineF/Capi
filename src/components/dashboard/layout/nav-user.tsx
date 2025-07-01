"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/use-auth";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";

export function NavUser() {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { open } = useSidebar();
  const fullName = user?.name || "User";
  const initials =
    fullName
      .split(" ")
      .map((name: string) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully!");
      },
      onError: (error) => {
        toast.error("Logout failed. Please try again.");
        console.error("Error during logout:", error);
      },
    });
  };

  if (!open) {
    // Collapsed: show only avatar, centered, with tooltip
    return (
      <div className="flex justify-center py-4 border-t border-border">
        <div className="group relative">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="w-10 h-10 text-lg bg-muted text-muted-foreground border border-border">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* <div className="absolute left-1/2 z-10 hidden group-hover:flex -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-popover text-popover-foreground text-xs shadow-lg whitespace-nowrap">
            <div className="font-semibold">{fullName}</div>
            <div className="text-muted-foreground">{user?.email}</div>
          </div> */}
        </div>
      </div>
    );
  }

  // Expanded: show full card
  return (
    <div className="w-full px-4 py-3 border-t pt-5">
      {/* <div className="border-b pb-2 mb-3">
        <div className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Settings className="w-4 h-4" />
          Account & billing
        </div>
      </div> */}
      <button
        className="flex items-center gap-2 text-destructive font-medium mb-4 hover:underline"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="w-5 h-5" />
        {logoutMutation.isPending ? "Logging out..." : "Log out"}
      </button>
      <div className="flex border border-border rounded-lg items-center gap-2 mt-2 bg-card p-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="w-10 h-10 text-3xl bg-muted text-muted-foreground border border-border">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-foreground">{fullName}</span>
          <span className="text-xs text-muted-foreground">
            {user?.email || "imad@gmail.com"}
          </span>
        </div>
      </div>
    </div>
  );
}
