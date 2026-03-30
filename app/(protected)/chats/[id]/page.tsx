import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ChatRoomUI from "@/components/chat/ChatRoomUI";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return <div className="p-10">Please log in.</div>;

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: { 
      messages: { orderBy: { createdAt: "asc" } },
      // CHANGE 1: We must include the 'users' relation to check permissions
      users: true 
    }
  });

  // CHANGE 2: Logic update. 
  // 'chat.userIDs' no longer exists. 
  // We check the 'users' array (which contains full User objects) 
  // to see if any user ID matches the current session user.
  if (!chat || !chat.users.some(u => u.id === session.user.id)) {
    return notFound();
  }

  return (
    <ChatRoomUI 
      chatId={id} 
      initialMessages={chat.messages} 
      userId={session.user.id} 
    />
  );
}