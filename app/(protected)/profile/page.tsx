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
    include: { posts: true, savedPosts: { include: { post: true } } }
  });

  return (
    <ProfileClient 
      user={user}
      posts={user?.posts}
      savedPosts={user?.savedPosts.map(s => s.post)}
      isOwner={true}
    />
  );
}