"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: string[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  }, [api, onSelect]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-[450px] w-full bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed">
        <p className="text-slate-400 italic">No images available for this property</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <Carousel setApi={setApi} className="w-full relative group">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl border bg-slate-50 shadow-sm">
                <Image
                  src={src}
                  alt={`Property view ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white h-10 w-10 shadow-lg" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white h-10 w-10 shadow-lg" />
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider">
          {current + 1} / {images.length} PHOTOS
        </div>
      </Carousel>

      {/* Thumbnail Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "relative h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200",
              current === index 
                ? "border-blue-600 ring-2 ring-blue-600/20 scale-105 z-10" 
                : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
            )}
          >
            <Image
              src={src}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}