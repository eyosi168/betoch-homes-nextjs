"use client"; // Required for the onClick handler

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Define the Interface (Matching your Prisma schema)
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
    postDetail?: {
      size: number | null;
    } | null;
  };
}

export default function PropertyCard({ item }: PropertyCardProps) {
  
  const handleFavorite = (e: React.MouseEvent) => {
    // 2. Prevent clicking the heart from opening the property page
    e.preventDefault();
    e.stopPropagation();
    console.log("Saved property:", item.id);
    // Logic for Better-Auth saving goes here later
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-slate-50/50">
      <Link href={`/properties/${item.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={item.images[0] || "/house-placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <Badge className="absolute top-4 left-4 capitalize bg-white/90 text-black hover:bg-white shadow-sm">
            For {item.type.toLowerCase()}
          </Badge>

          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm hover:bg-white rounded-full z-10"
            onClick={handleFavorite}
          >
            <Heart className="h-5 w-5 text-slate-700 hover:fill-red-500 hover:text-red-500 transition-colors" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-primary font-bold text-lg whitespace-nowrap">
              {item.price.toLocaleString()} <span className="text-xs font-normal">ETB</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{item.city}, Ethiopia</span>
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
              {/* 3. Display actual size from postDetail */}
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