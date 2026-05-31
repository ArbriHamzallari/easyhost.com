import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Refund Policy — EasyHost",
  description:
    "When and how EasyHost refunds subscription payments.",
  openGraph: {
    title: "Refund Policy — EasyHost",
    description:
      "When and how EasyHost refunds subscription payments.",
    url: "https://easyhost.pro/refund",
  },
};

export const dynamic = "force-static";

const LAST_UPDATED_ISO = "2026-05-31";
const LAST_UPDATED = new Date(LAST_UPDATED_ISO);

type Section = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type Content = {
  badge: string;
  title: string;
  intro: string;
  lastUpdatedLabel: string;
  sections: Section[];
  contactHeading: string;
  contactBody: string;
};

const CONTACT_EMAIL = "hello@easyhost.pro";

const COPY: Record<Locale, Content> = {
  en: {
    badge: "Legal",
    title: "Refund policy",
    intro:
      "EasyHost wants you to feel confident when you subscribe. This policy explains when you can request a refund of your subscription payment and how to do it. Subscription fees are billed by our merchant of record, Paddle, and refunds are issued back to your original payment method.",
    lastUpdatedLabel: "Last updated",
    sections: [
      {
        heading: "1. What this covers",
        paragraphs: [
          "This policy applies to EasyHost subscription fees only — the monthly Starter and Pro plans. It does not cover guest payments collected by a host (those happen directly between the guest and the host's connected payment account and are governed by the host's own refund terms).",
        ],
      },
      {
        heading: "2. 7-day free trial",
        paragraphs: [
          "Every new account starts with a 7-day free trial. No payment method is required to start the trial, so nothing is charged and there is nothing to refund during this period. If you choose not to subscribe at the end of the trial, your account is simply not billed.",
        ],
      },
      {
        heading: "3. 14-day satisfaction window for new subscriptions",
        paragraphs: [
          "If you subscribe and decide within 14 days that EasyHost is not a fit, email us at " +
            CONTACT_EMAIL +
            " from the address on your account and we will refund your first subscription payment in full, with no questions asked. This applies to your first paid month only.",
          "If you are a consumer resident in the European Union, this 14-day window also reflects your statutory right of withdrawal for distance contracts. Note that by starting to use the paid features during this window, you accept that the service is being supplied and your statutory right may be limited under Article 16(m) of the Consumer Rights Directive. We still honour the 14-day satisfaction refund described above.",
        ],
      },
      {
        heading: "4. After the 14-day window",
        paragraphs: [
          "After 14 days from your first subscription payment, paid months are non-refundable. You can cancel at any time from /settings/billing or via the Paddle customer portal — once you cancel, the subscription will not renew, and your access continues until the end of the current paid period.",
          "We do not pro-rate unused days in a billing cycle.",
        ],
      },
      {
        heading: "5. Exceptions",
        paragraphs: [
          "We will refund a paid month outside the 14-day window in the following cases:",
        ],
        list: [
          "Duplicate charge — you were billed twice for the same period due to a billing error.",
          "Extended service outage caused by EasyHost (more than 24 hours in a single billing cycle).",
          "A material misrepresentation of features that you relied on to subscribe.",
          "Where required by applicable consumer protection law in your country.",
        ],
      },
      {
        heading: "6. What is not refundable",
        paragraphs: [
          "We do not refund:",
        ],
        list: [
          "Past months on long-running subscriptions outside the cases listed in section 5.",
          "Payments processed by anyone other than Paddle on our behalf.",
          "Guest transactions paid to a host via Stripe Connect, IBAN, or cash — these are between the guest and the host. Contact the host directly for those.",
        ],
      },
      {
        heading: "7. How to request a refund",
        paragraphs: [
          "Email " +
            CONTACT_EMAIL +
            " from the email address on your EasyHost account. Include:",
        ],
        list: [
          "The email address used to subscribe.",
          "The approximate date of the charge.",
          "A short reason for the refund (one sentence is enough).",
        ],
      },
      {
        heading: "8. How long refunds take",
        paragraphs: [
          "We aim to review every request within 2 business days. Approved refunds are issued via Paddle to your original payment method. The money typically appears on your statement within 5–10 business days, depending on your bank or card provider.",
        ],
      },
      {
        heading: "9. Currency and fees",
        paragraphs: [
          "Refunds are issued in the same currency as the original payment (EUR by default). EasyHost does not deduct fees from refunds. Currency conversion and bank fees, if any, are determined by your card or bank and are outside our control.",
        ],
      },
      {
        heading: "10. Cancelling your subscription",
        paragraphs: [
          "You can cancel any time:",
        ],
        list: [
          "From your dashboard at /settings/billing.",
          "From the Paddle customer portal link in your most recent invoice email.",
          "By writing to " + CONTACT_EMAIL + " and asking us to cancel for you.",
        ],
      },
      {
        heading: "11. Changes to this policy",
        paragraphs: [
          "We may update this policy. The date at the top of the page reflects the most recent change. Changes do not affect refund requests submitted before the change took effect.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactBody:
      "Refund question or request? Email " +
      CONTACT_EMAIL +
      " and we'll get back to you within 2 business days.",
  },
  al: {
    badge: "Ligjor",
    title: "Politika e rimbursimit",
    intro:
      "EasyHost dëshiron që ti të ndihesh i sigurt kur abonohesh. Kjo politikë shpjegon kur mund të kërkosh rimbursim të pagesës së abonimit dhe si ta bësh. Tarifat e abonimit faturohen nga tregtari ynë i regjistruar, Paddle, dhe rimbursimet kthehen në metodën origjinale të pagesës.",
    lastUpdatedLabel: "Përditësuar më",
    sections: [
      {
        heading: "1. Çfarë mbulon",
        paragraphs: [
          "Kjo politikë zbatohet vetëm për tarifat e abonimit në EasyHost — planet mujore Starter dhe Pro. Nuk mbulon pagesat e mysafirëve të arkëtuara nga mikpritësi (ato kalojnë drejtpërdrejt mes mysafirit dhe llogarisë së pagesës së mikpritësit dhe rregullohen nga kushtet e mikpritësit).",
        ],
      },
      {
        heading: "2. Prova falas 7-ditore",
        paragraphs: [
          "Çdo llogari e re nis me 7 ditë provë falas. Nuk kërkohet metodë pagese për të nisur, prandaj nuk tarifohet asgjë dhe nuk ka çfarë të rimbursohet gjatë kësaj periudhe. Nëse vendos të mos abonohesh në fund të provës, llogaria thjesht nuk faturohet.",
        ],
      },
      {
        heading: "3. Periudha 14-ditore e kënaqësisë për abonime të reja",
        paragraphs: [
          "Nëse abonohesh dhe vendos brenda 14 ditësh që EasyHost nuk është për ty, na shkruaj te " +
            CONTACT_EMAIL +
            " nga email-i i llogarisë tënde dhe do të rimbursojmë pagesën e parë të plotë, pa pyetje. Vlen vetëm për muajin e parë me pagesë.",
          "Nëse je konsumator me banim në Bashkimin Evropian, kjo periudhë 14-ditore pasqyron edhe të drejtën tënde ligjore të tërheqjes për kontratat në distancë. Vini re se duke filluar të përdorësh funksionet me pagesë gjatë kësaj periudhe, pranon se shërbimi po ofrohet dhe e drejta jote ligjore mund të kufizohet sipas Nenit 16(m) të Direktivës për të Drejtat e Konsumatorit. Rimbursimi 14-ditor i përshkruar më sipër mbetet i vlefshëm.",
        ],
      },
      {
        heading: "4. Pas periudhës 14-ditore",
        paragraphs: [
          "Pas 14 ditësh nga pagesa e parë e abonimit, muajt e paguar nuk rimbursohen. Mund të anulosh në çdo kohë nga /settings/billing ose nga portali i klientit i Paddle — pasi të anulosh, abonimi nuk rinovohet dhe aksesi vazhdon deri në fund të periudhës aktuale të paguar.",
          "Nuk bëjmë rimbursim proporcional për ditët e papërdorura brenda një cikli faturimi.",
        ],
      },
      {
        heading: "5. Përjashtime",
        paragraphs: [
          "Do të rimbursojmë një muaj të paguar edhe jashtë periudhës 14-ditore në këto raste:",
        ],
        list: [
          "Tarifim i dyfishtë — je faturuar dy herë për të njëjtën periudhë për shkak të një gabimi në faturim.",
          "Ndërprerje e zgjatur e shërbimit me faj të EasyHost (më shumë se 24 orë në një cikël faturimi).",
          "Keqparaqitje thelbësore e funksionaliteteve mbi të cilën u mbështete për të abonuar.",
          "Aty ku e kërkon ligji i zbatueshëm për mbrojtjen e konsumatorit në vendin tënd.",
        ],
      },
      {
        heading: "6. Çfarë nuk rimbursohet",
        paragraphs: ["Nuk rimbursojmë:"],
        list: [
          "Muajt e mëparshëm në abonime afatgjata, përveç rasteve të listuara në seksionin 5.",
          "Pagesa të përpunuara nga kushdo tjetër veç Paddle në emrin tonë.",
          "Transaksione mysafirësh të paguara mikpritësit përmes Stripe Connect, IBAN ose para në dorë — këto janë mes mysafirit dhe mikpritësit. Kontakto direkt mikpritësin.",
        ],
      },
      {
        heading: "7. Si të kërkosh rimbursim",
        paragraphs: [
          "Na shkruaj te " +
            CONTACT_EMAIL +
            " nga email-i i llogarisë tënde EasyHost. Përfshi:",
        ],
        list: [
          "Email-in e përdorur për abonim.",
          "Datën përafërsisht të tarifimit.",
          "Një arsye të shkurtër (mjafton një fjali).",
        ],
      },
      {
        heading: "8. Sa kohë zgjat rimbursimi",
        paragraphs: [
          "Synojmë të shqyrtojmë çdo kërkesë brenda 2 ditësh pune. Rimbursimet e miratuara kryhen përmes Paddle në metodën origjinale të pagesës. Paratë zakonisht shfaqen në pasqyrën tënde brenda 5–10 ditësh pune, në varësi të bankës ose ofruesit të kartës.",
        ],
      },
      {
        heading: "9. Monedha dhe tarifat",
        paragraphs: [
          "Rimbursimet kryhen në të njëjtën monedhë si pagesa origjinale (EUR si parazgjedhje). EasyHost nuk zbret tarifa nga rimbursimi. Konvertimi i monedhës dhe tarifat bankare, nëse ka, përcaktohen nga karta ose banka jote dhe janë jashtë kontrollit tonë.",
        ],
      },
      {
        heading: "10. Anulimi i abonimit",
        paragraphs: ["Mund të anulosh në çdo kohë:"],
        list: [
          "Nga paneli yt te /settings/billing.",
          "Nga linku i portalit të klientit Paddle në email-in e fundit të faturës.",
          "Duke na shkruar te " + CONTACT_EMAIL + " dhe duke kërkuar që ta anulojmë ne për ty.",
        ],
      },
      {
        heading: "11. Ndryshimet në këtë politikë",
        paragraphs: [
          "Mund ta përditësojmë këtë politikë. Data në krye të faqes pasqyron ndryshimin më të fundit. Ndryshimet nuk prekin kërkesat e rimbursimit të paraqitura përpara hyrjes në fuqi.",
        ],
      },
    ],
    contactHeading: "Kontakti",
    contactBody:
      "Pyetje ose kërkesë për rimbursim? Na shkruaj te " +
      CONTACT_EMAIL +
      " dhe do të të kthejmë përgjigje brenda 2 ditësh pune.",
  },
  it: {
    badge: "Legale",
    title: "Politica di rimborso",
    intro:
      "EasyHost vuole che ti senta sicuro quando ti abboni. Questa politica spiega quando puoi richiedere il rimborso del pagamento dell'abbonamento e come farlo. Le quote di abbonamento sono fatturate dal nostro merchant of record, Paddle, e i rimborsi vengono accreditati sul metodo di pagamento originale.",
    lastUpdatedLabel: "Aggiornata il",
    sections: [
      {
        heading: "1. Cosa copre",
        paragraphs: [
          "Questa politica si applica solo alle quote di abbonamento di EasyHost — i piani mensili Starter e Pro. Non copre i pagamenti degli ospiti raccolti dall'host (avvengono direttamente tra l'ospite e l'account di pagamento collegato dell'host e sono regolati dai termini dell'host).",
        ],
      },
      {
        heading: "2. Prova gratuita di 7 giorni",
        paragraphs: [
          "Ogni nuovo account inizia con 7 giorni di prova gratuita. Non è richiesto alcun metodo di pagamento per iniziare, quindi nulla viene addebitato e non c'è nulla da rimborsare in questo periodo. Se decidi di non abbonarti al termine della prova, l'account semplicemente non viene fatturato.",
        ],
      },
      {
        heading: "3. Finestra di soddisfazione di 14 giorni per i nuovi abbonamenti",
        paragraphs: [
          "Se ti abboni e decidi entro 14 giorni che EasyHost non fa per te, scrivici a " +
            CONTACT_EMAIL +
            " dall'indirizzo email del tuo account e rimborseremo per intero il primo pagamento dell'abbonamento, senza fare domande. Vale solo per il primo mese pagato.",
          "Se sei un consumatore residente nell'Unione Europea, questa finestra di 14 giorni rispecchia anche il tuo diritto di recesso legale per i contratti a distanza. Tieni presente che iniziando a usare le funzioni a pagamento in questo periodo accetti che il servizio venga fornito e il tuo diritto legale può essere limitato ai sensi dell'articolo 16(m) della Direttiva sui diritti dei consumatori. Onoriamo comunque il rimborso di soddisfazione di 14 giorni descritto sopra.",
        ],
      },
      {
        heading: "4. Dopo i 14 giorni",
        paragraphs: [
          "Trascorsi 14 giorni dal primo pagamento dell'abbonamento, i mesi pagati non sono rimborsabili. Puoi annullare in qualsiasi momento da /settings/billing o dal portale clienti di Paddle — una volta annullato, l'abbonamento non si rinnova e l'accesso continua fino alla fine del periodo pagato in corso.",
          "Non rimborsiamo proporzionalmente i giorni non utilizzati in un ciclo di fatturazione.",
        ],
      },
      {
        heading: "5. Eccezioni",
        paragraphs: [
          "Rimborseremo un mese pagato anche oltre i 14 giorni nei seguenti casi:",
        ],
        list: [
          "Addebito duplicato — sei stato fatturato due volte per lo stesso periodo per un errore di fatturazione.",
          "Interruzione prolungata del servizio causata da EasyHost (oltre 24 ore in un singolo ciclo di fatturazione).",
          "Travisamento sostanziale di funzionalità su cui hai fatto affidamento per abbonarti.",
          "Dove richiesto dalle norme di tutela dei consumatori applicabili nel tuo paese.",
        ],
      },
      {
        heading: "6. Cosa non è rimborsabile",
        paragraphs: ["Non rimborsiamo:"],
        list: [
          "Mesi passati su abbonamenti di lunga durata al di fuori dei casi della sezione 5.",
          "Pagamenti elaborati da soggetti diversi da Paddle per nostro conto.",
          "Transazioni degli ospiti pagate all'host tramite Stripe Connect, IBAN o contante — sono tra ospite e host. Contatta direttamente l'host.",
        ],
      },
      {
        heading: "7. Come richiedere un rimborso",
        paragraphs: [
          "Scrivi a " +
            CONTACT_EMAIL +
            " dall'indirizzo email del tuo account EasyHost. Includi:",
        ],
        list: [
          "L'indirizzo email usato per l'abbonamento.",
          "La data approssimativa dell'addebito.",
          "Una breve motivazione (basta una frase).",
        ],
      },
      {
        heading: "8. Tempi di rimborso",
        paragraphs: [
          "Puntiamo a valutare ogni richiesta entro 2 giorni lavorativi. I rimborsi approvati vengono erogati tramite Paddle sul metodo di pagamento originale. Il denaro compare di solito sull'estratto conto entro 5–10 giorni lavorativi, a seconda della banca o del circuito della carta.",
        ],
      },
      {
        heading: "9. Valuta e commissioni",
        paragraphs: [
          "I rimborsi vengono erogati nella stessa valuta del pagamento originale (EUR di default). EasyHost non trattiene commissioni dai rimborsi. Eventuali conversioni valutarie o commissioni bancarie sono determinate dalla tua carta o banca e fuori dal nostro controllo.",
        ],
      },
      {
        heading: "10. Annullamento dell'abbonamento",
        paragraphs: ["Puoi annullare in qualsiasi momento:"],
        list: [
          "Dal tuo pannello su /settings/billing.",
          "Dal link al portale clienti Paddle nell'email della tua ultima fattura.",
          "Scrivendo a " + CONTACT_EMAIL + " chiedendoci di annullare per te.",
        ],
      },
      {
        heading: "11. Modifiche a questa politica",
        paragraphs: [
          "Possiamo aggiornare questa politica. La data in cima alla pagina riflette l'ultima modifica. Le modifiche non si applicano alle richieste di rimborso inviate prima della loro entrata in vigore.",
        ],
      },
    ],
    contactHeading: "Contatti",
    contactBody:
      "Domanda o richiesta di rimborso? Scrivici a " +
      CONTACT_EMAIL +
      " e ti risponderemo entro 2 giorni lavorativi.",
  },
  de: {
    badge: "Rechtliches",
    title: "Erstattungsrichtlinie",
    intro:
      "EasyHost soll dir ein gutes Gefühl beim Abonnieren geben. Diese Richtlinie erklärt, wann du eine Erstattung deiner Abonnementzahlung verlangen kannst und wie das geht. Abonnementgebühren werden von unserem Merchant of Record Paddle abgerechnet, Erstattungen erfolgen auf die ursprüngliche Zahlungsmethode.",
    lastUpdatedLabel: "Zuletzt aktualisiert",
    sections: [
      {
        heading: "1. Was dies abdeckt",
        paragraphs: [
          "Diese Richtlinie gilt ausschließlich für EasyHost-Abonnementgebühren — die monatlichen Starter- und Pro-Tarife. Sie deckt keine Gästezahlungen ab, die ein Host einzieht (diese laufen direkt zwischen Gast und dem verbundenen Zahlungskonto des Hosts und unterliegen den Erstattungsbedingungen des Hosts).",
        ],
      },
      {
        heading: "2. 7-tägige kostenlose Probezeit",
        paragraphs: [
          "Jedes neue Konto startet mit 7 Tagen kostenloser Probezeit. Es ist keine Zahlungsmethode erforderlich, also wird nichts berechnet und es gibt in diesem Zeitraum auch nichts zu erstatten. Entscheidest du dich am Ende der Probezeit gegen ein Abonnement, wird dein Konto einfach nicht belastet.",
        ],
      },
      {
        heading: "3. 14-tägige Zufriedenheitsfrist für neue Abonnements",
        paragraphs: [
          "Wenn du dich abonnierst und innerhalb von 14 Tagen feststellst, dass EasyHost nicht passt, schreibe uns von der E-Mail-Adresse deines Kontos an " +
            CONTACT_EMAIL +
            " und wir erstatten dir die erste Abonnementzahlung vollständig — ohne Rückfragen. Gilt nur für deinen ersten bezahlten Monat.",
          "Bist du Verbraucher mit Wohnsitz in der Europäischen Union, spiegelt diese 14-tägige Frist auch dein gesetzliches Widerrufsrecht bei Fernabsatzverträgen wider. Beachte, dass mit Beginn der Nutzung der kostenpflichtigen Funktionen innerhalb dieser Frist das gesetzliche Widerrufsrecht nach Art. 16 lit. m der Verbraucherrechte-Richtlinie eingeschränkt sein kann. Die oben beschriebene 14-tägige Zufriedenheits-Erstattung gilt dennoch.",
        ],
      },
      {
        heading: "4. Nach Ablauf der 14 Tage",
        paragraphs: [
          "Nach 14 Tagen ab deiner ersten Abonnementzahlung sind bezahlte Monate nicht mehr erstattungsfähig. Du kannst jederzeit über /settings/billing oder das Paddle-Kundenportal kündigen — nach der Kündigung verlängert sich das Abonnement nicht und der Zugang bleibt bis zum Ende der laufenden bezahlten Periode bestehen.",
          "Wir erstatten keine ungenutzten Tage anteilig innerhalb eines Abrechnungszeitraums.",
        ],
      },
      {
        heading: "5. Ausnahmen",
        paragraphs: [
          "Wir erstatten einen bezahlten Monat außerhalb der 14-Tage-Frist in folgenden Fällen:",
        ],
        list: [
          "Doppelte Belastung — dir wurde aufgrund eines Abrechnungsfehlers zweimal derselbe Zeitraum berechnet.",
          "Längere, durch EasyHost verursachte Dienstunterbrechung (mehr als 24 Stunden in einem Abrechnungszeitraum).",
          "Wesentliche falsche Darstellung von Funktionen, auf die du dich beim Abschluss verlassen hast.",
          "Wo es das geltende Verbraucherschutzrecht deines Landes verlangt.",
        ],
      },
      {
        heading: "6. Was nicht erstattet wird",
        paragraphs: ["Wir erstatten nicht:"],
        list: [
          "Vergangene Monate bei länger laufenden Abonnements, außer in den in Abschnitt 5 genannten Fällen.",
          "Zahlungen, die von anderen als Paddle in unserem Auftrag verarbeitet wurden.",
          "Gasttransaktionen, die per Stripe Connect, IBAN oder bar an den Host gezahlt wurden — sie betreffen Gast und Host. Bitte wende dich direkt an den Host.",
        ],
      },
      {
        heading: "7. So beantragst du eine Erstattung",
        paragraphs: [
          "Schreibe uns von der E-Mail-Adresse deines EasyHost-Kontos an " +
            CONTACT_EMAIL +
            ". Bitte gib an:",
        ],
        list: [
          "Die E-Mail-Adresse, mit der das Abonnement abgeschlossen wurde.",
          "Das ungefähre Datum der Belastung.",
          "Eine kurze Begründung (ein Satz reicht).",
        ],
      },
      {
        heading: "8. Dauer der Erstattung",
        paragraphs: [
          "Wir streben an, jede Anfrage innerhalb von 2 Werktagen zu prüfen. Genehmigte Erstattungen erfolgen über Paddle auf die ursprüngliche Zahlungsmethode. Der Betrag erscheint typischerweise innerhalb von 5–10 Werktagen auf deiner Abrechnung, abhängig von deiner Bank oder deinem Kartenanbieter.",
        ],
      },
      {
        heading: "9. Währung und Gebühren",
        paragraphs: [
          "Erstattungen erfolgen in derselben Währung wie die ursprüngliche Zahlung (Standard: EUR). EasyHost zieht keine Gebühren von der Erstattung ab. Etwaige Währungsumrechnungen oder Bankgebühren werden von deiner Karte oder Bank festgelegt und liegen außerhalb unserer Kontrolle.",
        ],
      },
      {
        heading: "10. Abonnement kündigen",
        paragraphs: ["Du kannst jederzeit kündigen:"],
        list: [
          "Über dein Dashboard unter /settings/billing.",
          "Über den Paddle-Kundenportal-Link in deiner letzten Rechnungs-E-Mail.",
          "Per E-Mail an " + CONTACT_EMAIL + " mit der Bitte, für dich zu kündigen.",
        ],
      },
      {
        heading: "11. Änderungen dieser Richtlinie",
        paragraphs: [
          "Wir können diese Richtlinie aktualisieren. Das Datum oben auf der Seite gibt die letzte Änderung an. Änderungen gelten nicht für Erstattungsanträge, die vor dem Inkrafttreten eingereicht wurden.",
        ],
      },
    ],
    contactHeading: "Kontakt",
    contactBody:
      "Fragen oder Erstattungsanträge? Schreibe an " +
      CONTACT_EMAIL +
      " und wir melden uns innerhalb von 2 Werktagen.",
  },
};

const LOCALE_TO_INTL: Record<Locale, string> = {
  en: "en-GB",
  al: "sq-AL",
  it: "it-IT",
  de: "de-DE",
};

function formatLastUpdated(locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(LAST_UPDATED);
}

export default async function RefundPage() {
  const raw = await getLocale();
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const c = COPY[locale];
  const lastUpdated = formatLastUpdated(locale);

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 500px at 50% 0%, rgba(225,106,74,0.08), transparent 60%), linear-gradient(180deg, #FAF8F6 0%, #F4EFE9 100%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] shadow-sm backdrop-blur">
            {c.badge}
          </span>
          <h1 className="mt-5 font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--ink)] sm:text-[52px]">
            {c.title}
          </h1>
          <p className="mt-5 text-[16.5px] leading-[1.6] text-[var(--muted)]">
            {c.intro}
          </p>
          <p className="mt-4 text-[13px] text-[var(--muted-light)]">
            {c.lastUpdatedLabel}: <time dateTime={LAST_UPDATED_ISO}>{lastUpdated}</time>
          </p>
        </div>
      </section>

      <section className="bg-[var(--canvas)]">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <article className="space-y-10">
            {c.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-[22px] font-semibold tracking-tight text-[var(--ink)] sm:text-[24px]">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, j) => (
                  <p
                    key={j}
                    className="mt-3 text-[15.5px] leading-[1.7] text-[var(--ink)]/85"
                  >
                    {p}
                  </p>
                ))}
                {s.list ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[var(--ink)]/85 marker:text-[var(--primary)]">
                    {s.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            <div className="rounded-[18px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-[20px] font-semibold tracking-tight text-[var(--ink)]">
                {c.contactHeading}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.6] text-[var(--ink)]/85">
                {c.contactBody}
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
