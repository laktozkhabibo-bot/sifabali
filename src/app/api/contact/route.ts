import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { allowRequest } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(5).max(4000),
  website: z.string().optional().nullable(), // honeypot
});

/** Stores contact-form messages; the owner reads them in /hostpage → Gelen Kutusu */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (!(await allowRequest("contact", 5))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { name, email, phone, message } = parsed.data;
  await prisma.contactMessage.create({ data: { name, email, phone, message } });
  return NextResponse.json({ ok: true });
}
