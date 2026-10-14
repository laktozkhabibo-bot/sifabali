/**
 * Sets / resets the host panel password from the command line (e.g. if you forget it).
 *   npm run host:password -- "YeniGüçlüŞifre2026!"
 * All existing sessions are logged out and any login lock-out is cleared.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Load variables from the project's .env file (this script runs outside Next.js,
 * and on some systems Prisma does not pick the file up by itself).
 * Values already present in the environment are kept.
 */
function loadEnvFile() {
  const file = resolve(process.cwd(), ".env");
  if (!existsSync(file)) {
    console.error('✖ ".env" dosyası bulunamadı. Komutu proje klasöründe çalıştırın.');
    process.exit(1);
  }
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, "");
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
  if (!process.env.DATABASE_URL) {
    console.error('✖ ".env" dosyasında DATABASE_URL yok.');
    process.exit(1);
  }
}
loadEnvFile();

const prisma = new PrismaClient();

async function main() {
  const password = process.argv[2];
  if (!password || password.length < 8) {
    console.error('Usage: npm run host:password -- "NewPassword"   (min. 8 characters)');
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminCredential.upsert({
    where: { id: 1 },
    create: { id: 1, passwordHash, tokenVersion: 1 },
    update: { passwordHash, tokenVersion: { increment: 1 } },
  });
  // Also lift any login lock-out caused by earlier wrong attempts
  const { count } = await prisma.loginAttempt.deleteMany();
  console.log("✔ Host password updated. All previous sessions were signed out.");
  if (count) console.log(`✔ Cleared ${count} login lock-out record(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());