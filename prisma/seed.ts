/**
 * Seeds a fresh database with the demo catalog, all site texts and the first host password.
 * Safe to run multiple times: it only fills what's missing and never overwrites your edits.
 *   npm run db:seed
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultCategories, defaultContent, defaultProducts } from "../src/lib/defaults";

const prisma = new PrismaClient();

async function main() {
  // ── Site texts ──
  for (const [key, value] of Object.entries(defaultContent)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value: value as Prisma.InputJsonValue } });
  }
  console.log("✔ Site texts ready");

  // ── Catalog (only when the store is completely empty) ──
  const [productCount, categoryCount] = await Promise.all([prisma.product.count(), prisma.category.count()]);
  if (productCount === 0 && categoryCount === 0) {
    const catIds = new Map<string, string>();
    for (const c of defaultCategories) {
      const created = await prisma.category.create({ data: { slug: c.slug, name: c.name, sortOrder: c.sortOrder } });
      catIds.set(c.slug, created.id);
    }
    for (const [i, p] of defaultProducts.entries()) {
      await prisma.product.create({
        data: {
          slug: p.slug,
          name: p.name,
          description: p.description,
          benefits: p.benefits,
          weight: p.weight,
          price: new Prisma.Decimal(p.price),
          salePrice: p.salePrice == null ? null : new Prisma.Decimal(p.salePrice),
          stock: p.stock,
          images: p.images,
          featured: p.featured,
          visible: true,
          sortOrder: i,
          categoryId: catIds.get(p.categorySlug) ?? null,
        },
      });
    }
    console.log(`✔ ${defaultCategories.length} categories & ${defaultProducts.length} products created`);
  } else {
    console.log("• Catalog already has data — skipped");
  }

  // ── Host password ──
  const cred = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (!cred) {
    const initial = process.env.HOST_INITIAL_PASSWORD;
    if (initial) {
      await prisma.adminCredential.create({ data: { id: 1, passwordHash: await bcrypt.hash(initial, 12), tokenVersion: 1 } });
      console.log("✔ Host password set from HOST_INITIAL_PASSWORD");
    } else {
      console.log("! HOST_INITIAL_PASSWORD is empty — set it, or run: npm run host:password");
    }
  } else {
    console.log("• Host password already set — skipped");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
