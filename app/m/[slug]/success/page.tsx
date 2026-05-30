import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getGuestOrderForSuccess } from "@/backend/lib/orders";
import { CheckCircle2 } from "lucide-react";

type Params = { params: Promise<{ slug: string }> };
type Search = { searchParams: Promise<{ order?: string }> };

export default async function GuestSuccessPage({
  params,
  searchParams,
}: Params & Search) {
  const { slug } = await params;
  const { order: orderId } = await searchParams;
  const t = await getTranslations("guestMenu.success");

  if (!orderId) notFound();

  const result = await getGuestOrderForSuccess(slug, orderId);
  if (!result.ok) notFound();

  const order = result.data;
  const accent = order.accentColor ?? "#FF5A1F";
  const shortRef = order.orderId.slice(-8).toUpperCase();
  const amount = `${order.currency} ${parseFloat(order.totalAmount).toFixed(2)}`;

  const thanksMessage = order.guestName
    ? t("thanksWithName", { name: order.guestName, property: order.propertyName })
    : t("thanks", { property: order.propertyName });

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-5 py-12">
      <div className="mx-auto max-w-lg text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}22` }}
        >
          <CheckCircle2 className="h-9 w-9" style={{ color: accent }} />
        </div>
        <h1 className="mt-6 font-display text-[26px] font-semibold tracking-tight text-[#222]">
          {t("title")}
        </h1>
        <p className="mt-2 text-[15px] text-[#717171]">{thanksMessage}</p>

        <div className="mt-8 rounded-[16px] border border-[#EBEBEB] bg-white p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] text-[#717171]">{t("total")}</p>
          <p className="text-[22px] font-semibold tabular-nums text-[#222]">
            {amount}
          </p>
          <p className="mt-3 text-[13px] text-[#717171]">
            {t("reference")}:{" "}
            <span className="font-mono font-semibold text-[#222]">{shortRef}</span>
          </p>

          {order.paymentMethod === "bank_transfer" && order.iban && (
            <div className="mt-5 border-t border-[#EBEBEB] pt-5">
              <p className="text-[14px] font-semibold text-[#222]">
                {t("bankTitle")}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#717171]">
                {t("bankBody", { amount, ref: shortRef })}
              </p>
              <p className="mt-3 break-all rounded-[10px] bg-[#FAFAF7] p-3 font-mono text-[13px] uppercase text-[#222]">
                {order.iban}
              </p>
            </div>
          )}

          {order.paymentMethod === "stripe" && (
            <div className="mt-5 border-t border-[#EBEBEB] pt-5">
              <p className="text-[14px] font-semibold text-[#222]">
                {t("stripeTitle")}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#717171]">
                {t("stripeBody")}
              </p>
            </div>
          )}

          {order.paymentMethod === "cash" && (
            <div className="mt-5 border-t border-[#EBEBEB] pt-5">
              <p className="text-[14px] font-semibold text-[#222]">
                {t("cashTitle")}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#717171]">
                {t("cashBody")}
              </p>
            </div>
          )}
        </div>

        <Link
          href={`/m/${slug}`}
          className="mt-8 inline-block text-[14px] font-medium"
          style={{ color: accent }}
        >
          {t("backToMenu")}
        </Link>
      </div>
    </div>
  );
}
