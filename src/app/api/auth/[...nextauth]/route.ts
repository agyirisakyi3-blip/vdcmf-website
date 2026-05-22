import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Public — NextAuth handler for sign-in, sign-out, and session callbacks
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
