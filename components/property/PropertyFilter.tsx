"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Filter Properties
        </h2>
        <button
          onClick={() => replace(pathname)}
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          Reset
        </button>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label className="text-sm text-gray-600">Location</Label>
        <Input
          placeholder="Search by area (e.g. Bole)"
          defaultValue={searchParams.get("city") || ""}
          className="h-10"
          onChange={(e) => handleFilterChange("city", e.target.value)}
        />
      </div>

      {/* Property Type */}
      <div className="space-y-1.5">
        <Label className="text-sm text-gray-600">Property Type</Label>
        <Select
          defaultValue={searchParams.get("property") || "all"}
          onValueChange={(val) => handleFilterChange("property", val)}
        >
          <SelectTrigger className="h-10">
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
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-10"
            onChange={(e) =>
              handleFilterChange("minPrice", e.target.value)
            }
          />
          <span className="text-gray-400 text-sm">—</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-10"
            onChange={(e) =>
              handleFilterChange("maxPrice", e.target.value)
            }
          />
        </div>
      </div>

      {/* Apply Button */}
      <Button className="w-full h-10 mt-2">
        Apply Filters
      </Button>
    </div>
  );
}