"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { ablyRest } from "@/lib/ably";
import { revalidatePath } from "next/cache";

export async function startOrGetChat(ownerId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const currentUserId = session.user.id;
  if (currentUserId === ownerId) throw new Error("You cannot chat with yourself");

  // CHANGE 1: We no longer search a "userIDs" array.
  // In Postgres, we look for a Chat that has "some" user with our ID 
  // AND "some" user with the owner's ID.
  let chat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: currentUserId } } },
        { users: { some: { id: ownerId } } },
      ],
    },
  });

  if (!chat) {
    // CHANGE 2: To link users in Postgres, we use "connect".
    // We don't just pass an array of strings; we tell Prisma to 
    // create a relationship between this Chat and these two User IDs.
    chat = await prisma.chat.create({
      data: {
        users: {
          connect: [
            { id: currentUserId },
            { id: ownerId }
          ]
        },
        seenBy: [currentUserId],
      },
    });
  }
  
  revalidatePath("/chats"); 
  return chat.id;
}

export async function sendMessage(chatId: string, text: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      userId: session.user.id,
    },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: {
      lastMessage: text,
      // CHANGE 3: Resetting the array. 
      // When a new message is sent, only the sender has "seen" the latest state.
      seenBy: [session.user.id], 
      updatedAt: new Date(), 
    },
  });

  const channel = ablyRest.channels.get(`chat:${chatId}`);
  await channel.publish("message", message);

  revalidatePath("/chats");
  return message;
}

export async function getUnreadCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 0;

  // CHANGE 4: Again, replacing "userIDs: { has: ... }" 
  // with the relational "users: { some: { id: ... } }".
  const count = await prisma.chat.count({
    where: {
      users: {
        some: {
          id: session.user.id,
        },
      },
      NOT: {
        seenBy: {
          has: session.user.id
        }
      }
    }
  });

  return count;
}

export async function markAsSeen(chatId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;

  // CHANGE 5: Small check. 
  // In Postgres, if we keep "pushing" the same ID, the array grows forever.
  // We first check if the user is already in the 'seenBy' list.
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { seenBy: true }
  });

  if (chat && !chat.seenBy.includes(session.user.id)) {
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          push: session.user.id 
        }
      }
    });
    
    revalidatePath("/chats");
  }
}