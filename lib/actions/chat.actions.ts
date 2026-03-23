"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ablyRest } from "@/lib/ably";

// TRIGGER: When someone clicks "Chat" on a property page
export async function startOrGetChat(ownerId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const currentUserId = session.user.id;
  if (currentUserId === ownerId) throw new Error("You cannot chat with yourself");

  // 1. Check if chat exists
  let chat = await prisma.chat.findFirst({
    where: {
      userIDs: { hasEvery: [currentUserId, ownerId] },
    },
  });

  // 2. Create if it doesn't
  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        userIDs: [currentUserId, ownerId],
        seenBy: [currentUserId],
      },
    });
  }
 


 
  return chat.id
}

// ACTION: When someone hits "Send"
export async function sendMessage(chatId: string, text: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Save to MongoDB
  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      userId: session.user.id,
    },
  });

  // 2. Update the Chat "Last Message" and "SeenBy"
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      lastMessage: text,
      seenBy: [session.user.id],
    },
  });

  // 3. Broadcast to Ably so the other person sees it instantly
  const channel = ablyRest.channels.get(`chat:${chatId}`);
  await channel.publish("message", message);

  return message;
}