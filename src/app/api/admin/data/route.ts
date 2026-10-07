import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-route";
import { getAdminSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => NextResponse.json(await getAdminSnapshot()));
