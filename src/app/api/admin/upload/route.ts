import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { adminRoute } from "@/lib/admin-route";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };

/**
 * Image upload for product photos.
 * Production: Vercel Blob (BLOB_READ_WRITE_TOKEN). Local dev without a token: /public/uploads.
 */
export const POST = adminRoute(async (req: Request) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Sadece JPG, PNG, WEBP, AVIF veya GIF yükleyebilirsiniz." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Dosya 8 MB'dan büyük olamaz." }, { status: 400 });

  const name = `products/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: "public", contentType: file.type, addRandomSuffix: false });
    return NextResponse.json({ url: blob.url });
  }

  if (process.env.VERCEL) {
    return NextResponse.json({ error: "Görsel depolama ayarlı değil. Vercel → Storage → Blob bağlayın (BLOB_READ_WRITE_TOKEN)." }, { status: 500 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  const filename = path.basename(name);
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/products/${filename}` });
});
