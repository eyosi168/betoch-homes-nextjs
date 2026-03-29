import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilter from "@/components/property/PropertyFilter";
import MapWrapper from "@/components/map/MapWrapper";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const posts = await prisma.post.findMany({
    where: {
      status:"available",
      city: (params.city as string) || undefined,
      type: params.type ? (params.type as any) : undefined,
      property: params.property ? (params.property as any) : undefined,
      bedroom: params.bedroom ? parseInt(params.bedroom as string) : undefined,
      price: {
        gte: params.minPrice ? parseInt(params.minPrice as string) : 0,
        lte: params.maxPrice ? parseInt(params.maxPrice as string) : 10000000,
      },
    },
    include: {
      postDetail: true,
    },
  });

  const mapData = posts.map((post) => ({
    id: post.id,
    title: post.title,
    latitude: Number(post.latitude),
    longitude: Number(post.longitude),
    price: post.price,
    imgUrl: post.images[0] || "/house-placeholder.jpg",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="flex-1 space-y-6">
          <PropertyFilter />

          <h1 className="text-2xl font-bold">
            {posts.length} Properties Found
          </h1>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground font-medium">
                No properties match your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PropertyCard key={post.id} item={post} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE MAP */}
        <aside className="hidden lg:block w-[400px] xl:w-[500px]">
          <div className="sticky top-24 h-[calc(100vh-120px)] overflow-hidden rounded-xl border shadow-sm">
            <MapWrapper items={mapData} />
          </div>
        </aside>

      </div>
    </div>
  );
}