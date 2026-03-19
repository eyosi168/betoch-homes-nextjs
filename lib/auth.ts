import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";



export const auth = betterAuth({
    emailAndPassword:{
        enabled:true
    },
    database: prismaAdapter(prisma, {
        provider: "mongodb", // Changed from "sqlite"
    }),
    advanced: {
        database: {
            generateId: false, 
        },
    },
    // Don't forget to add your providers (google, github, etc.) here!
    plugins:[nextCookies()]
});