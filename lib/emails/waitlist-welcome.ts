import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { resend, getFromAddress } from "@/lib/resend";

type Copy = {
  subject: string;
  preheader: string;
  greeting: string;
  body: string;
  whatsNextTitle: string;
  whatsNext: string;
  perk: string;
  footer: string;
  signoff: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    subject: "You're on the list: EasyHost is on the way",
    preheader: "Thanks for joining the waitlist. Early members get 50% off for life.",
    greeting: "Welcome to EasyHost",
    body: "Thanks for joining the waitlist. You're now among the first hosts to know the moment we open the doors.",
    whatsNextTitle: "What happens next",
    whatsNext:
      "We'll email you as soon as EasyHost is ready, likely in a few weeks. No spam in between, promise.",
    perk: "Early waitlist members get 50% off their first year, locked in for life.",
    footer: "Built with care in Tirana, Albania.",
    signoff: "Arbri & the EasyHost team",
  },
  al: {
    subject: "Je në listë: EasyHost po vjen",
    preheader: "Faleminderit që iu bashkove. Anëtarët e parë marrin 50% zbritje përgjithmonë.",
    greeting: "Mirë se erdhe në EasyHost",
    body: "Faleminderit që iu bashkove listës së pritjes. Tani je ndër pronarët e parë që do të mësojnë kur t'i hapim dyert.",
    whatsNextTitle: "Çfarë ndodh më pas",
    whatsNext:
      "Do të të shkruajmë sapo EasyHost të jetë gati, me shumë gjasa pas disa javësh. Pa spam në mes, premtim.",
    perk: "Anëtarët e parë në listë marrin 50% zbritje për vitin e parë, përgjithmonë.",
    footer: "Ndërtuar me kujdes në Tiranë, Shqipëri.",
    signoff: "Arbri dhe ekipi i EasyHost",
  },
  it: {
    subject: "Sei nella lista: EasyHost sta arrivando",
    preheader: "Grazie per esserti iscritto. I primi iscritti ottengono il 50% di sconto per sempre.",
    greeting: "Benvenuto in EasyHost",
    body: "Grazie per esserti iscritto alla waitlist. Sei tra i primi host a sapere quando apriremo le porte.",
    whatsNextTitle: "Cosa succede ora",
    whatsNext:
      "Ti scriveremo non appena EasyHost sarà pronto, probabilmente tra qualche settimana. Nessuno spam nel frattempo, promesso.",
    perk: "I primi iscritti ricevono il 50% di sconto sul primo anno, per sempre.",
    footer: "Costruito con cura a Tirana, Albania.",
    signoff: "Arbri e il team EasyHost",
  },
  de: {
    subject: "Du bist auf der Liste: EasyHost ist auf dem Weg",
    preheader: "Danke fürs Eintragen. Die ersten Mitglieder bekommen dauerhaft 50% Rabatt.",
    greeting: "Willkommen bei EasyHost",
    body: "Danke, dass du der Warteliste beigetreten bist. Du gehörst zu den ersten Hosts, die erfahren, wenn wir loslegen.",
    whatsNextTitle: "Wie es weitergeht",
    whatsNext:
      "Wir melden uns, sobald EasyHost bereit ist, voraussichtlich in ein paar Wochen. Bis dahin kein Spam, versprochen.",
    perk: "Die ersten Wartelistenmitglieder erhalten dauerhaft 50% Rabatt auf das erste Jahr.",
    footer: "Mit Sorgfalt gebaut in Tirana, Albanien.",
    signoff: "Arbri und das EasyHost-Team",
  },
};

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://easyhost.pro"
  );
}

function logoHeaderHtml(): string {
  const origin = siteOrigin();
  const src = `${origin}/images/easyhost-logo.png`;
  return `<a href="${escapeHtml(origin)}" style="text-decoration:none;display:inline-block;">
    <img src="${escapeHtml(src)}" alt="EasyHost" width="180" height="50" style="height:40px;width:auto;max-width:220px;display:block;border:0;" />
  </a>`;
}

function renderHtml(c: Copy) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(c.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#FAFAF7;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(c.preheader)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAFAF7;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,0.04);overflow:hidden;">
            <tr>
              <td style="padding:32px 40px 8px;">
                ${logoHeaderHtml()}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 8px;">
                <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:#222222;">
                  ${escapeHtml(c.greeting)}
                </h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#444444;">
                  ${escapeHtml(c.body)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFE8DE;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#E54A12;">
                        ${escapeHtml(c.whatsNextTitle)}
                      </p>
                      <p style="margin:0;font-size:15px;line-height:1.55;color:#222222;">
                        ${escapeHtml(c.whatsNext)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px 0;">
                <p style="margin:0;font-size:15px;line-height:1.55;color:#222222;">
                  <strong style="color:#FF5A1F;">${escapeHtml(c.perk)}</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 40px;">
                <p style="margin:0 0 6px;font-size:14px;line-height:1.55;color:#717171;">
                  ${escapeHtml(c.signoff)}
                </p>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#B0B0B0;">
                  ${escapeHtml(c.footer)}
                </p>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:18px auto 0;font-size:12px;line-height:1.5;color:#B0B0B0;text-align:center;">
            You're receiving this because you joined the EasyHost waitlist at easyhost.pro.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(c: Copy) {
  return [
    c.greeting,
    "",
    c.body,
    "",
    `${c.whatsNextTitle}: ${c.whatsNext}`,
    "",
    c.perk,
    "",
    c.signoff,
    c.footer,
  ].join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendWaitlistWelcomeEmail(args: {
  to: string;
  language?: string | null;
}) {
  const locale: Locale = isLocale(args.language ?? undefined)
    ? (args.language as Locale)
    : defaultLocale;
  const c = copy[locale];

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: args.to,
    subject: c.subject,
    html: renderHtml(c),
    text: renderText(c),
    headers: {
      "List-Unsubscribe": "<mailto:unsubscribe@easyhost.pro>",
    },
    tags: [
      { name: "type", value: "waitlist_welcome" },
      { name: "locale", value: locale },
    ],
  });

  if (error) {
    throw new Error(`Resend error: ${error.name}: ${error.message}`);
  }
  return data;
}
