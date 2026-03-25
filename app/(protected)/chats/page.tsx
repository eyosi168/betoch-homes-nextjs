import { MessageSquare } from "lucide-react";

export default function GeneralChatsPage() {
  // This renders inside the {children} of your layout ONLY when 
  // the user is at /chats (not /chats/123)
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <MessageSquare className="w-16 h-16 mb-4 text-blue-100" strokeWidth={1.5} />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Your Messages</h2>
        <p className="text-sm text-slate-500">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
}