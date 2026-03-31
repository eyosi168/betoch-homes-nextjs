import {prisma} from "@/lib/prisma"; // Adjust path to your prisma client
import { Users, FileText, CheckCircle, AlertCircle } from "lucide-react"; // assuming you use lucide-react for icons

export default async function AdminDashboardOverview() {
  // Fetch all analytics in parallel for performance
  const [
    totalUsers, 
    pendingPosts, 
    activePosts,
    bannedUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { moderationStatus: "PENDING" } }),
    prisma.post.count({ where: { moderationStatus: "APPROVED" } }),
    prisma.user.count({ where: { isBanned: true } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back. Here is what is happening on Betoch-Homes today.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Pending Approvals (Most Urgent) */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Approvals</h3>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">{pendingPosts}</div>
          <p className="text-xs text-muted-foreground">Listings waiting for review</p>
        </div>

        {/* Card 2: Active Listings */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Listings</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{activePosts}</div>
          <p className="text-xs text-muted-foreground">Currently visible on the platform</p>
        </div>

        {/* Card 3: Total Users */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered accounts</p>
        </div>

        {/* Card 4: Banned Users */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Banned Users</h3>
            <FileText className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">{bannedUsers}</div>
          <p className="text-xs text-muted-foreground">Accounts currently suspended</p>
        </div>

      </div>
    </div>
  );
}