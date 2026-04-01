"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(data: { autoApprove: boolean; maintenance: boolean }) {
  await prisma.systemConfig.upsert({
    where: { id: "system-settings" },
    update: {
      autoApprovePosts: data.autoApprove,
      maintenanceMode: data.maintenance,
    },
    create: {
      id: "system-settings",
      autoApprovePosts: data.autoApprove,
      maintenanceMode: data.maintenance,
    },
  });
  revalidatePath("/dashboard/settings");
}