import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedDomain = process.env.ALLOWED_DOMAIN; // e.g. "asyncawake.agency"
const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          hd: allowedDomain || undefined,
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const email = (profile?.email || "").toLowerCase();
      const hd = (profile as any)?.hd;
      if (allowedEmails.includes(email)) return true;
      if (allowedDomain && hd === allowedDomain) return true;
      return false;
    },
  },
});
