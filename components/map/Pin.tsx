"use client";

import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import Image from "next/image";
import L from "leaflet";
import { MapProperty } from "./propertyMap";

// 4. THE LEAFLET ICON FIX
// Without this, the markers will appear as broken images in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Pin({ item }: { item: MapProperty }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup className="property-popup">
        <div className="flex flex-col gap-2 min-w-[150px]">
          {/* 5. Using Next/Image for performance */}
          <div className="relative w-full h-24 rounded-md overflow-hidden">
            <Image
              src={item.imgUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col">
            {/* 6. Link uses Next.js routing for instant page transitions */}
            <Link
              href={`/properties/${item.id}`}
              className="font-bold text-sm hover:underline text-blue-600 leading-tight"
            >
              {item.title}
            </Link>
            <span className="text-xs font-semibold mt-1">
              ETB {item.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}