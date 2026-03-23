import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function ChatList() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <p className="p-4 text-sm">Log in to see chats</p>;

  const chats = await prisma.chat.findMany({
    where: { userIDs: { has: session.user.id } },
    include: { users: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col">
      <div className="p-4 font-bold text-lg border-b bg-white">All Chats</div>
      {chats.map((chat) => {
        const otherUser = chat.users.find(u => u.id !== session.user.id);
        return (
          <Link 
            key={chat.id} 
            href={`/chats/${chat.id}`}
            className="p-4 border-b hover:bg-white transition block"
          >
            <p className="font-semibold text-gray-900">{otherUser?.name || "User"}</p>
           

            <p className="text-sm text-gray-500 truncate">{chat.lastMessage || "No messages yet"}</p>
          </Link>
        );
      })}
    </div>
  );
}