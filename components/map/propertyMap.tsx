"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import Pin from "./Pin";

// 1. Define the shape of the data the map expects
export interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  imgUrl: string;
}

interface PropertyMapProps {
  items: MapProperty[];
}

export default function PropertyMap({ items }: PropertyMapProps) {
  // Default center (Addis Ababa coordinates)
  const position: [number, number] = [9.03, 38.74];

  return (
    <MapContainer
      center={position}
      zoom={12}
      scrollWheelZoom={false}
      className="w-full h-full z-0" // z-0 ensures it stays behind navbars/dropdowns
    >
      {/* 2. Using CartoDB 'Positron' tiles for a clean, modern look */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* 3. Marker Clustering: Groups nearby pins automatically */}
      <MarkerClusterGroup chunkedLoading>
        {items.map((item) => (
          <Pin key={item.id} item={item} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}