export {};
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {

        const users = [
          {
            id: "1",
            email: "admin@synaptireach.com",
            password: "admin123",
            role: "admin",
          },

          {
            id: "2",
            email: "staff@synaptireach.com",
            password: "staff123",
            role: "staff",
          },

          {
            id: "3",
            email: "client@synaptireach.com",
            password: "client123",
            role: "client",
          },

          {
            id: "4",
            email: "portal@synaptireach.com",
            password: "portal123",
            role: "portal",
          },

          {
            id: "5",
            email: "portalstaff@synaptireach.com",
            password: "portal123",
            role: "portal-staff",
          },
        ];

        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );

        if (!user) return null;

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

  ],

  callbacks: {

    async signIn({ user, account }) {

      // GIVE GOOGLE USERS DEFAULT ROLE
      if (account?.provider === "google") {
        (user as any).role = "client";
      }

      return true;
    },

    async jwt({ token, user }) {

      if (user) {
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {
        (session.user as any).role = token.role as string;
      }

      return session;
    },

    async redirect({ baseUrl }) {

      // DEFAULT GOOGLE LOGIN DESTINATION
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
