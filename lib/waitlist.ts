"use server";

import { z } from "zod";
import { Prisma } from "../generated/prisma";
import { prisma } from "./prisma";
import { isLocale } from "@/i18n/config";
import { sendWaitlistWelcomeEmail } from "./emails/waitlist-welcome";

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

    // Fire-and-forget welcome email. Never fail the user response on email errors.
    void sendWaitlistWelcomeEmail({ to: email, language: safeLanguage }).catch(
      (err: unknown) => {
        console.error(
          "[waitlist] welcome email failed:",
          err instanceof Error ? `${err.name}: ${err.message}` : err,
        );
      },
    );

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
