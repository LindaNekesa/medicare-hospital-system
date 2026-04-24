import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined; // eslint-disable-line no-var
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// In production, always create a fresh client (serverless-safe).
// In development, reuse the global instance to avoid exhausting connections
// during hot-reload.
export const prisma: PrismaClient =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (globalThis.__prisma ?? (globalThis.__prisma = createPrismaClient()));
