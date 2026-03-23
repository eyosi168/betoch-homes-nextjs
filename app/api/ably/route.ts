import Ably from "ably";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(), // Async headers in Next.js 16
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  
  // Create a token request for this specific user
  const tokenRequestData = await client.auth.createTokenRequest({ 
    clientId: session.user.id 
  });

  return NextResponse.json(tokenRequestData);
}