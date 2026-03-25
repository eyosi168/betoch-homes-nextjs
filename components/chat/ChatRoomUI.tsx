"use client";
import { useEffect, useState, useRef } from "react";
import { sendMessage, markAsSeen, getUnreadCount } from "@/lib/actions/chat.actions";
import { useAbly } from "@/components/providers/AblyProvider";
import { useNotificationStore } from "@/lib/store/useNotificationStore";

export default function ChatRoomUI({ chatId, initialMessages, userId }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const ably = useAbly();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // 1. Mark this specific chat as seen when opened
    const handleMarkSeen = async () => {
      await markAsSeen(chatId);
      // Refresh the global unread count in the Navbar
      const newCount = await getUnreadCount();
      setUnreadCount(newCount);
    };

    handleMarkSeen();
    setMessages(initialMessages);
    
    const channel = ably.channels.get(`chat:${chatId}`);

    channel.subscribe("message", (msg) => {
      if (msg.data.userId !== userId) {
        setMessages((prev: any) => [...prev, msg.data]);
        // Since we are looking at the chat, mark new incoming messages as seen too
        markAsSeen(chatId);
      }
    });

    setTimeout(scrollToBottom, 100);

    return () => {
      channel.unsubscribe(`chat:${chatId}`);
    };
  }, [chatId, ably, userId, initialMessages, setUnreadCount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    const optimisticMessage = {
      id: Date.now().toString(),
      text: currentInput,
      userId: userId,
      chatId: chatId,
      createdAt: new Date(),
    };

    setMessages((prev: any) => [...prev, optimisticMessage]);
    setInput(""); 

    try {
      await sendMessage(chatId, currentInput);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc] scroll-smooth"
      >
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.userId === userId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 px-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              m.userId === userId 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 border border-slate-200 p-3 px-5 rounded-full outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-md active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
               <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}