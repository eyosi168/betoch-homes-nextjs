"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// You can expand this list later!
const locations = [
    { value: "bole", label: "Bole, Addis Ababa" },
    { value: "bole_bulbula", label: "Bole Bulbula, Addis Ababa" },
    { value: "bole_gerji", label: "Bole Gerji, Addis Ababa" },
    { value: "bole_michael", label: "Bole Michael, Addis Ababa" },
    { value: "ayat", label: "Ayat, Addis Ababa" },
    { value: "cmc", label: "CMC, Addis Ababa" },
    { value: "summit", label: "Summit, Addis Ababa" },
    { value: "mebrat_hayl", label: "Mebrat Hayl, Addis Ababa" },
  
    { value: "sarbet", label: "Sarbet, Addis Ababa" },
    { value: "mexico", label: "Mexico Square, Addis Ababa" },
    { value: "kazanchis", label: "Kazanchis, Addis Ababa" },
    { value: "sidist_kilo", label: "Sidist Kilo, Addis Ababa" },
    { value: "arat_kilo", label: "Arat Kilo, Addis Ababa" },
    { value: "piassa", label: "Piassa, Addis Ababa" },
    { value: "merkato", label: "Merkato, Addis Ababa" },
  
    { value: "lideta", label: "Lideta, Addis Ababa" },
    { value: "kolfe", label: "Kolfe Keranio, Addis Ababa" },
    { value: "keranio", label: "Keranio, Addis Ababa" },
    { value: "gotera", label: "Gotera, Addis Ababa" },
    { value: "kirkos", label: "Kirkos, Addis Ababa" },
    { value: "nifas_silk", label: "Nifas Silk, Addis Ababa" },
  
    { value: "akaki_kality", label: "Akaki Kality, Addis Ababa" },
    { value: "kaliti", label: "Kaliti, Addis Ababa" },
    { value: "jemo", label: "Jemo, Addis Ababa" },
    { value: "lafto", label: "Lafto, Addis Ababa" },
  
    { value: "gullele", label: "Gullele, Addis Ababa" },
    { value: "shiro_meda", label: "Shiro Meda, Addis Ababa" },
    { value: "entoto", label: "Entoto, Addis Ababa" },
  
    { value: "yeka", label: "Yeka, Addis Ababa" },
    { value: "kotebe", label: "Kotebe, Addis Ababa" },
    { value: "kara_alo", label: "Kara Alo, Addis Ababa" },
  
    { value: "addis_ketema", label: "Addis Ketema, Addis Ababa" },
    { value: "sefer_selam", label: "Sefer Selam, Addis Ababa" },
  
    { value: "hayat", label: "Hayat, Addis Ababa" },
    { value: "tafo", label: "Tafo, Addis Ababa" },
    { value: "lebu", label: "Lebu, Addis Ababa" },
    { value: "alem_bank", label: "Alem Bank, Addis Ababa" },
    { value: "wingate", label: "Wingate, Addis Ababa" },
    { value: "tor_hailoch", label: "Tor Hailoch, Addis Ababa" },
  
    { value: "megenagna", label: "Megenagna, Addis Ababa" },
    { value: "hayahulet", label: "Hayahulet, Addis Ababa" },
    { value: "gurd_shola", label: "Gurd Shola, Addis Ababa" },
  ];

export function LocationSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full h-12 justify-between pl-10 text-base font-normal bg-white">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          {value ? locations.find((l) => l.value === value)?.label : "Select location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((loc) => (
                <CommandItem
                  key={loc.value}
                  onSelect={() => {
                    onChange(loc.value === value ? "" : loc.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === loc.value ? "opacity-100" : "opacity-0")} />
                  {loc.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}