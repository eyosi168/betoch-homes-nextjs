import {prisma} from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Check, X, ExternalLink, Mail } from "lucide-react";
import { approvePost, rejectPost } from "./actions";

export default async function ApprovalsPage() {
  const pendingPosts = await prisma.post.findMany({
    where: { moderationStatus: "PENDING" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pending Review</h1>
          <p className="text-slate-500">Inspect property details and user credentials before approval.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100">
          {pendingPosts.length} queue items
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Property Preview</th>
              <th className="px-6 py-4">Owner Info</th>
              <th className="px-6 py-4">Valuation</th>
              <th className="px-6 py-4 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* 1. IMAGE & TITLE PREVIEW */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-20 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                      <Image 
                        src={post.images[0] || "/placeholder-house.png"} 
                        alt="Property" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link 
                        href={`/properties/${post.id}`} 
                        target="_blank"
                        className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 group"
                      >
                        {post.title}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="text-xs text-slate-500">{post.address}</span>
                    </div>
                  </div>
                </td>

                {/* 2. USER PROFILE LINK */}
                <td className="px-6 py-4">
                  <Link 
                    href={`/profile/${post.user.id}`} // Takes you to their public profile
                    className="flex flex-col group"
                  >
                    <span className="font-semibold text-slate-900 group-hover:underline decoration-blue-500">
                      {post.user.name}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail size={10} /> {post.user.email}
                    </span>
                  </Link>
                </td>

                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">${post.price.toLocaleString()}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                    {post.property} / {post.type}
                  </div>
                </td>

                {/* 3. FUNCTIONAL ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <form action={rejectPost.bind(null, post.id)}>
                      <button className="flex items-center gap-2 px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold transition-all border border-rose-100">
                        <X size={16} /> Reject
                      </button>
                    </form>

                    <form action={approvePost.bind(null, post.id)}>
                      <button className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-sm transition-all shadow-emerald-200">
                        <Check size={16} /> Approve
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}