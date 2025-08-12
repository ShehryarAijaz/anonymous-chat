import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import NextAuth from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();
        console.log(`Credentials: ${JSON.stringify(credentials)}\n\n`);
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials?.username },
              { email: credentials?.email },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before signing in.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            (credentials?.password as string) ?? "",
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          } else {
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" as const },

  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token._id = user._id?.toString();
          token.isVerified = user.isVerified;
          token.isAcceptingMessages = user.isAcceptingMessages;
          token.username = user.username;
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (!session.user) {
          session.user = {} as any;
        }
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.username = token.username as string;

        return session;
      } catch (error) {
        console.error("Error in session callback", error);
        return session;
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
