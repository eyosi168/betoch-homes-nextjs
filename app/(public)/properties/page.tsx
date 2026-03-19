import {prisma} from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard"; // We'll make this next
import PropertyFilter from "@/components/PropertyFilter"; // Your filter UI

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // This is your 'getPosts' controller logic moved here!
  const posts = await prisma.post.findMany({
    where: {
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
        postDetail: true // Including details like in your MERN controller
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Left Side: Filter Sidebar */}
      <aside className="w-full md:w-1/4">
        <PropertyFilter />
      </aside>

      {/* Right Side: Results Grid */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6">
          {posts.length} Properties Found
        </h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">No properties match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PropertyCard key={post.id} item={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}