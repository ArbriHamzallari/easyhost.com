import { getLocale } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const dynamic = "force-static";

const LAST_UPDATED_ISO = "2026-05-12";
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
    title: "Privacy policy",
    intro:
      "This policy explains what personal data EasyHost collects when you visit easyhost.pro, join our waitlist, or create an account, and what we do with it. We try to keep it short and use plain language.",
    lastUpdatedLabel: "Last updated",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          "EasyHost is a pre-launch hospitality service operated from Tirana, Albania. We are the data controller for the personal data described in this policy. You can reach us at " +
            CONTACT_EMAIL +
            " for any privacy-related question.",
        ],
      },
      {
        heading: "2. What we collect",
        paragraphs: [
          "We collect only what we need to keep you informed and to operate the service:",
        ],
        list: [
          "Your email address — when you join the waitlist or create an account.",
          "Your name (optional) — only if you provide it during account creation.",
          "Your language preference — derived from your browser or your selection on the site.",
          "Technical metadata — the page you signed up from (for example, hero or pricing), the timestamp, and standard server logs (IP, user agent) kept briefly for security.",
          "Authentication data — managed by our auth provider Clerk. We never see or store your password.",
        ],
      },
      {
        heading: "3. Why we use it",
        paragraphs: ["We use your information for the following purposes:"],
        list: [
          "To notify you when EasyHost is ready to use.",
          "To send you a confirmation that you joined the waitlist or created an account.",
          "To let you sign back in with the same credentials when the product launches.",
          "To understand which pages drive sign-ups (in aggregate, never to profile you).",
          "To keep the service secure and operational.",
        ],
      },
      {
        heading: "4. Legal bases for processing (GDPR)",
        paragraphs: [
          "If you are in the European Economic Area or the UK, we rely on the following legal bases under Article 6 of the GDPR:",
        ],
        list: [
          "Consent — you gave it when you submitted your email. You can withdraw it at any time by emailing us.",
          "Performance of a contract — to create and maintain your account so you can use EasyHost when it launches.",
          "Legitimate interests — to keep the service secure and to understand which marketing pages work, balanced against your rights.",
        ],
      },
      {
        heading: "5. Who we share your data with",
        paragraphs: [
          "We do not sell your data. We use a small number of trusted vendors who process data on our behalf, under written data processing agreements:",
        ],
        list: [
          "Clerk — authentication, US-based, GDPR-compliant.",
          "Supabase — database hosting, with EU data residency.",
          "Resend — transactional email delivery, GDPR-compliant.",
          "Vercel — website and app hosting, GDPR-compliant.",
        ],
      },
      {
        heading: "6. International transfers",
        paragraphs: [
          "Some of our vendors are located outside the EEA, primarily in the United States. When data is transferred internationally, we rely on Standard Contractual Clauses approved by the European Commission and on each vendor's own safeguards. You can contact us for more details.",
        ],
      },
      {
        heading: "7. How long we keep it",
        paragraphs: [
          "We keep your waitlist entry and account data for as long as you want to be notified or use the service. You can ask us to delete your data at any time by emailing " +
            CONTACT_EMAIL +
            " and we will erase it within 30 days, except where we are legally required to retain it.",
        ],
      },
      {
        heading: "8. Your rights",
        paragraphs: [
          "Under the GDPR and similar laws, you have the right to:",
        ],
        list: [
          "Access the personal data we hold about you.",
          "Correct inaccurate data.",
          "Have your data erased.",
          "Restrict or object to how we use it.",
          "Receive a copy of your data in a portable format.",
          "Withdraw consent at any time.",
          "Lodge a complaint with your local data protection authority.",
        ],
        // body via paragraphs below would be redundant; relying on list + contact section
      },
      {
        heading: "9. Cookies and similar technologies",
        paragraphs: [
          "We use a minimal set of cookies:",
        ],
        list: [
          "Authentication cookies set by Clerk — required to keep you signed in.",
          "A language preference cookie (easyhost-locale) so the site loads in your language.",
        ],
      },
      {
        heading: "10. Children",
        paragraphs: [
          "EasyHost is built for adults who host short-term rentals. The service is not directed at children under 16, and we do not knowingly collect data from them.",
        ],
      },
      {
        heading: "11. Changes to this policy",
        paragraphs: [
          "We may update this policy from time to time. The date at the top of the page reflects the most recent change. Material changes will be communicated by email where possible.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactBody:
      "Questions, requests, or complaints about this policy? Email " +
      CONTACT_EMAIL +
      ". We answer every message.",
  },
  al: {
    badge: "Ligjor",
    title: "Politika e privatësisë",
    intro:
      "Kjo politikë shpjegon çfarë të dhënash personale mbledh EasyHost kur viziton easyhost.pro, bashkohesh me listën e pritjes ose krijon një llogari, dhe çfarë bëjmë me to. E mbajmë të shkurtër dhe me gjuhë të thjeshtë.",
    lastUpdatedLabel: "Përditësuar më",
    sections: [
      {
        heading: "1. Kush jemi",
        paragraphs: [
          "EasyHost është një shërbim mikpritjeje në fazë para-lansimi, që operon nga Tirana, Shqipëri. Ne jemi kontrolluesi i të dhënave për informacionin personal të përshkruar në këtë politikë. Mund të na kontaktoni në " +
            CONTACT_EMAIL +
            " për çdo pyetje që lidhet me privatësinë.",
        ],
      },
      {
        heading: "2. Çfarë mbledhim",
        paragraphs: [
          "Mbledhim vetëm atë që na duhet për të të mbajtur të informuar dhe për të operuar shërbimin:",
        ],
        list: [
          "Adresën tënde të email-it — kur bashkohesh me listën e pritjes ose krijon një llogari.",
          "Emrin tënd (opsional) — vetëm nëse e jep gjatë krijimit të llogarisë.",
          "Gjuhën e preferuar — e nxjerrë nga shfletuesi yt ose nga zgjedhja jote në faqe.",
          "Metadata teknike — faqja prej të cilës u regjistrove (p.sh., hero ose pricing), data dhe ora, si dhe regjistrat standardë të serverit (IP, user agent) që mbahen shkurtimisht për siguri.",
          "Të dhëna identifikimi — të menaxhuara nga ofruesi ynë Clerk. Ne nuk e shohim e nuk e ruajmë kurrë fjalëkalimin tënd.",
        ],
      },
      {
        heading: "3. Pse i përdorim",
        paragraphs: ["I përdorim të dhënat e tua për këto qëllime:"],
        list: [
          "Për të të njoftuar kur EasyHost të jetë gati për përdorim.",
          "Për të të dërguar një konfirmim që iu bashkove listës ose krijuar llogari.",
          "Për të të lejuar të identifikohesh me të njëjtat kredenciale kur produkti të lansohet.",
          "Për të kuptuar cilat faqe sjellin regjistrime (në mënyrë të përgjithësuar, kurrë për të krijuar profile për ty).",
          "Për të mbajtur shërbimin të sigurt dhe operativ.",
        ],
      },
      {
        heading: "4. Bazat ligjore për përpunimin (GDPR)",
        paragraphs: [
          "Nëse ndodhesh në Zonën Ekonomike Evropiane ose Britani të Madhe, mbështetemi në këto baza ligjore sipas Nenit 6 të GDPR:",
        ],
        list: [
          "Pëlqimi — e dhe kur dërgove email-in. Mund ta tërheqësh në çdo kohë duke na shkruar.",
          "Përmbushja e një kontrate — për të krijuar dhe mbajtur llogarinë tënde që të përdorësh EasyHost kur të lansohet.",
          "Interesat legjitime — për të mbajtur shërbimin të sigurt dhe për të kuptuar cilat faqe marketingu funksionojnë, gjithmonë në balancë me të drejtat e tua.",
        ],
      },
      {
        heading: "5. Me kë i ndajmë të dhënat",
        paragraphs: [
          "Nuk i shesim të dhënat e tua. Përdorim disa furnizues të besuar që përpunojnë të dhëna në emrin tonë, sipas marrëveshjeve të shkruara të përpunimit:",
        ],
        list: [
          "Clerk — autentifikim, me bazë në SHBA, në përputhje me GDPR.",
          "Supabase — strehim baze të dhënash, me rezidencë të dhënash në BE.",
          "Resend — dërgim email-esh transaksionale, në përputhje me GDPR.",
          "Vercel — strehim i faqes dhe aplikacionit, në përputhje me GDPR.",
        ],
      },
      {
        heading: "6. Transferimet ndërkombëtare",
        paragraphs: [
          "Disa nga furnizuesit tanë janë jashtë ZEE, kryesisht në Shtetet e Bashkuara. Kur të dhënat transferohen ndërkombëtarisht, mbështetemi në Klauzolat Kontraktuale Standarde të miratuara nga Komisioni Evropian dhe në masat mbrojtëse të vetë furnizuesve. Mund të na kontaktosh për detaje të mëtejshme.",
        ],
      },
      {
        heading: "7. Sa kohë i mbajmë",
        paragraphs: [
          "I mbajmë të dhënat e listës dhe të llogarisë për aq kohë sa dëshiron të njoftohesh ose të përdorësh shërbimin. Mund të na kërkosh fshirjen e të dhënave në çdo kohë duke shkruar te " +
            CONTACT_EMAIL +
            " dhe do t'i fshijmë brenda 30 ditësh, përveç rasteve kur ligji na detyron t'i ruajmë.",
        ],
      },
      {
        heading: "8. Të drejtat e tua",
        paragraphs: ["Sipas GDPR dhe ligjeve të ngjashme, ke të drejtën të:"],
        list: [
          "Aksesosh të dhënat personale që mbajmë për ty.",
          "Korrigjosh të dhënat e pasakta.",
          "Të fshish të dhënat e tua.",
          "Kufizosh ose të kundërshtosh përdorimin tonë.",
          "Marrësh një kopje të të dhënave në format të transferueshëm.",
          "Tërheqësh pëlqimin në çdo kohë.",
          "Bësh ankesë te autoriteti yt lokal i mbrojtjes së të dhënave.",
        ],
      },
      {
        heading: "9. Cookies dhe teknologji të ngjashme",
        paragraphs: ["Përdorim një grup minimal cookies:"],
        list: [
          "Cookies autentifikimi nga Clerk — të nevojshme për të të mbajtur të identifikuar.",
          "Një cookie për gjuhën e preferuar (easyhost-locale) që faqja të ngarkohet në gjuhën tënde.",
        ],
      },
      {
        heading: "10. Fëmijët",
        paragraphs: [
          "EasyHost është ndërtuar për të rritur që menaxhojnë qira afatshkurtra. Shërbimi nuk u drejtohet fëmijëve nën 16 vjeç dhe nuk mbledhim me dije të dhëna prej tyre.",
        ],
      },
      {
        heading: "11. Ndryshimet në këtë politikë",
        paragraphs: [
          "Mund ta përditësojmë këtë politikë herë pas here. Data në krye të faqes pasqyron ndryshimin më të fundit. Ndryshimet thelbësore do të komunikohen me email kur është e mundur.",
        ],
      },
    ],
    contactHeading: "Kontakti",
    contactBody:
      "Pyetje, kërkesa ose ankesa rreth kësaj politike? Na shkruaj te " +
      CONTACT_EMAIL +
      ". I përgjigjemi çdo mesazhi.",
  },
  it: {
    badge: "Legale",
    title: "Informativa sulla privacy",
    intro:
      "Questa informativa spiega quali dati personali raccoglie EasyHost quando visiti easyhost.pro, ti iscrivi alla waitlist o crei un account, e cosa ne facciamo. Cerchiamo di essere brevi e di usare un linguaggio chiaro.",
    lastUpdatedLabel: "Aggiornata il",
    sections: [
      {
        heading: "1. Chi siamo",
        paragraphs: [
          "EasyHost è un servizio per l'ospitalità in fase pre-lancio, gestito da Tirana, Albania. Siamo il titolare del trattamento dei dati personali descritti in questa informativa. Puoi contattarci a " +
            CONTACT_EMAIL +
            " per qualsiasi domanda relativa alla privacy.",
        ],
      },
      {
        heading: "2. Cosa raccogliamo",
        paragraphs: [
          "Raccogliamo solo quanto ci serve per tenerti informato e gestire il servizio:",
        ],
        list: [
          "Il tuo indirizzo email — quando ti iscrivi alla waitlist o crei un account.",
          "Il tuo nome (facoltativo) — solo se lo fornisci durante la creazione dell'account.",
          "La tua lingua preferita — dedotta dal browser o dalla tua selezione sul sito.",
          "Metadati tecnici — la pagina da cui ti sei iscritto (ad esempio, hero o pricing), data e ora, e i log standard del server (IP, user agent) conservati brevemente per sicurezza.",
          "Dati di autenticazione — gestiti dal nostro provider Clerk. Non vediamo né conserviamo mai la tua password.",
        ],
      },
      {
        heading: "3. Perché li usiamo",
        paragraphs: ["Usiamo le tue informazioni per i seguenti scopi:"],
        list: [
          "Per avvisarti quando EasyHost sarà pronto all'uso.",
          "Per inviarti una conferma di iscrizione alla waitlist o di creazione dell'account.",
          "Per permetterti di accedere nuovamente con le stesse credenziali quando il prodotto sarà lanciato.",
          "Per capire quali pagine portano iscrizioni (in forma aggregata, mai per profilarti).",
          "Per mantenere il servizio sicuro e operativo.",
        ],
      },
      {
        heading: "4. Basi giuridiche del trattamento (GDPR)",
        paragraphs: [
          "Se ti trovi nello Spazio Economico Europeo o nel Regno Unito, ci basiamo sulle seguenti basi giuridiche ai sensi dell'articolo 6 del GDPR:",
        ],
        list: [
          "Consenso — lo hai dato quando hai inviato la tua email. Puoi ritirarlo in qualsiasi momento scrivendoci.",
          "Esecuzione di un contratto — per creare e mantenere il tuo account affinché tu possa usare EasyHost al lancio.",
          "Legittimi interessi — per mantenere il servizio sicuro e capire quali pagine di marketing funzionano, bilanciati con i tuoi diritti.",
        ],
      },
      {
        heading: "5. Con chi condividiamo i tuoi dati",
        paragraphs: [
          "Non vendiamo i tuoi dati. Usiamo un piccolo numero di fornitori fidati che trattano i dati per nostro conto, sulla base di accordi scritti:",
        ],
        list: [
          "Clerk — autenticazione, con sede negli USA, conforme al GDPR.",
          "Supabase — hosting del database, con residenza dei dati in UE.",
          "Resend — invio di email transazionali, conforme al GDPR.",
          "Vercel — hosting del sito e dell'applicazione, conforme al GDPR.",
        ],
      },
      {
        heading: "6. Trasferimenti internazionali",
        paragraphs: [
          "Alcuni dei nostri fornitori si trovano fuori dallo SEE, principalmente negli Stati Uniti. Quando i dati vengono trasferiti a livello internazionale, ci basiamo sulle Clausole Contrattuali Standard approvate dalla Commissione Europea e sulle salvaguardie di ciascun fornitore. Contattaci per maggiori dettagli.",
        ],
      },
      {
        heading: "7. Per quanto tempo li conserviamo",
        paragraphs: [
          "Conserviamo i dati della waitlist e del tuo account finché desideri essere informato o usare il servizio. Puoi chiederci di cancellare i tuoi dati in qualsiasi momento scrivendo a " +
            CONTACT_EMAIL +
            " e li cancelleremo entro 30 giorni, salvo dove siamo legalmente obbligati a conservarli.",
        ],
      },
      {
        heading: "8. I tuoi diritti",
        paragraphs: [
          "Ai sensi del GDPR e di leggi analoghe, hai il diritto di:",
        ],
        list: [
          "Accedere ai dati personali che ti riguardano.",
          "Correggere dati inesatti.",
          "Ottenere la cancellazione dei tuoi dati.",
          "Limitare o opporti al loro uso.",
          "Ricevere una copia dei tuoi dati in formato portabile.",
          "Ritirare il consenso in qualsiasi momento.",
          "Presentare un reclamo all'autorità di controllo locale.",
        ],
      },
      {
        heading: "9. Cookie e tecnologie simili",
        paragraphs: ["Usiamo un set minimo di cookie:"],
        list: [
          "Cookie di autenticazione impostati da Clerk — necessari per mantenerti collegato.",
          "Un cookie per la lingua preferita (easyhost-locale) affinché il sito si carichi nella tua lingua.",
        ],
      },
      {
        heading: "10. Minori",
        paragraphs: [
          "EasyHost è pensato per adulti che gestiscono affitti brevi. Il servizio non è rivolto a minori di 16 anni e non raccogliamo consapevolmente dati da loro.",
        ],
      },
      {
        heading: "11. Modifiche a questa informativa",
        paragraphs: [
          "Possiamo aggiornare questa informativa di tanto in tanto. La data in cima alla pagina riflette l'ultima modifica. Le modifiche sostanziali saranno comunicate via email ove possibile.",
        ],
      },
    ],
    contactHeading: "Contatti",
    contactBody:
      "Domande, richieste o reclami su questa informativa? Scrivici a " +
      CONTACT_EMAIL +
      ". Rispondiamo a ogni messaggio.",
  },
  de: {
    badge: "Rechtliches",
    title: "Datenschutzerklärung",
    intro:
      "Diese Erklärung beschreibt, welche personenbezogenen Daten EasyHost erhebt, wenn du easyhost.pro besuchst, dich auf die Warteliste setzt oder ein Konto erstellst, und was wir damit tun. Wir halten sie kurz und in klarer Sprache.",
    lastUpdatedLabel: "Zuletzt aktualisiert",
    sections: [
      {
        heading: "1. Wer wir sind",
        paragraphs: [
          "EasyHost ist ein Beherbergungsdienst in der Phase vor dem Start, betrieben von Tirana, Albanien. Wir sind der Verantwortliche für die in dieser Erklärung beschriebenen personenbezogenen Daten. Bei Fragen zum Datenschutz erreichst du uns unter " +
            CONTACT_EMAIL +
            ".",
        ],
      },
      {
        heading: "2. Was wir erheben",
        paragraphs: [
          "Wir erheben nur das, was wir brauchen, um dich zu informieren und den Dienst zu betreiben:",
        ],
        list: [
          "Deine E-Mail-Adresse — wenn du dich auf die Warteliste setzt oder ein Konto erstellst.",
          "Deinen Namen (optional) — nur wenn du ihn beim Erstellen des Kontos angibst.",
          "Deine Spracheinstellung — aus deinem Browser oder deiner Auswahl auf der Website.",
          "Technische Metadaten — die Seite, von der du dich angemeldet hast (z. B. Hero oder Pricing), Zeitstempel sowie übliche Serverprotokolle (IP, User-Agent), die kurz aus Sicherheitsgründen aufbewahrt werden.",
          "Anmeldedaten — verwaltet durch unseren Auth-Anbieter Clerk. Wir sehen oder speichern dein Passwort nie.",
        ],
      },
      {
        heading: "3. Wofür wir die Daten nutzen",
        paragraphs: ["Wir verwenden deine Daten zu folgenden Zwecken:"],
        list: [
          "Um dich zu benachrichtigen, sobald EasyHost einsatzbereit ist.",
          "Um dir eine Bestätigung für die Wartelisten-Anmeldung oder die Kontoerstellung zu schicken.",
          "Damit du dich mit denselben Zugangsdaten anmelden kannst, wenn das Produkt startet.",
          "Um zu verstehen, welche Seiten Anmeldungen bringen (aggregiert, nicht zur Profilbildung).",
          "Um den Dienst sicher und betriebsbereit zu halten.",
        ],
      },
      {
        heading: "4. Rechtsgrundlagen der Verarbeitung (DSGVO)",
        paragraphs: [
          "Wenn du dich im Europäischen Wirtschaftsraum oder im Vereinigten Königreich befindest, stützen wir uns auf folgende Rechtsgrundlagen nach Artikel 6 DSGVO:",
        ],
        list: [
          "Einwilligung — du hast sie mit der Übermittlung deiner E-Mail erteilt. Du kannst sie jederzeit per E-Mail an uns widerrufen.",
          "Vertragserfüllung — um dein Konto zu erstellen und zu verwalten, damit du EasyHost nach dem Start nutzen kannst.",
          "Berechtigte Interessen — um den Dienst sicher zu halten und zu verstehen, welche Marketingseiten funktionieren, abgewogen gegen deine Rechte.",
        ],
      },
      {
        heading: "5. An wen wir Daten weitergeben",
        paragraphs: [
          "Wir verkaufen deine Daten nicht. Wir nutzen einige vertrauenswürdige Anbieter, die Daten in unserem Auftrag verarbeiten, auf Grundlage schriftlicher Auftragsverarbeitungsverträge:",
        ],
        list: [
          "Clerk — Authentifizierung, Sitz in den USA, DSGVO-konform.",
          "Supabase — Datenbank-Hosting mit Datenresidenz in der EU.",
          "Resend — Versand transaktionaler E-Mails, DSGVO-konform.",
          "Vercel — Hosting von Website und App, DSGVO-konform.",
        ],
      },
      {
        heading: "6. Internationale Übermittlungen",
        paragraphs: [
          "Einige unserer Anbieter sitzen außerhalb des EWR, vor allem in den USA. Bei internationalen Übermittlungen stützen wir uns auf die von der Europäischen Kommission genehmigten Standardvertragsklauseln sowie auf die Schutzmaßnahmen der jeweiligen Anbieter. Für Details kannst du uns kontaktieren.",
        ],
      },
      {
        heading: "7. Wie lange wir Daten speichern",
        paragraphs: [
          "Wir speichern deine Wartelisten- und Kontodaten so lange, wie du benachrichtigt werden oder den Dienst nutzen möchtest. Du kannst jederzeit die Löschung deiner Daten verlangen, indem du an " +
            CONTACT_EMAIL +
            " schreibst; wir löschen sie dann innerhalb von 30 Tagen, sofern wir nicht gesetzlich zur Aufbewahrung verpflichtet sind.",
        ],
      },
      {
        heading: "8. Deine Rechte",
        paragraphs: [
          "Nach der DSGVO und ähnlichen Gesetzen hast du das Recht auf:",
        ],
        list: [
          "Auskunft über die zu deiner Person gespeicherten Daten.",
          "Berichtigung unrichtiger Daten.",
          "Löschung deiner Daten.",
          "Einschränkung oder Widerspruch gegen die Verarbeitung.",
          "Erhalt einer Kopie deiner Daten in einem übertragbaren Format.",
          "Widerruf deiner Einwilligung jederzeit.",
          "Beschwerde bei deiner zuständigen Datenschutzaufsichtsbehörde.",
        ],
      },
      {
        heading: "9. Cookies und ähnliche Technologien",
        paragraphs: ["Wir nutzen ein Minimum an Cookies:"],
        list: [
          "Authentifizierungs-Cookies von Clerk — notwendig, um dich angemeldet zu halten.",
          "Ein Cookie für deine Spracheinstellung (easyhost-locale), damit die Seite in deiner Sprache lädt.",
        ],
      },
      {
        heading: "10. Kinder",
        paragraphs: [
          "EasyHost richtet sich an Erwachsene, die Kurzzeitunterkünfte vermieten. Der Dienst ist nicht für Kinder unter 16 Jahren bestimmt, und wir erheben wissentlich keine Daten von ihnen.",
        ],
      },
      {
        heading: "11. Änderungen dieser Erklärung",
        paragraphs: [
          "Wir können diese Erklärung gelegentlich aktualisieren. Das Datum oben auf der Seite zeigt die letzte Änderung. Wesentliche Änderungen kommunizieren wir wenn möglich per E-Mail.",
        ],
      },
    ],
    contactHeading: "Kontakt",
    contactBody:
      "Fragen, Anfragen oder Beschwerden zu dieser Erklärung? Schreib uns an " +
      CONTACT_EMAIL +
      ". Wir antworten auf jede Nachricht.",
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

export default async function PrivacyPage() {
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
