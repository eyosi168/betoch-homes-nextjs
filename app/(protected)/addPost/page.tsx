"use client";

import { useState } from "react";
import { createPost } from "@/lib/actions/post.actions";
import dynamic from "next/dynamic";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-lg" />
});

export default function AddPostPage() {
  const [images, setImages] = useState<string[]>([]);
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  async function handleSubmit(formData: FormData) {
    if (!coords.lat || !coords.lng) return alert("Please select a location on the map");
    if (images.length === 0) return alert("Please upload at least one image");

    const rawData = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      images: images,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      bedroom: Number(formData.get("bedroom")),
      bathroom: Number(formData.get("bathroom")),
      latitude: coords.lat,
      longitude: coords.lng,
      type: formData.get("type") as any,
      property: formData.get("property") as any,
      desc: formData.get("desc") as string,
      utilities: formData.get("utilities") as string,
      pet: formData.get("pet") as string,
      income: formData.get("income") as string,
      size: Number(formData.get("size")),
      school: Number(formData.get("school")),
      bus: Number(formData.get("bus")),
      restaurant: Number(formData.get("restaurant")),
    };

    await createPost(rawData);
  }

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-bold mb-8">List Your Property</h1>
      
      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: General Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" placeholder="e.g. Modern Apartment in Bole" required />
            </div>
            <div className="space-y-2">
              <Label>Price (ETB)</Label>
              <Input name="price" type="number" placeholder="Total Price" required />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <select name="type" className="w-full border p-2 rounded-md">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Property</Label>
              <select name="property" className="w-full border p-2 rounded-md">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input name="bedroom" type="number" required />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input name="bathroom" type="number" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea name="desc" className="w-full p-3 border rounded-md h-32" required />
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
             <div className="space-y-1"><Label className="text-xs">Size (sqm)</Label><Input name="size" type="number" /></div>
             <div className="space-y-1"><Label className="text-xs">School (dist)</Label><Input name="school" type="number" /></div>
             <div className="space-y-1"><Label className="text-xs">Bus (dist)</Label><Input name="bus" type="number" /></div>
             <div className="space-y-1"><Label className="text-xs">Restaurant</Label><Input name="restaurant" type="number" /></div>
          </div>
        </div>

        {/* Right: Images & Map */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Property Location</Label>
            <LocationPicker onChange={(lat, lng) => setCoords({ lat: lat.toString(), lng: lng.toString() })} />
            <Input name="address" placeholder="Address line" required />
            <Input name="city" placeholder="City" required />
          </div>

          <div className="space-y-4">
            <Label>Images</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((url, i) => (
                <div key={i} className="relative h-20 w-full rounded-md overflow-hidden border">
                  <Image src={url} alt="preview" fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <CldUploadWidget 
              uploadPreset="betoch" 
              options={{ cloudName: "dapypyohp" }}
              onSuccess={(result: any) => setImages(prev => [...prev, result.info.secure_url])}
            >
              {({ open }) => (
                <Button type="button" variant="outline" className="w-full" onClick={() => open()}>
                  Upload Images
                </Button>
              )}
            </CldUploadWidget>
          </div>

          <Button type="submit" className="w-full h-12 text-lg">Publish Listing</Button>
        </div>
      </form>
    </div>
  );
}