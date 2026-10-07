import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { allowRequest } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  locale: z.enum(["tr", "en", "ar"]).default("tr"),
  website: z.string().optional().nullable(), // honeypot
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // silently drop bots
  if (!(await allowRequest("newsletter", 5))) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  await prisma.subscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email, locale: parsed.data.locale },
  });
  return NextResponse.json({ ok: true });
}
