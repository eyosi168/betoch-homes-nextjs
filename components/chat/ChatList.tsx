import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ChatSidebarItem from "./ChatSidebarItem";

export default async function ChatList() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Safety check: If no session, don't try to render
  if (!session?.user) return null;

  const chats = await prisma.chat.findMany({
    where: {
      // FIX: Changed from 'userIDs: { has: ... }'
      // We are now asking Postgres: "Find chats where SOME user has my ID"
      users: {
        some: {
          id: session.user.id,
        },
      },
    },
    // We still include 'users' so we can find the 'otherUser' for the UI
    include: { 
      users: true 
    },
    orderBy: { 
      updatedAt: "desc" 
    }
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="p-5 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Messages</h1>
        <div className="bg-slate-100 p-2 rounded-lg">
          <span className="text-xs font-bold text-slate-500">{chats.length}</span>
        </div>
      </div>
      
      {/* Chat Items List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">No conversations found</p>
          </div>
        ) : (
          chats.map((chat) => {
            // This logic still works perfectly because 'chat.users' is an array 
            // returned by the 'include' statement above.
            const otherUser = chat.users.find(u => u.id !== session.user.id);
            
            return (
              <ChatSidebarItem 
                key={chat.id} 
                chat={chat} 
                otherUser={otherUser} 
              />
            );
          })
        )}
      </div>
    </div>
  );
}