import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easyhost.pro"),
  title: "EasyHost — Everything in your rental, on demand.",
  description:
    "EasyHost gives guests a beautiful, Uber Eats-style experience for everything in their rental. You set the prices. Card payments go straight to your bank. Built for modern hosts.",
  openGraph: {
    title: "EasyHost — Everything in your rental, on demand.",
    description:
      "EasyHost gives guests a beautiful, Uber Eats-style experience for everything in their rental. You set the prices. Card payments go straight to your bank.",
    url: "https://easyhost.pro",
    siteName: "EasyHost",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyHost — Everything in your rental, on demand.",
    description:
      "EasyHost gives guests a beautiful, Uber Eats-style experience for everything in their rental. You set the prices. Card payments go straight to your bank.",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Map internal locale keys to valid BCP 47 tags for the HTML lang attribute.
  // Our Albanian locale is stored as "al" internally; BCP 47 uses "sq".
  const BCP47: Record<string, string> = { al: "sq" };
  const htmlLang = BCP47[locale] ?? locale;

  return (
    <html lang={htmlLang}>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClerkProvider>{children}</ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
