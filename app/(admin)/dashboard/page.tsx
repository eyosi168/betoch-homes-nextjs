import { prisma } from "@/lib/prisma";
import { 
  Users, 
  Home, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  UserPlus, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboardOverview() {
  // Fetch data in parallel
  const [
    totalUsers, 
    pendingPosts, 
    activePosts,
    bannedUsers,
    recentUsers,
    recentPosts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { moderationStatus: "PENDING" } }),
    prisma.post.count({ where: { moderationStatus: "APPROVED" } }),
    prisma.user.count({ where: { isBanned: true } }),
    // Get last 5 users
    prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    // Get last 5 posts
    prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } })
  ]);

  return (
    <div className="space-y-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 font-medium">Real-time platform metrics and listing performance.</p>
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold uppercase text-slate-400">Server Status</span>
            <span className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
              Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* ANALYTICS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Users Card */}
        <div className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-slate-900">{totalUsers}</h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight size={12} /> 12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Platform growth this month</p>
        </div>

        {/* Pending Approvals Card */}
        <div className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Posts</p>
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-slate-900">{pendingPosts}</h2>
            {pendingPosts > 0 && (
              <span className="text-xs font-bold text-orange-600 animate-pulse">Action Required</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Awaiting manual moderation</p>
        </div>

        {/* Active Listings Card */}
        <div className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Listings</p>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Home className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-slate-900">{activePosts}</h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <CheckCircle size={12} className="mr-1" /> Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Publicly visible properties</p>
        </div>

        {/* Banned Users Card */}
        <div className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Suspended</p>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-slate-900">{bannedUsers}</h2>
            <span className="text-xs font-bold text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded">
              Restricted
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Banned for policy violations</p>
        </div>
      </div>

      {/* MIDDLE SECTION: CHART AND RECENT ACTIVITY */}
      <div className="grid gap-8 lg:grid-cols-7">
        
        {/* CHART SECTION (Simulated Growth Chart) */}
        <div className="lg:col-span-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Listing Growth</h3>
              <p className="text-sm text-slate-500">Weekly performance trend</p>
            </div>
            <TrendingUp className="text-blue-500" />
          </div>
          
          {/* Simple Visual Placeholder for Chart */}
          <div className="h-64 w-full bg-slate-50 rounded-xl flex items-end justify-around p-4 border border-dashed">
            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[40px]">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" 
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] font-bold text-slate-400">Day {i+1}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4 italic">Note: Real-time traffic analytics will populate here after deployment.</p>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="lg:col-span-3 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-slate-400" /> Recent Registrations
          </h3>
          <div className="space-y-6">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                    <Image src={user.image || "/avatar.png"} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link href={`/profile/${user.id}`}>
                  <ArrowUpRight size={16} className="text-slate-300 hover:text-blue-500 transition-colors" />
                </Link>
              </div>
            ))}
          </div>
          <Link href="/dashboard/users">
            <button className="w-full mt-8 py-2.5 rounded-xl border-2 border-slate-50 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              View All Users
            </button>
          </Link>
        </div>

      </div>

      {/* LATEST POSTS FEED */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Latest Property Submissions</h3>
        </div>
        <div className="divide-y">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-16 rounded-lg overflow-hidden border bg-slate-100">
                  {post.images?.[0] && <Image src={post.images[0]} alt="Prop" fill className="object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{post.title}</p>
                  <p className="text-xs text-slate-500">By {post.user.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  post.moderationStatus === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {post.moderationStatus}
                </span>
                <Link href={`/dashboard/approvals`}>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Review</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}