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
  async session({ session, token }) {
  session.user.id = token.id
  session.user.role = token.role
  session.user.permissions = token.permissions
  return session
}
  },
  async redirect({ url, baseUrl }) {
    return baseUrl
  }
}