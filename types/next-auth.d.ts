import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

callbacks: {
  async jwt({ token, user }) {
    if (user) token.role = user.role
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role
    }
    return session
  },
  async redirect({ url, baseUrl }) {
    return baseUrl
  }
}