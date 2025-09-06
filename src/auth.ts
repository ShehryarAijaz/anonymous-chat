import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig, User } from "next-auth";
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
      async authorize(credentials): Promise<User | null> {
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
            return user as unknown as User;
          }
        } catch (error) {
          throw error;
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
          // Map MongoDB _id to a stable string id for NextAuth
          // NextAuth expects session.user.id (string), so we copy _id -> token.sub
          token.sub = user._id?.toString() || user.id
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
        // Only enhance the existing session.user (avoid constructing a new AdapterUser)
        // Set the required id from token.sub and attach custom fields from the JWT
        if (!session.user) return session;
        session.user.id = (token.sub as string) || session.user.id;
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
  basePath: "/api/auth",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
