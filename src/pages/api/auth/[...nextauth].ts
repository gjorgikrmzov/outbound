// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent", access_type: "offline" } },
    }),
  ],
  pages: { signIn: "/sign-in", error: "/sign-in" },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const email = (profile?.email || "").toLowerCase();
      const allowedDomain = process.env.ALLOWED_DOMAIN;
      const allowedEmails = (process.env.ALLOWED_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const byList = allowedEmails.includes(email);
      const byDomain = allowedDomain ? email.endsWith(`@${allowedDomain}`) : false;
      return byList || byDomain;
    },
    async redirect({ url, baseUrl }) {
      // Respect callbackUrl if it's same-origin
      if (url.startsWith(baseUrl)) return url;
      // Absolute external URLs are not allowed; fallback to home
      return baseUrl; // i.e., "/"
    },
  },
};

export default NextAuth(authOptions);
