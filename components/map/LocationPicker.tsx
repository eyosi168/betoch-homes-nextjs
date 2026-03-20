"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icons in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  onChange: (lat: number, lng: number) => void;
}

function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  useMapEvents({
    // 2. Explicitly type the event 'e'
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange(lat, lng);
    },
  });
  return position === null ? null : <Marker position={position} icon={icon} />;
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border">
      <MapContainer center={[9.03, 38.74]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onChange={onChange} />
      </MapContainer>
      <p className="text-xs text-muted-foreground mt-2">Click on the map to set property location</p>
    </div>
  );
}