"use server";

import { z } from "zod";
import { Prisma } from "../generated/prisma";
import { prisma } from "./prisma";
import { isLocale } from "@/i18n/config";
import { sendWaitlistWelcomeEmail } from "./emails/waitlist-welcome";
import { sendWaitlistNotifyEmail } from "./emails/waitlist-notify";

const WaitlistInput = z.object({
  email: z.string().trim().toLowerCase().email("invalid_email"),
  language: z.string().optional(),
  source: z.string().max(80).optional(),
});

export type WaitlistResult =
  | { ok: true; alreadyOnList: boolean }
  | { ok: false; error: "invalid_email" | "server_error" };

export async function joinWaitlist(input: {
  email: string;
  language?: string;
  source?: string;
}): Promise<WaitlistResult> {
  const parsed = WaitlistInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid_email" };
  }

  const { email, language, source } = parsed.data;
  const safeLanguage = isLocale(language) ? language : undefined;

  try {
    await prisma.waitlistEntry.create({
      data: { email, language: safeLanguage, source },
    });

    // Await both emails so serverless doesn't terminate mid-send.
    // allSettled means a Resend failure can't break the form response.
    const totalCount = await prisma.waitlistEntry.count().catch(() => undefined);
    const results = await Promise.allSettled([
      sendWaitlistWelcomeEmail({ to: email, language: safeLanguage }),
      sendWaitlistNotifyEmail({
        email,
        language: safeLanguage,
        source,
        totalCount,
      }),
    ]);
    for (const [i, r] of results.entries()) {
      if (r.status === "rejected") {
        const label = i === 0 ? "welcome" : "notify";
        const reason = r.reason;
        console.error(
          `[waitlist] ${label} email failed:`,
          reason instanceof Error ? `${reason.name}: ${reason.message}` : reason,
        );
      }
    }

    return { ok: true, alreadyOnList: false };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { ok: true, alreadyOnList: true };
    }
    console.error(
      "[waitlist] write failed:",
      err instanceof Error ? `${err.name}: ${err.message}` : err,
    );
    if (err instanceof Error && err.stack) console.error(err.stack);
    return { ok: false, error: "server_error" };
  }
}
