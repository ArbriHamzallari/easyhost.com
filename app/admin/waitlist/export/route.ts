import { NextResponse } from "next/server";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/backend/lib/prisma";
import { checkAdmin } from "@/backend/lib/admin";

export const dynamic = "force-dynamic";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const result = await checkAdmin();
  if (result.state === "anon") {
    redirect("/sign-in?redirect_url=/admin/waitlist");
  }
  if (result.state === "denied") {
    notFound();
  }

  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["email", "language", "source", "createdAt"].join(","),
    ...entries.map((e) =>
      [
        csvEscape(e.email),
        csvEscape(e.language ?? ""),
        csvEscape(e.source ?? ""),
        csvEscape(e.createdAt.toISOString()),
      ].join(","),
    ),
  ];

  const csv = rows.join("\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="easyhost-waitlist-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
