import { resend, getFromAddress } from "@/backend/lib/resend";

export async function sendWaitlistNotifyEmail(args: {
  email: string;
  language?: string | null;
  source?: string | null;
  totalCount?: number;
}) {
  const to = process.env.RESEND_NOTIFY_EMAIL;
  if (!to) {
    console.warn(
      "[notify] skipped — RESEND_NOTIFY_EMAIL is not set",
    );
    return null;
  }

  const lines = [
    `New waitlist signup: ${args.email}`,
    "",
    `Language: ${args.language ?? "unknown"}`,
    `Source: ${args.source ?? "unknown"}`,
    args.totalCount != null ? `Total on list: ${args.totalCount}` : "",
    "",
    `Signed up at: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    replyTo: args.email,
    subject: `New waitlist signup: ${args.email}`,
    text: lines,
    tags: [{ name: "type", value: "waitlist_notify" }],
  });

  if (error) {
    throw new Error(`Resend error: ${error.name}: ${error.message}`);
  }
  return data;
}
