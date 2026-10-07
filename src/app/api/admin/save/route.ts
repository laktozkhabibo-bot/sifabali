import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { adminRoute } from "@/lib/admin-route";
import { prisma } from "@/lib/prisma";
import { saveSchema } from "@/lib/admin-schema";
import { getAdminSnapshot, TAGS } from "@/lib/data";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Ensures every slug in a list is valid & unique (appends -2, -3… when needed) */
function uniqueSlugs<T extends { slug: string; name: { tr: string } }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map((item) => {
    const base = slugify(item.slug) || slugify(item.name.tr) || "urun";
    let slug = base;
    let n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    return { ...item, slug };
  });
}

const isTemp = (id: string) => id.startsWith("new-");

/**
 * "Değişiklikleri Kaydet": persists the whole draft (catalog + site texts) in ONE transaction,
 * then invalidates the storefront cache so the live site updates immediately.
 */
export const POST = adminRoute(async (req: Request) => {
  const parsed = saveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: `Geçersiz veri: ${first?.path.join(".")} — ${first?.message}` }, { status: 400 });
  }
  const categories = uniqueSlugs(parsed.data.categories);
  const products = uniqueSlugs(parsed.data.products);
  const { content } = parsed.data;

  await prisma.$transaction(
    async (tx) => {
      // ── Categories ──
      const idMap = new Map<string, string>();
      const keepCatIds = categories.filter((c) => !isTemp(c.id)).map((c) => c.id);
      await tx.category.deleteMany({ where: { id: { notIn: keepCatIds } } });
      // Temporarily free slugs to avoid unique conflicts when slugs are swapped
      for (const c of categories.filter((c) => !isTemp(c.id))) {
        await tx.category.update({ where: { id: c.id }, data: { slug: `__tmp_${c.id}` } });
      }
      for (const c of categories) {
        const data = { slug: c.slug, name: c.name, sortOrder: c.sortOrder };
        if (isTemp(c.id)) {
          const created = await tx.category.create({ data });
          idMap.set(c.id, created.id);
        } else {
          await tx.category.update({ where: { id: c.id }, data });
          idMap.set(c.id, c.id);
        }
      }

      // ── Products ──
      const keepProductIds = products.filter((p) => !isTemp(p.id)).map((p) => p.id);
      await tx.product.deleteMany({ where: { id: { notIn: keepProductIds } } });
      for (const p of products.filter((p) => !isTemp(p.id))) {
        await tx.product.update({ where: { id: p.id }, data: { slug: `__tmp_${p.id}` } });
      }
      for (const p of products) {
        const categoryId = p.categoryId ? (idMap.get(p.categoryId) ?? null) : null;
        const data = {
          slug: p.slug,
          name: p.name,
          description: p.description,
          benefits: p.benefits,
          weight: p.weight,
          price: new Prisma.Decimal(p.price),
          salePrice: p.salePrice != null && p.salePrice > 0 ? new Prisma.Decimal(p.salePrice) : null,
          stock: p.stock,
          images: p.images,
          visible: p.visible,
          featured: p.featured,
          sortOrder: p.sortOrder,
          categoryId,
        };
        if (isTemp(p.id)) await tx.product.create({ data });
        else await tx.product.update({ where: { id: p.id }, data });
      }

      // ── Site texts & settings ──
      for (const [key, value] of Object.entries(content)) {
        await tx.siteSetting.upsert({
          where: { key },
          create: { key, value: value as Prisma.InputJsonValue },
          update: { value: value as Prisma.InputJsonValue },
        });
      }
    },
    { timeout: 30_000, maxWait: 10_000 },
  );

  // Instant update of the live site (no rebuild / redeploy)
  revalidateTag(TAGS.catalog);
  revalidateTag(TAGS.content);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, ...(await getAdminSnapshot()) });
});
