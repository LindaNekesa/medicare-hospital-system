import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ── NextAuth config ───────────────────────────────────────────────────────────
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // NextAuth User.id must be a string
        return {
          id:    String(user.id),
          email: user.email,
          name:  user.name,
          role:  user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

// ── Session type returned by our custom auth() ────────────────────────────────
export interface AuthSession {
  user: {
    id:    number;
    email: string;
    name:  string;
    role:  string;
  };
}

// ── Decode JWT without jsonwebtoken (Edge-safe) ───────────────────────────────
function decodeJwt(token: string): AuthSession["user"] | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.id || !payload.email || !payload.role) return null;
    return {
      id:    payload.id,
      email: payload.email,
      name:  payload.name ?? "",
      role:  payload.role,
    };
  } catch {
    return null;
  }
}

// ── auth(req?) — reads custom JWT from cookie or Authorization header ─────────
// Used by all API routes: const session = await auth(req)
// Also works with no argument for server components: const session = await auth()
export async function auth(req?: NextRequest): Promise<AuthSession | null> {
  let token: string | undefined;

  // 1. Authorization: Bearer <token> header
  if (req) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  // 2. auth_token cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("auth_token")?.value;
    } catch {
      // cookies() throws outside request context — safe to ignore
    }
  }

  if (!token) return null;

  const user = decodeJwt(token);
  if (!user) return null;

  return { user };
}

// ── NextAuth getServerSession wrapper (for NextAuth-based routes) ─────────────
export const getAuthSession = () => getServerSession(authOptions);
