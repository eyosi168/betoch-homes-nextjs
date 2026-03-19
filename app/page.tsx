import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder - Replace with a nice house image in public/hero.jpg */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070')",
            filter: "brightness(0.6)" 
          }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find Your Perfect Home in <span className="text-primary">Ethiopia</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Search thousands of apartments, villas, and commercial properties for rent and sale.
          </p>

          {/* SEARCH BOX */}
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-3xl mx-auto text-black">
            <Tabs defaultValue="buy" className="w-full mb-4">
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Enter neighborhood or city (e.g. Bole, Ayat...)" 
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION (Placeholder for later) */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* We will build Property Cards here in the next step! */}
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
            Property Card Loading...
          </div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
            Property Card Loading...
          </div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
            Property Card Loading...
          </div>
        </div>
      </section>
    </div>
  );
}