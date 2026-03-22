// app/(protected)/layout.tsx
import { auth } from "@/lib/auth"; // Your Better Auth setup
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This does a full database check to ensure the session is 100% valid
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}