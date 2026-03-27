import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ChatButton from "@/components/chat/ChatButton";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  User,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/map/MapWrapper";
import { ImageSlider } from "@/components/property/ImageSlider"; // <-- New Component

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      postDetail: true,
      user: {
        select: { name: true, image: true, email: true, id: true },
      },
    },
  });

  if (!post) return notFound();

  // Logic for saved state can be expanded here later
  const isSaved = false;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* MAIN CONTENT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* DYNAMIC IMAGE SLIDER */}
          <ImageSlider images={post.images} />

          {/* TITLE & PRICE HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-slate-900">{post.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{post.address}, Addis Ababa</span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-3xl font-extrabold text-blue-600">
                {post.price.toLocaleString()} ETB
              </p>
              <Badge variant="secondary" className="mt-2 uppercase bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">
                {post.type}
              </Badge>
            </div>
          </div>

          {/* PROPERTY DESCRIPTION */}
          <div>
            <h2 className="text-xl font-semibold mb-4 underline decoration-blue-500 underline-offset-8">
              About this property
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {post.postDetail?.desc || "No description provided."}
            </p>
          </div>

          {/* KEY AMENITIES GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-sm">
              <Bed className="text-blue-500 h-5 w-5" />
              <span className="font-bold text-sm text-slate-700">{post.bedroom} Bedrooms</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-sm">
              <Bath className="text-blue-500 h-5 w-5" />
              <span className="font-bold text-sm text-slate-700">{post.bathroom} Bathrooms</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-sm">
              <Maximize className="text-blue-500 h-5 w-5" />
              <span className="font-bold text-sm text-slate-700">{post.postDetail?.size || "N/A"} sqm</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-sm">
              <User className="text-blue-500 h-5 w-5" />
              <span className="font-bold text-sm text-slate-700">Agent Managed</span>
            </div>
          </div>

          {/* LOCATION SECTION */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold">Location Map</h2>
            <div className="h-[400px] w-full rounded-2xl border overflow-hidden shadow-inner relative">
              <MapWrapper
                items={[
                  {
                    id: post.id,
                    title: post.title,
                    latitude: Number(post.latitude),
                    longitude: Number(post.longitude),
                    price: post.price,
                    imgUrl: post.images[0] || "/house-placeholder.jpg",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="border rounded-2xl p-6 shadow-sm sticky top-24 bg-white border-slate-100">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Contact Property Owner</h3>
            
            <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
              <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden relative border-2 border-white shadow-md">
                <Image
                  src={post.user.image || "/avatar.png"}
                  alt={post.user.name || "Owner"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">{post.user.name}</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Certified Agent
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ChatButton ownerId={post.user.id} />
              <Button
                variant="outline"
                className="w-full gap-2 h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isSaved ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
                {isSaved ? "Saved" : "Save for Later"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}