import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleUserBan } from "@/lib/actions/admin.actions";
import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
    const session = await auth.api.getSession({ headers: await headers() });
  // Fetch all users and count their posts
  const users = await prisma.user.findMany({
    where: {
        id: {
          not: session?.user?.id // to not select the admin
        }
      },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-12 p-4 font-semibold text-slate-500 bg-slate-50 border-b text-sm">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3 text-center">Listings</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-12 p-4 items-center border-b last:border-0 hover:bg-slate-50 transition-colors">
            
            {/* USER INFO */}
            <div className="col-span-4 flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                <Image src={user.image || "/avatar.png"} alt={user.name || "User avatar"} fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                  {user.bio || "No bio provided."}
                </p>
              </div>
            </div>

            {/* LISTINGS COUNT */}
            <div className="col-span-3 text-center">
              <span className="font-bold text-lg">{user._count.posts}</span>
              <p className="text-[10px] text-slate-500 uppercase">Properties</p>
            </div>

            {/* STATUS BADGE */}
            <div className="col-span-2 text-center">
              {user.isBanned ? (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Banned</Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Active</Badge>
              )}
            </div>

            {/* ACTIONS */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <Link href={`/profile/${user.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink size={14} /> Profile
                </Button>
              </Link>
              
              {/* Server Action Form to Ban/Unban */}
              <form action={async () => {
                "use server";
                await toggleUserBan(user.id, user.isBanned);
              }}>
                <Button 
                  variant={user.isBanned ? "default" : "destructive"} 
                  size="sm" 
                  className="gap-2 w-[100px]"
                >
                  {user.isBanned ? (
                     <><ShieldCheck size={14} /> Unban</>
                  ) : (
                     <><ShieldAlert size={14} /> Ban</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}