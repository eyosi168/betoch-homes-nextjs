import {prisma} from "@/lib/prisma";
import { authClient } from "@/lib/auth-client"; // Assuming your server-side auth helper
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, User, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch the post (Replacement for your MERN getPost controller)
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      postDetail: true,
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  if (!post) return notFound();

  // 2. Check if the user has saved this post (Placeholder for Better-Auth logic)
  // In Next.js, we check the session on the server
  const isSaved = false; // We will connect this once your SavedPost action is ready

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Images & Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 h-[400px]">
            <div className="relative col-span-2 md:col-span-1 h-full">
              <Image 
                src={post.images[0] || "/house-placeholder.jpg"} 
                alt={post.title} fill className="object-cover rounded-xl" 
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4 h-full">
              <div className="relative h-full">
                <Image src={post.images[1] || "/house-placeholder.jpg"} alt="Interior" fill className="object-cover rounded-xl" />
              </div>
              <div className="relative h-full">
                <Image src={post.images[2] || "/house-placeholder.jpg"} alt="Interior" fill className="object-cover rounded-xl" />
              </div>
            </div>
          </div>

          {/* Title & Price */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4" />
                <span>{post.city}, Ethiopia</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{post.price.toLocaleString()} ETB</p>
              <Badge variant="outline" className="mt-2 uppercase">{post.type}</Badge>
            </div>
          </div>

          <hr />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed">
              {post.postDetail?.desc || "No description provided."}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl">
             <div className="flex flex-col items-center gap-2">
                <Bed className="text-blue-500" />
                <span className="font-bold">{post.bedroom} Bedrooms</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Bath className="text-blue-500" />
                <span className="font-bold">{post.bathroom} Bathrooms</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Maximize className="text-blue-500" />
                <span className="font-bold">{post.postDetail?.size || "N/A"} sqm</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <User className="text-blue-500" />
                <span className="font-bold">Managed by Agent</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact & Sidebar (1/3 width) */}
        <div className="space-y-6">
          <div className="border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-6">Interested in this property?</h3>
            
            <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden relative">
                    <Image src={post.user.image || "/avatar.png"} alt="Owner" fill />
                </div>
                <div>
                    <p className="font-bold">{post.user.name}</p>
                    <p className="text-xs text-slate-500">Property Owner/Agent</p>
                </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2 h-12 text-base">
                <MessageSquare className="h-5 w-5" /> Chat with Owner
              </Button>
              <Button variant="outline" className="w-full gap-2 h-12 text-base">
                <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} /> 
                {isSaved ? "Saved" : "Save Property"}
              </Button>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-6 italic">
                Reference ID: {post.id}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}