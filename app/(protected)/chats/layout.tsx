import ChatList from "@/components/chat/ChatList";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-64px)] mt-16 border-t">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="w-80 border-r bg-gray-50 overflow-y-auto hidden md:block">
        <ChatList />
      </aside>
      
      {/* Active Chat Window */}
      <main className="flex-1 bg-white relative">
        {children}
      </main>
    </div>
  );
}