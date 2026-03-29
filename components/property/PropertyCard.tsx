"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Heart, Lock } from "lucide-react"; // Added Lock icon
import { Button } from "@/components/ui/button";
import { toggleSavePost } from "@/lib/actions/post.actions"; 
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  item: {
    id: string;
    title: string;
    images: string[];
    price: number;
    city: string;
    address: string;
    bedroom: number;
    bathroom: number;
    type: string;
    status: string; // Added status here
    postDetail?: {
      size: number | null;
    } | null;
  };
  isSavedInitial?: boolean;
}

export default function PropertyCard({ item, isSavedInitial = false }: PropertyCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isPending, startTransition] = useTransition();

  if (!item || !item.id) return null;

  const isOccupied = item.status === "occupied";

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const previousState = isSaved;
    setIsSaved(!isSaved);

    startTransition(async () => {
      try {
        const res = await toggleSavePost(item.id);
        if (!res?.success && res?.error === "UNAUTHORIZED") {
          setIsSaved(previousState);
          router.push("/login");
          return;
        }
      } catch (error) {
        setIsSaved(previousState);
        console.error("Failed to update saved status", error);
      }
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-slate-50/50",
      isOccupied && "opacity-80" // Dim the card slightly if occupied
    )}>
      <Link href={`/properties/${item.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={item.images[0] || "/house-placeholder.jpg"}
            alt={item.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              isOccupied && "grayscale" // Make image black and white if occupied
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="capitalize bg-white/90 text-black hover:bg-white shadow-sm w-fit">
              For {item.type.toLowerCase()}
            </Badge>
            
            {isOccupied && (
              <Badge variant="destructive" className="flex items-center gap-1 shadow-md animate-in fade-in zoom-in">
                <Lock size={12} /> Occupied
              </Badge>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isPending}
            className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm hover:bg-white rounded-full z-10"
            onClick={handleFavorite}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isSaved ? "fill-red-500 text-red-500" : "text-slate-700"
              )} 
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "font-bold text-lg line-clamp-1 transition-colors",
              isOccupied ? "text-slate-500" : "group-hover:text-primary"
            )}>
              {item.address}
            </h3>
            <p className={cn(
              "font-bold text-lg whitespace-nowrap",
              isOccupied ? "text-slate-400 line-through" : "text-primary"
            )}>
              {item.price.toLocaleString()} <span className="text-xs font-normal">ETB</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{item.city}, Addis Ababa</span>
          </div>

          <div className="flex justify-between border-t pt-4 text-slate-600">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{item.bedroom} Bed</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{item.bathroom} Bath</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {item.postDetail?.size || "N/A"} sqm
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}