import { prisma } from "@/lib/prisma";
import { TrendingUp, MapPin, Home, MousePointer2 } from "lucide-react";

export default async function ReportsPage() {
  const [inventory, topCities, popularPosts] = await Promise.all([
    prisma.post.groupBy({ by: ['property'], _count: true }),
    prisma.post.groupBy({ 
      by: ['city'], 
      _count: true, 
      orderBy: { _count: { city: 'desc' } }, 
      take: 5 
    }),
    prisma.post.findMany({
      take: 5,
      include: { _count: { select: { savedPosts: true } }, user: { select: { name: true } } },
      orderBy: { savedPosts: { _count: 'desc' } }
    })
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Market Intelligence</h1>
        <p className="text-slate-500 font-medium">Data-driven performance metrics.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* TOP CITIES (Using your topCities data) */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-700">
            <MapPin size={18} className="text-emerald-500" /> Market Density by City
          </h3>
          <div className="space-y-5">
            {topCities.map((city) => (
              <div key={city.city}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-bold text-slate-700">{city.city}</span>
                  <span className="text-xs font-medium text-slate-500">{city._count} listings</span>
                </div>
                {/* Visual bar showing relative density */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min((city._count / 20) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOST SAVED PROPERTIES */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-700">
            <MousePointer2 size={18} className="text-rose-500" /> Hot Listings (Engagement)
          </h3>
          <div className="divide-y divide-slate-100">
            {popularPosts.map((post) => (
              <div key={post.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="max-w-[70%]">
                  <p className="text-sm font-bold truncate text-slate-800">{post.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Agent: {post.user.name}</p>
                </div>
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">
                  <span className="text-sm font-black">{post._count.savedPosts}</span>
                  <TrendingUp size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROPERTY MIX (Inventory) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-700">
            <Home size={18} className="text-blue-500" /> Total Inventory Mix
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div key={item.property} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.property}</p>
                <p className="text-2xl font-black text-slate-900">{item._count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}