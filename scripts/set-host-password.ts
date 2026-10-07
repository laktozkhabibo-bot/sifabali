/**
 * Sets / resets the host panel password from the command line (e.g. if you forget it).
 *   npm run host:password -- "YeniGüçlüŞifre2026!"
 * All existing sessions are logged out.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.argv[2];
  if (!password || password.length < 10) {
    console.error('Usage: npm run host:password -- "NewPassword"   (min. 10 characters)');
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminCredential.upsert({
    where: { id: 1 },
    create: { id: 1, passwordHash, tokenVersion: 1 },
    update: { passwordHash, tokenVersion: { increment: 1 } },
  });
  console.log("✔ Host password updated. All previous sessions were signed out.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
