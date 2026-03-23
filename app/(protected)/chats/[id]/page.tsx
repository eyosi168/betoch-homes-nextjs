import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ChatRoomUI from "@/components/chat/ChatRoomUI";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <div className="p-10">Please log in.</div>;

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });

  if (!chat || !chat.userIDs.includes(session.user.id)) return notFound();

  return (
    <ChatRoomUI 
      chatId={id} 
      initialMessages={chat.messages} 
      userId={session.user.id} 
    />
  );
}