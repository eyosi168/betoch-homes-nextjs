"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function PropertyFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Updates the URL: e.g., /properties?city=Bole
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-6 bg-white rounded-xl border shadow-sm space-y-6">
      <h2 className="font-bold text-xl mb-4">Filters</h2>
      
      {/* City Search */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input 
          placeholder="e.g. Bole" 
          defaultValue={searchParams.get("city") || ""}
          onChange={(e) => handleFilterChange("city", e.target.value)}
        />
      </div>

      {/* Property Type Enum */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select 
          defaultValue={searchParams.get("property") || "all"}
          onValueChange={(val) => handleFilterChange("property", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Input 
            type="number" 
            placeholder="0" 
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input 
            type="number" 
            placeholder="Max" 
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => replace(pathname)} // Clear all filters
      >
        Reset Filters
      </Button>
    </div>
  );
}