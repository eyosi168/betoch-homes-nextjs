"use server";

import {prisma} from "@/lib/prisma"; // Adjust this import based on where your prisma client is
import { revalidatePath } from "next/cache";

export async function approvePost(postId: string) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { moderationStatus: "APPROVED" },
    });
    
    // This tells Next.js to refresh the data on these pages immediately
    revalidatePath("/dashboard/approvals");
    revalidatePath("/dashboard"); 
  } catch (error) {
    console.error("Failed to approve post:", error);
  }
}

export async function rejectPost(postId: string) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { moderationStatus: "REJECTED" },
    });
    
    revalidatePath("/dashboard/approvals");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to reject post:", error);
  }
}