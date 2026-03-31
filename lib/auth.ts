import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";



export const auth = betterAuth({
    emailAndPassword:{
        enabled:true
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
        
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
// ADD THESE TWO LINES:
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user
export type Auth = typeof auth;