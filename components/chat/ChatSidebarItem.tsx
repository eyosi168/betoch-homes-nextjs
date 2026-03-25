"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
export default function ChatSidebarItem({ chat, otherUser }: any) {
  const pathname = usePathname();
  const isActive = pathname === `/chats/${chat.id}`;

  // Get first letter for the avatar
  const initials = otherUser?.name?.charAt(0).toUpperCase() || "U";

  return (
    <Link
      href={`/chats/${chat.id}`}
      className={`flex items-center gap-4 p-4 transition-all border-b border-slate-100 group ${
        isActive 
          ? "bg-blue-50 border-r-4 border-r-blue-600" 
          : "hover:bg-slate-50 bg-white"
      }`}
    >
      {/* Avatar Section */}
      <div className="relative shrink-0">
        {otherUser?.image ? (
          <img 
            src={otherUser.image} 
            alt={otherUser.name} 
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {initials}
          </div>
        )}
        {/* Optional: Online Status Dot */}
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      {/* Text Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className={`font-semibold truncate text-sm ${isActive ? "text-blue-900" : "text-slate-900"}`}>
            {otherUser?.name || "Unknown User"}
          </h3>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
            {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false }) : ""}
          </span>
        </div>
        
        <p className={`text-xs truncate ${isActive ? "text-blue-700/70" : "text-slate-500"}`}>
          {chat.lastMessage || "No messages yet"}
        </p>
      </div>
    </Link>
  );
}