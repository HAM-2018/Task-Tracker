import {
  Avatar, AvatarFallback} from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import type { FC, ReactElement } from "react";
import { useState } from "react";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { ConnectionsDialog } from "@/components/connections/connectionsDialog";
import { Button } from "@/components/ui/button";

export const UserProfile: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  let username = "Guest";
  if (typeof window !== "undefined") {
    const rawToken = localStorage.getItem("token");
    console.log(JSON.parse(atob(rawToken!.split(".")[1])));
    if (rawToken) {
      try {
        const payload = JSON.parse(atob(rawToken.split(".")[1]));
        username = payload.username || "Guest";
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }

  return (
    <div className="flex flex-col w-full items-center pt-4">
      <Avatar className={`mb-4 ${cn("h-20", "w-20")}`}>
        <AvatarFallback className="text-2xl font-semibold bg-violet-600">
          {username.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <h4>Hello, {username}</h4>
      <Button className="mt-4" variant="outline" onClick={() => setOpen(true)}>
        Connections
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <ConnectionsDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> for profile pics (above Fallback)