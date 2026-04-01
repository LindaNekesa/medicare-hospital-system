import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "medicare-jwt-secret-2024";

export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}
