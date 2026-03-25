import ChatList from "@/components/chat/ChatList";
import { AblyProvider } from "@/components/providers/AblyProvider";
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AblyProvider>
       <div className="flex h-[calc(100vh-64px)]  border-t">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="w-80 border-r bg-gray-50 overflow-y-auto hidden md:block">
        <ChatList />
      </aside>
     
      {/* Active Chat Window */}
      <main className="flex-1 bg-white relative">
        {children}
      </main>
    </div>
    </AblyProvider>
   
  );
}