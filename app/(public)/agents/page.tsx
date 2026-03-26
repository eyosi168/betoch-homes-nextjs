import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AgentsClient from "./AgentsClient";

export default async function AgentsPage() {
  // Get current user session to check if someone is logged in
  const session = await auth.api.getSession({ headers: await headers() });

  // Fetch users who have at least 1 post
  const agents = await prisma.user.findMany({
    where: {
      posts: {
        some: {}, // This means "at least one post exists"
      },
    },
    include: {
      _count: {
        select: { posts: true }, // Count how many listings they have
      },
    },
    orderBy: {
      posts: {
        _count: "desc", // Show agents with the most listings first
      },
    },
  });

  return <AgentsClient agents={agents} currentUser={session?.user || null} />;
}