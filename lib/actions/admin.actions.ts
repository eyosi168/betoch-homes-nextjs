"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleUserBan(userId: string, currentStatus: boolean) {
  // 1. Security check: Ensure the person doing this is actually an Admin
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized action");
  }

  try {
    // 2. Flip the isBanned boolean
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: !currentStatus },
    });

    // 3. Revalidate the pages so UI updates instantly
    revalidatePath("/dashboard/users");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle ban status:", error);
    return { success: false, error: "Database error" };
  }
}