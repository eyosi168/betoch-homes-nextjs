import { prisma } from "@/lib/prisma";
import { MessageSquare, Users, Activity, Search } from "lucide-react";
import Image from "next/image";

export default async function AdminChatSurveillance() {
  // 1. Get high-level stats
  const totalChats = await prisma.chat.count();
  const totalMessages = await prisma.message.count();

  // 2. Get the 20 most recently active chats
  const recentChats = await prisma.chat.findMany({
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      users: { select: { id: true, name: true, image: true, email: true } },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communication Logs</h1>
        <p className="text-slate-500 font-medium">Monitor platform engagement and user messaging activity.</p>
      </div>

      {/* STATS ROW */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Conversations</p>
            <p className="text-3xl font-black text-slate-900">{totalChats}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Messages Sent</p>
            <p className="text-3xl font-black text-slate-900">{totalMessages}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Messages / Chat</p>
            <p className="text-3xl font-black text-slate-900">
              {totalChats > 0 ? Math.round(totalMessages / totalChats) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* SURVEILLANCE FEED */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Search size={18} className="text-slate-400" /> Recent Chat Activity
          </h3>
        </div>
        <div className="divide-y">
          {recentChats.map((chat) => (
            <div key={chat.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              
              {/* Participants */}
              <div className="flex items-center gap-4 w-1/3">
                <div className="flex -space-x-3">
                  {chat.users.map((u) => (
                    <div key={u.id} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <Image src={u.image || "/avatar.png"} alt={u.name || "User"} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {chat.users.map(u => u.name?.split(" ")[0]).join(" & ")}
                  </p>
                  <p className="text-xs text-slate-500">{chat._count.messages} messages exchanged</p>
                </div>
              </div>

              {/* Last Message Preview */}
              <div className="flex-1 px-6">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Last Message Sent</p>
                <p className="text-sm text-slate-700 italic truncate max-w-md">
                  "{chat.lastMessage || "Chat started"}"
                </p>
              </div>

              {/* Timestamp */}
              <div className="text-right w-32">
                <p className="text-xs font-bold text-slate-400">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

            </div>
          ))}

          {recentChats.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No conversations happening yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}