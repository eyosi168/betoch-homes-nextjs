import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function MyProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id },
    include: { 
      posts: { include: { postDetail: true } }, 
      savedPosts: { 
        include: { 
          post: { include: { postDetail: true } } 
        } 
      } 
    }
  });

  // // DEBUG: Check your terminal! If this is empty [], the query is wrong.
  // console.log("SAVED POSTS FROM DB:", user?.savedPosts);

  // Safely extract the post objects
  const rawSaved = user?.savedPosts || [];
  const formattedSavedPosts = rawSaved
    .map(s => s.post)
    .filter(p => p !== null && p !== undefined);

  return (
    <ProfileClient 
      user={user}
      posts={user?.posts || []}
      savedPosts={formattedSavedPosts} // Now this is a clean array of Post objects
      isOwner={true}
    />
  );
}