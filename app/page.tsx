import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/property/PropertyCard";
import HeroSearch from "@/components/home/HeroSearch";
import { FeaturedSkeleton } from "@/components/property/PropertySkeleton";

// This component handles the actual DB fetching
async function FeaturedList() {
  const featured = await prisma.post.findMany({
    take: 3,
    where:{
      moderationStatus:"APPROVED"
    },
    orderBy: { createdAt: "desc" },
    include: { postDetail: true },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featured.map((post) => (
        <PropertyCard key={post.id} item={post} />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative h-[650px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070')",
            filter: "brightness(0.5)" 
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find Your Perfect Home in <span className="text-blue-400">Addis Ababa</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 text-gray-200 max-w-2xl mx-auto">
            Search thousands of apartments, villas, and commercial properties.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold mb-10">Latest Listings</h2>
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedList />
        </Suspense>
      </section>
    </div>
  );
}