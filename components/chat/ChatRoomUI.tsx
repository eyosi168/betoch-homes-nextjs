"use client";
import { useEffect, useState, useRef } from "react";
import { sendMessage } from "@/lib/actions/chat.actions";
import { useAbly } from "@/components/providers/AblyProvider"; // Import the hook

export default function ChatRoomUI({ chatId, initialMessages, userId }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 1. Get the PERSISTENT connection from context
  const ably = useAbly();

  useEffect(() => {
    // Reset messages when switching between chats
    setMessages(initialMessages);
    
    const channel = ably.channels.get(`chat:${chatId}`);

    // 2. Subscribe
    channel.subscribe("message", (msg) => {
      if (msg.data.userId !== userId) {
        setMessages((prev: any) => [...prev, msg.data]);
      }
    });

    // 3. CLEANUP: Only unsubscribe from the channel, DON'T close the connection
    return () => {
      channel.unsubscribe(`chat:${chatId}`);
    };
  }, [chatId, ably, userId, initialMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    const tempId = Date.now().toString();

    const optimisticMessage = {
      id: tempId,
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
      alert("Message failed to send.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - Useful for showing who you're talking to */}
      <div className="p-4 border-b font-bold bg-white z-10">
        Chat Room
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.userId === userId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 px-4 rounded-2xl shadow-sm text-sm ${
              m.userId === userId 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2 bg-white sticky bottom-0">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}