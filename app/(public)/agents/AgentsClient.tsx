"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, User as UserIcon, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { startOrGetChat } from "@/lib/actions/chat.actions";
import { useTransition } from "react";

interface AgentProps {
  agents: any[];
  currentUser: any | null;
}

export default function AgentsClient({ agents, currentUser }: AgentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMessageClick = (agentId: string) => {
    if (!currentUser) {
      // If not logged in, redirect to login page. 
      // You could also add a toast here like: toast("Please login to message agents")
      router.push("/login");
      return;
    }
    startTransition(async ()=>{
        try{
            const chatId = await startOrGetChat(agentId);
        // MAKE SURE THIS MATCHES YOUR FOLDER NAME (chats vs chat)
        router.push(`/chats/${chatId}`);

        }catch(error){
           alert("couldnot start chat")
        }

    })
   
  
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Agents</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Connect with property owners and real estate professionals across the country.
        </p>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
          <UserIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">No agents found</h3>
          <p className="text-slate-500">Be the first to list a property and become an agent!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {agents.map((agent) => {
            // Don't show the message button if the user is looking at their own card
            const isMe = currentUser?.id === agent.id;

            return (
              <Card key={agent.id} className="group hover:shadow-xl transition-all duration-300 border-none bg-slate-50/50 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 group-hover:scale-105 transition-transform">
                    <Image 
                      src={agent.image || "/avatar.png"} 
                      alt={agent.name || "Agent"} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                    {agent.name || "Anonymous User"}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium mt-1 mb-4 bg-blue-50 px-3 py-1 rounded-full">
                    <Building2 size={14} />
                    <span>{agent._count.posts} Active Listings</span>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] mb-6">
                    {agent.bio || "This agent hasn't added a bio yet but has great properties!"}
                  </p>

                  <div className="w-full flex gap-2 mt-auto">
                    <Link href={`/profile/${agent.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl bg-white hover:bg-slate-50">
                        Profile
                      </Button>
                    </Link>
                    
                    {!isMe && (
                      <Button 
                        onClick={() => handleMessageClick(agent.id)}
                        disabled={isPending}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <MessageCircle size={16} />
                        {isPending ? "Connecting...":"Chat"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}