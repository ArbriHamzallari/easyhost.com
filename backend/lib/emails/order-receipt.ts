import { resend, getFromAddress } from "@/backend/lib/resend";
import { resolveLocale, t } from "@/backend/lib/i18n-messages";
import type { GuestPaymentMethod } from "@/backend/lib/orders";

const PREFIX = "guestMenu.receipt";

type Args = {
  to: string;
  guestName: string;
  propertyName: string;
  orderId: string;
  totalAmount: string;
  currency: string;
  paymentMethod: GuestPaymentMethod;
  language: string;
  iban: string | null;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderReceiptEmail(args: Args): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[order-receipt] RESEND_API_KEY not set — skipping email");
    return;
  }

  const locale = resolveLocale(args.language);
  const amount = `${args.currency} ${parseFloat(args.totalAmount).toFixed(2)}`;
  const shortRef = args.orderId.slice(-8).toUpperCase();

  const paymentBlock =
    args.paymentMethod === "stripe"
      ? `
        <h2 style="font-size:16px;margin:24px 0 8px;color:#222222;">${escapeHtml(t(locale, `${PREFIX}.stripeTitle`))}</h2>
        <p style="color:#717171;font-size:14px;line-height:1.5;">${escapeHtml(
          t(locale, `${PREFIX}.stripeBody`)
        )}</p>
      `
      : args.paymentMethod === "bank_transfer" && args.iban
        ? `
        <h2 style="font-size:16px;margin:24px 0 8px;color:#222222;">${escapeHtml(t(locale, `${PREFIX}.bankTitle`))}</h2>
        <p style="color:#717171;font-size:14px;line-height:1.5;">${escapeHtml(
          t(locale, `${PREFIX}.bankBody`, { amount, ref: shortRef })
        )}</p>
        <p style="font-family:monospace;font-size:15px;margin:12px 0;padding:12px;background:#FAFAF7;border-radius:8px;color:#222222;">${escapeHtml(args.iban)}</p>
      `
        : `
        <h2 style="font-size:16px;margin:24px 0 8px;color:#222222;">${escapeHtml(t(locale, `${PREFIX}.cashTitle`))}</h2>
        <p style="color:#717171;font-size:14px;line-height:1.5;">${escapeHtml(
          t(locale, `${PREFIX}.cashBody`)
        )}</p>
      `;

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;color:#222222;">
      <p style="font-size:15px;">${escapeHtml(t(locale, `${PREFIX}.greeting`, { name: args.guestName }))}</p>
      <p style="font-size:15px;color:#717171;">${escapeHtml(
        t(locale, `${PREFIX}.intro`, { property: args.propertyName })
      )}</p>
      <p style="font-size:22px;font-weight:600;margin:20px 0 4px;">${escapeHtml(t(locale, `${PREFIX}.total`))}: ${escapeHtml(amount)}</p>
      <p style="font-size:13px;color:#717171;">${escapeHtml(t(locale, `${PREFIX}.reference`))}: <strong style="color:#222222;">${shortRef}</strong></p>
      ${paymentBlock}
      <p style="margin-top:32px;font-size:12px;color:#B0B0B0;">${escapeHtml(t(locale, `${PREFIX}.footer`))}</p>
    </div>
  `;

  await resend.emails.send({
    from: getFromAddress(),
    to: args.to,
    subject: t(locale, `${PREFIX}.subject`, { property: args.propertyName }),
    html,
  });
}
