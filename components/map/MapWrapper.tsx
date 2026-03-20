"use client"; // This is the magic line

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapProperty } from "./propertyMap";

// Move the dynamic import HERE
const Map = dynamic(() => import("./propertyMap"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-xl" />,
});

export default function MapWrapper({ items }: { items: MapProperty[] }) {
  return <Map items={items} />;
}