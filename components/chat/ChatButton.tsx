"use client";

import { useTransition } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startOrGetChat } from "@/lib/actions/chat.actions";
import { useRouter } from "next/navigation";

export default function ChatButton({ ownerId }: { ownerId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize router

  const handleChat = () => {
    startTransition(async () => {
      try {
        // The server now sends the string ID back here
        const chatId = await startOrGetChat(ownerId);

        if (chatId) {
          // The client handles the actual "move" to the new page
          router.push(`/chats/${chatId}`);
        }
      } catch (error: any) {
        // Now it only alerts if there is a REAL error (like DB failure)
        console.error("Failed to start chat:", error);
        alert(error.message || "Something went wrong starting the chat.");
      }
    });
  };

  return (
    <Button
      onClick={handleChat}
      disabled={isPending}
      className="w-full gap-2 h-12 text-base font-semibold shadow-md"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
      {isPending ? "Connecting..." : "Chat Now"}
    </Button>
  );
}
