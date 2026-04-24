import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// ── NextAuth config (kept for compatibility with [...nextauth] route) ─────────
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() {
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// ── Session type returned by auth() ──────────────────────────────────────────
export interface AuthSession {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// ── Decode JWT without jsonwebtoken (Edge-safe, works in API routes too) ─────
function decodeJwt(token: string): AuthSession["user"] | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // atob works in Node 18+ and Edge runtime
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    // Check expiry
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

// ── auth() — call from any API route to get the current session ───────────────
// Usage:
//   const session = await auth()
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//
// Optionally pass the request to read the Authorization header:
//   const session = await auth(req)
export async function auth(req?: NextRequest): Promise<AuthSession | null> {
  let token: string | undefined;

  // 1. Try Authorization: Bearer <token> header (for API clients)
  if (req) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  // 2. Fall back to the auth_token cookie (set by login route)
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("auth_token")?.value;
    } catch {
      // cookies() throws outside of a request context — safe to ignore
    }
  }

  if (!token) return null;

  const user = decodeJwt(token);
  if (!user) return null;

  return { user };
}
