import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyCard({ item }: { item: any }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-slate-50/50">
      <Link href={`/properties/${item.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          {/* Property Image */}
          <Image
            src={item.images[0] || "/house-placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Type Badge (Buy/Rent) */}
          <Badge className="absolute top-4 left-4 capitalize bg-white/90 text-black hover:bg-white">
            For {item.type.toLowerCase()}
          </Badge>
          {/* Favorite Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm hover:bg-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              // We will add the "Save Post" logic later
            }}
          >
            <Heart className="h-5 w-5 text-slate-700" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
          <p className="text-primary font-bold text-lg">
            {item.price.toLocaleString()} <span className="text-xs font-normal">ETB</span>
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{item.city}, Ethiopia</span>
        </div>

        {/* Feature Icons */}
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
            <span className="text-sm font-medium">Area</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}