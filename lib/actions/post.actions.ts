"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Type, Property } from "@prisma/client";

// Zod schema for strict validation
const CreatePostSchema = z.object({
  title: z.string().min(3),
  price: z.number().int(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  address: z.string().min(3),
  city: z.string().min(2),
  bedroom: z.number().int(),
  bathroom: z.number().int(),
  latitude: z.string(),
  longitude: z.string(),
  type: z.nativeEnum(Type),
  property: z.nativeEnum(Property),
  // PostDetail fields
  desc: z.string().min(10),
  utilities: z.string().optional(),
  pet: z.string().optional(),
  income: z.string().optional(),
  size: z.number().int().optional(),
  school: z.number().int().optional(),
  bus: z.number().int().optional(),
  restaurant: z.number().int().optional(),
});

export async function createPost(data: z.infer<typeof CreatePostSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  if (!session?.user) throw new Error("Please log in to post.");

  const { desc, utilities, pet, income, size, school, bus, restaurant, ...postData } = data;

  const newPost = await prisma.post.create({
    data: {
      ...postData,
      userId: session.user.id,
      postDetail: {
        create: {
          desc,
          utilities,
          pet,
          income,
          size,
          school,
          bus,
          restaurant,
        },
      },
    },
  });

  revalidatePath("/properties");
  redirect(`/properties/${newPost.id}`);
}
export async function deletePost(postId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ 
    where: { id: postId },
    select: { userId: true } 
  });

  if (!post || post.userId !== session.user.id) {
    throw new Error("Unauthorized: You don't own this listing");
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/profile");
}

export async function toggleSavePost(postId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } }
  });

  if (existing) {
    await prisma.savedPost.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedPost.create({ data: { userId: session.user.id, postId } });
  }
  revalidatePath("/profile");
  return { success: true };
}
export async function togglePostStatus(postId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "available" ? "occupied" : "available";
    
    await prisma.post.update({
      where: { id: postId },
      data: { status: newStatus },
    });

    revalidatePath("/profile"); // Refresh the profile page data
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}