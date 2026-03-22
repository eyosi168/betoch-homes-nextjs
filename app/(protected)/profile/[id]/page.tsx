import { prisma } from "@/lib/prisma";
import ProfileClient from "../ProfileClient";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  });

  if (!user) notFound();

  return (
    <ProfileClient 
      user={{ name: user.name, image: user.image, bio: user.bio }}
      posts={user.posts}
      isOwner={false}
    />
  );
}