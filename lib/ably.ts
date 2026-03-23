import Ably from "ably";

// This is the REST client for server-side broadcasting
export const ablyRest = new Ably.Rest(process.env.ABLY_API_KEY!);