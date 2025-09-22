// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedDomain = process.env.ALLOWED_DOMAIN; // asyncawake.agency
const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          // 'hd' is a hint only; we enforce domain below instead.
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // show errors on your sign-in page
  },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;

      const email = (profile?.email || "").toLowerCase();
      const byList = allowedEmails.includes(email);
      const byDomain =
        allowedDomain ? email.endsWith(`@${allowedDomain}`) : false;

      return byList || byDomain; // true = allow, false = AccessDenied
    },
  },
};

export default NextAuth(authOptions);
