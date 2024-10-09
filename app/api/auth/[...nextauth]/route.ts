import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // })
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if the user already exists in the database
      const existingUser = await prisma.user.findUnique({

        where: { email: user.email || "" },
      });
      console.log(existingUser)

      if (!existingUser) {
        // If the user doesn't exist, create them in the database
        await prisma.user.create({
          data: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
          },
        });
      }
      return true; // Allow sign-in
    },
    async session({ session, token }) {
      if (token?.email) {
        // Attach the user id from the token to the session object
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Optional custom sign-in page
  },
});

export { handler as GET, handler as POST };
