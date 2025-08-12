import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig, Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";

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
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};