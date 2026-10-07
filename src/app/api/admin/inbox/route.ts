import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute } from "@/lib/admin-route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Contact messages & newsletter subscribers */
export const GET = adminRoute(async () => {
  const [messages, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 1000 }),
  ]);
  return NextResponse.json({ messages, subscribers });
});

const actionSchema = z.object({
  action: z.enum(["read", "delete-message", "delete-subscriber"]),
  id: z.string().min(1),
});

export const POST = adminRoute(async (req: Request) => {
  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  const { action, id } = parsed.data;
  if (action === "read") await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  if (action === "delete-message") await prisma.contactMessage.delete({ where: { id } });
  if (action === "delete-subscriber") await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
