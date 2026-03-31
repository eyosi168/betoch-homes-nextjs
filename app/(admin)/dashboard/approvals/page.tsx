import {prisma}  from "@/lib/prisma";
import { Check, X, MapPin } from "lucide-react";
import { approvePost, rejectPost } from "./actions";

export default async function ApprovalsPage() {
  // Fetch only pending posts, and include the user's name and email
  const pendingPosts = await prisma.post.findMany({
    where: { moderationStatus: "PENDING" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-gray-500">Review and moderate new property listings before they go live.</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {pendingPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending listings to review right now. Great job!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Property Details</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Price / Type</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    {/* Property Info */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="flex items-center text-gray-500 mt-1 text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.address}, {post.city}
                      </div>
                    </td>

                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.user.name || "Unknown"}</div>
                      <div className="text-gray-500 text-xs">{post.user.email}</div>
                    </td>

                    {/* Price and Type */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ${post.price.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-xs capitalize">
                        {post.property} • {post.type}
                      </div>
                    </td>

                    {/* Actions (Approve / Reject) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Reject Button Form */}
                        <form action={rejectPost.bind(null, post.id)}>
                          <button
                            type="submit"
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            title="Reject Listing"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </form>

                        {/* Approve Button Form */}
                        <form action={approvePost.bind(null, post.id)}>
                          <button
                            type="submit"
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                            title="Approve Listing"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}