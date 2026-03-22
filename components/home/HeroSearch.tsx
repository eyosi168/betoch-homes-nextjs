"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { LocationSearch } from "./LocationSearch";

export default function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState("buy");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl max-w-3xl mx-auto text-black mt-8">
      <Tabs defaultValue="buy" onValueChange={setType} className="w-full mb-4">
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <LocationSearch value={city} onChange={setCity} />
        </div>
        <Button onClick={handleSearch} size="lg" className="h-12 px-8 text-base gap-2">
          <Search className="h-5 w-5" /> Search
        </Button>
      </div>
    </div>
  );
}