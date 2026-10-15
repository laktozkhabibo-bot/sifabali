import { PrismaClient } from "@prisma/client";

/**
 * True when DATABASE_URL points to a real database (not empty and not the
 * placeholder from .env.example like "postgresql://USER:PASSWORD@HOST:5432/DB").
 */
export function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  return !/@HOST[:/]|USER:PASSWORD@/i.test(url);
}

let warned = false;
/** Prints a single, readable hint instead of a flood of Prisma errors */
export function warnNoDb() {
  if (warned) return;
  warned = true;
  console.warn(
    "\n⚠  Veritabanı ayarlı değil (DATABASE_URL). Site örnek verilerle çalışıyor; yönetim paneli için .env dosyasına gerçek bir PostgreSQL bağlantısı ekleyin (README → Ortam değişkenleri).\n",
  );
}

// Reuse a single PrismaClient across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
