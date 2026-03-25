"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { ablyRest } from "@/lib/ably";
import { revalidatePath } from "next/cache"; // 1. Added for sidebar updates

export async function startOrGetChat(ownerId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const currentUserId = session.user.id;
  if (currentUserId === ownerId) throw new Error("You cannot chat with yourself");

  let chat = await prisma.chat.findFirst({
    where: {
      userIDs: { hasEvery: [currentUserId, ownerId] },
    },
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        userIDs: [currentUserId, ownerId],
        seenBy: [currentUserId],
      },
    });
  }
  
  // Revalidate the chat list so the new chat shows up in the sidebar
  revalidatePath("/chats"); 
  return chat.id;
}

export async function sendMessage(chatId: string, text: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Save the new message
  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      userId: session.user.id,
    },
  });

  // 2. Update the Chat meta-data
  // Explicitly updating "updatedAt" (or Prisma does it automatically if set in schema)
  // so the sidebar can sort by the most recent message.
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      lastMessage: text,
      seenBy: [session.user.id],
      updatedAt: new Date(), // Forces the chat to the top of the list
    },
  });

  // 3. Broadcast to Ably
  const channel = ablyRest.channels.get(`chat:${chatId}`);
  await channel.publish("message", message);

  // 4. Refresh the sidebar data so "lastMessage" updates for the sender
  revalidatePath("/chats");

  return message;
}
export async function getUnreadCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 0;

  const count = await prisma.chat.count({
    where: {
      userIDs: { has: session.user.id },
      NOT: {
        seenBy: { has: session.user.id }
      }
    }
  });

  return count;
}
export async function markAsSeen(chatId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;

  await prisma.chat.update({
    where: { id: chatId },
    data: {
      seenBy: { push: session.user.id }
    }
  });
}