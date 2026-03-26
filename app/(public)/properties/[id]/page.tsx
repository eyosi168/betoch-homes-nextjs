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
  MessageSquare,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/map/MapWrapper"; // <-- Import the wrapper

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
        select: { name: true, image: true, email: true,id:true },
      },
    },
  });

  if (!post) return notFound();

  const isSaved = false;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* DETAILS COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="grid grid-cols-2 gap-4 h-[400px]">
            <div className="relative col-span-2 md:col-span-1 h-full">
              <Image
                src={post.images[0] || "/house-placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4 h-full">
              <div className="relative h-full">
                <Image
                  src={post.images[1] || "/house-placeholder.jpg"}
                  alt="Interior"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="relative h-full">
                <Image
                  src={post.images[2] || "/house-placeholder.jpg"}
                  alt="Interior"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <MapPin className="h-4 w-4" />{" "}
                <span>{post.address}, Addis Ababa</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {post.price.toLocaleString()} ETB
              </p>
              <Badge variant="secondary" className="mt-2 uppercase">
                {post.type}
              </Badge>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 underline decoration-blue-500 underline-offset-8">
              About this property
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {post.postDetail?.desc || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border">
            <div className="flex flex-col items-center gap-2">
              <Bed className="text-blue-500" />{" "}
              <span className="font-bold text-sm">{post.bedroom} Bedrooms</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Bath className="text-blue-500" />{" "}
              <span className="font-bold text-sm">
                {post.bathroom} Bathrooms
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Maximize className="text-blue-500" />{" "}
              <span className="font-bold text-sm">
                {post.postDetail?.size || "N/A"} sqm
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <User className="text-blue-500" />{" "}
              <span className="font-bold text-sm">Agent Managed</span>
            </div>
          </div>

          {/* MAP SECTION */}
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold">Location Map</h2>
            <div className="h-[400px] w-full rounded-xl border overflow-hidden shadow-inner">
              {/* Note: We pass a single item in an array */}
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
          <div className="border rounded-2xl p-6 shadow-sm sticky top-24 bg-white">
            <h3 className="font-bold text-lg mb-6">Contact Property Owner</h3>
            <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden relative border-2 border-white shadow-sm">
                <Image
                  src={post.user.image || "/avatar.png"}
                  alt="Owner"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">{post.user.name}</p>
                <p className="text-xs text-slate-500 font-medium">
                  Certified Agent
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <ChatButton ownerId={post.user.id} />
              <Button
                variant="outline"
                className="w-full gap-2 h-12 text-base font-semibold border-slate-300"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isSaved ? "fill-red-500 text-red-500 border-none" : ""
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
