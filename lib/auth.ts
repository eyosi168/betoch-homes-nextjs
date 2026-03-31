import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";



export const auth = betterAuth({
    emailAndPassword:{
        enabled:true
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Changed from "sqlite"
    }),
    advanced: {
        database: {
            generateId: false, 
        },
    },
    user: {
        additionalFields: {
          role: {
            type: "string", 
            defaultValue: "USER"
          },
          isBanned: {
            type: "boolean",
            defaultValue: false
          }
        }
      },
    // Don't forget to add your providers (google, github, etc.) here!
    plugins:[nextCookies()]
});