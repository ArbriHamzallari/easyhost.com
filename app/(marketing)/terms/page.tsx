import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Terms of Service — EasyHost",
  description:
    "The terms and conditions that govern your use of EasyHost.",
  openGraph: {
    title: "Terms of Service — EasyHost",
    description:
      "The terms and conditions that govern your use of EasyHost.",
    url: "https://easyhost.pro/terms",
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
const COMPANY = "EasyHost";
const JURISDICTION_EN = "Albania";
const JURISDICTION_AL = "Shqipëri";
const JURISDICTION_IT = "Albania";
const JURISDICTION_DE = "Albanien";

const COPY: Record<Locale, Content> = {
  en: {
    badge: "Legal",
    title: "Terms of Service",
    intro:
      "These terms govern your access to and use of EasyHost. By creating an account or using the service, you agree to them. Please read carefully — they explain how the product is provided, how billing works, and what each side is responsible for.",
    lastUpdatedLabel: "Last updated",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          COMPANY +
            " is a software-as-a-service product operated from Tirana, " +
            JURISDICTION_EN +
            ". Throughout these terms, \"EasyHost,\" \"we,\" \"us,\" and \"our\" refer to EasyHost. \"You\" refers to the individual or legal entity that creates an account.",
          "You can reach us at " + CONTACT_EMAIL + " for any question about these terms.",
        ],
      },
      {
        heading: "2. The service",
        paragraphs: [
          "EasyHost lets short-term rental hosts and hospitality operators (\"hosts\") build a branded digital menu, place a QR code in their rental, and accept orders from guests for in-room items and add-on services.",
          "EasyHost provides software only. We do not own, operate, sell, or fulfil the items listed on host menus, and we are not a party to any transaction between a host and a guest.",
        ],
      },
      {
        heading: "3. Account and eligibility",
        paragraphs: [
          "You must be at least 18 years old and able to enter a binding contract to use EasyHost. You are responsible for keeping your login credentials secure and for everything that happens under your account.",
          "When you sign up, you create an Organization that may contain one or more Properties. You may add team members later. You are responsible for everything your team members do under your Organization.",
        ],
      },
      {
        heading: "4. Plans, trial, and billing",
        paragraphs: [
          "EasyHost is offered on monthly subscription plans. Current plans and prices are shown on /pricing and may change with notice. Today the plans are:",
        ],
        list: [
          "Starter — €15 per month, one property.",
          "Pro — €29 per month, up to five properties.",
        ],
      },
      {
        heading: "5. Free trial",
        paragraphs: [
          "Every new account gets a 7-day free trial. No payment method is required to start the trial. During the trial you can build and test your menus, generate QR codes, and connect a payment account. After the trial, action features (accepting guest orders, adding properties, generating new QR codes) are locked until a paid plan is activated. Your data is retained.",
        ],
      },
      {
        heading: "6. Payments and the role of Paddle",
        paragraphs: [
          "Subscription fees are processed by Paddle.com Inc. and its affiliates (\"Paddle\"), our merchant of record. When you subscribe, Paddle charges your selected payment method, handles VAT, and issues invoices. Paddle's terms (paddle.com/legal) apply to that transaction in addition to ours.",
          "Subscriptions renew automatically every month at the then-current price unless cancelled. You can cancel any time from /settings/billing or via the Paddle customer portal. After cancellation, your plan remains active until the end of the paid period.",
          "Failed payments: if a charge fails, we will retry it and notify you. If the subscription remains unpaid, action features are locked until payment is restored.",
        ],
      },
      {
        heading: "7. Guest payments",
        paragraphs: [
          "Guests pay hosts directly through a payment connection that the host owns. Supported methods include Stripe Connect (card, Apple Pay, Google Pay), bank transfer via IBAN, and cash recorded by the host.",
          "EasyHost is not a payment institution. We do not touch guest funds, do not hold money on behalf of hosts or guests, and are not responsible for tax, refunds, chargebacks, or disputes between a host and a guest. The host is the seller of record for every guest transaction.",
        ],
      },
      {
        heading: "8. Your content",
        paragraphs: [
          "You retain ownership of everything you upload: logos, photos, menu names, descriptions, prices, branding, and any other materials (\"your content\"). You grant us a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, translate, and display your content solely to operate the service for you and your guests.",
          "You are responsible for ensuring you have the right to use the content you upload and that it complies with applicable law, including alcohol-sales rules and food-safety regulations where relevant.",
        ],
      },
      {
        heading: "9. Acceptable use",
        paragraphs: [
          "When using EasyHost, you agree not to:",
        ],
        list: [
          "Use the service to sell illegal items or services, or items prohibited by your local laws.",
          "Misrepresent the price, content, or availability of items on your menu.",
          "Upload content that infringes anyone else's intellectual property, privacy, or other rights.",
          "Attempt to gain unauthorised access to other accounts, our systems, or our infrastructure.",
          "Resell or sublicense EasyHost to third parties without our written permission.",
          "Use EasyHost to send spam, harass, or harm guests or other users.",
        ],
      },
      {
        heading: "10. Service availability and changes",
        paragraphs: [
          "We aim for high availability, but the service is provided on an \"as is\" and \"as available\" basis. We may modify, suspend, or discontinue features with reasonable notice. For material changes that adversely affect paying customers, we will give at least 30 days' notice.",
          "Scheduled maintenance is announced in advance whenever possible. Emergency maintenance may happen without notice.",
        ],
      },
      {
        heading: "11. Termination",
        paragraphs: [
          "You can cancel your subscription at any time. We may suspend or terminate your account if you materially breach these terms, fail to pay, or use the service in a way that endangers other users or our infrastructure. We will give notice and a chance to cure where reasonable.",
          "On termination, action features are disabled. You can request an export of your data within 30 days; after that, we may delete it, subject to any legal retention obligations.",
        ],
      },
      {
        heading: "12. Disclaimer and limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, EasyHost is provided without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted, error-free, or meet every requirement.",
          "Our total liability to you for all claims arising out of or relating to the service is limited to the amounts you paid us in the 12 months before the event giving rise to the claim. We are not liable for indirect, incidental, consequential, or punitive damages, or for loss of profits, revenue, data, or goodwill.",
          "Nothing in these terms excludes liability that cannot be excluded by law (for example, for fraud or gross negligence, or rights you have as a consumer in your country).",
        ],
      },
      {
        heading: "13. Indemnity",
        paragraphs: [
          "You agree to indemnify and hold EasyHost harmless from claims arising out of your content, your sale of items to guests, or your breach of these terms — except to the extent caused by our negligence or wilful misconduct.",
        ],
      },
      {
        heading: "14. Governing law and disputes",
        paragraphs: [
          "These terms are governed by the laws of " +
            JURISDICTION_EN +
            ", without regard to conflict-of-laws principles. Disputes will be brought before the competent courts of Tirana, " +
            JURISDICTION_EN +
            ". If you are a consumer resident in the EU, you keep the protections of the mandatory consumer law of your country.",
        ],
      },
      {
        heading: "15. Changes to these terms",
        paragraphs: [
          "We may update these terms. The date at the top of the page reflects the most recent change. For material changes we will notify paying customers by email at least 30 days in advance. Continued use of the service after changes take effect means you accept them.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactBody:
      "Questions about these terms? Email " +
      CONTACT_EMAIL +
      ". We answer every message.",
  },
  al: {
    badge: "Ligjor",
    title: "Kushtet e shërbimit",
    intro:
      "Këto kushte rregullojnë aksesin dhe përdorimin tënd të EasyHost. Duke krijuar një llogari ose duke përdorur shërbimin, ti i pranon ato. Të lutem lexoji me kujdes — shpjegojnë si ofrohet produkti, si funksionon faturimi dhe për çfarë është përgjegjëse secila palë.",
    lastUpdatedLabel: "Përditësuar më",
    sections: [
      {
        heading: "1. Kush jemi",
        paragraphs: [
          COMPANY +
            " është një shërbim software-i (SaaS) i operuar nga Tirana, " +
            JURISDICTION_AL +
            ". Përgjatë këtyre kushteve, “EasyHost”, “ne”, “neve” dhe “tonë/tona” i referohen EasyHost. “Ti” i referohet individit ose entitetit ligjor që krijon një llogari.",
          "Mund të na shkruash në " + CONTACT_EMAIL + " për çdo pyetje që lidhet me këto kushte.",
        ],
      },
      {
        heading: "2. Shërbimi",
        paragraphs: [
          "EasyHost u lejon menaxherëve të qirave afatshkurtra dhe operatorëve të mikpritjes (“mikpritësve”) të ndërtojnë një menu dixhitale të brendshme, të vendosin një kod QR në njësinë e tyre dhe të pranojnë porosi nga mysafirët për produkte dhe shërbime shtesë.",
          "EasyHost ofron vetëm software. Ne nuk i zotërojmë, nuk i operojmë, nuk i shesim dhe nuk i përgatisim produktet e listuara në menutë e mikpritësve, dhe nuk jemi palë në asnjë transaksion mes mikpritësit dhe mysafirit.",
        ],
      },
      {
        heading: "3. Llogaria dhe kushtet e pranueshmërisë",
        paragraphs: [
          "Duhet të jesh të paktën 18 vjeç dhe i aftë të lidhësh një kontratë detyruese për të përdorur EasyHost. Je përgjegjës për ruajtjen e të dhënave të identifikimit dhe për gjithçka që ndodh nën llogarinë tënde.",
          "Kur regjistrohesh, krijon një Organizatë që mund të ketë një ose më shumë Prona. Mund të shtosh anëtarë të ekipit më vonë. Je përgjegjës për gjithçka që bëjnë anëtarët e ekipit nën Organizatën tënde.",
        ],
      },
      {
        heading: "4. Planet, prova dhe faturimi",
        paragraphs: [
          "EasyHost ofrohet me plane mujore abonimi. Planet aktuale dhe çmimet janë në /pricing dhe mund të ndryshojnë me njoftim paraprak. Sot planet janë:",
        ],
        list: [
          "Starter — 15 € në muaj, një pronë.",
          "Pro — 29 € në muaj, deri në pesë prona.",
        ],
      },
      {
        heading: "5. Prova falas",
        paragraphs: [
          "Çdo llogari e re përfiton 7 ditë provë falas. Nuk kërkohet metodë pagese për të nisur provën. Gjatë provës mund të ndërtosh dhe testosh menutë, të gjenerosh kode QR dhe të lidhësh një llogari pagese. Pas provës, funksionet aktive (pranimi i porosive, shtimi i pronave, gjenerimi i kodeve të reja QR) bllokohen derisa të aktivizohet një plan me pagesë. Të dhënat e tua ruhen.",
        ],
      },
      {
        heading: "6. Pagesat dhe roli i Paddle",
        paragraphs: [
          "Tarifat e abonimit përpunohen nga Paddle.com Inc. dhe filialet e saj (“Paddle”), tregtari ynë i regjistruar. Kur abonohesh, Paddle tërheq pagesën nga metoda që zgjedh, menaxhon TVSH-në dhe lëshon faturat. Kushtet e Paddle (paddle.com/legal) zbatohen për atë transaksion, krahas tonave.",
          "Abonimet rinovohen automatikisht çdo muaj me çmimin në fuqi, përveç kur anulohen. Mund të anulosh në çdo kohë nga /settings/billing ose nga portali i klientit i Paddle. Pas anulimit, plani mbetet aktiv deri në fund të periudhës së paguar.",
          "Pagesa të dështuara: nëse një tarifim dështon, do ta riprovojmë dhe do të njoftojmë. Nëse abonimi mbetet i papaguar, funksionet aktive bllokohen derisa pagesa të rikthehet.",
        ],
      },
      {
        heading: "7. Pagesat e mysafirëve",
        paragraphs: [
          "Mysafirët paguajnë mikpritësit drejtpërdrejt, përmes një lidhjeje pagese që mikpritësi zotëron. Metodat e mbështetura përfshijnë Stripe Connect (kartë, Apple Pay, Google Pay), transfertë bankare me IBAN dhe para në dorë të regjistruara nga mikpritësi.",
          "EasyHost nuk është institucion pagese. Ne nuk i prekim fondet e mysafirëve, nuk mbajmë para në emër të mikpritësve ose mysafirëve dhe nuk jemi përgjegjës për taksa, rimbursime, chargeback-e apo mosmarrëveshje mes mikpritësit dhe mysafirit. Mikpritësi është shitësi i regjistruar për çdo transaksion mysafiri.",
        ],
      },
      {
        heading: "8. Përmbajtja jote",
        paragraphs: [
          "Ti mban pronësinë e çdo gjëje që ngarkon: logot, fotot, emrat e produkteve, përshkrimet, çmimet, branding-un dhe çdo material tjetër (“përmbajtja jote”). Na jep një licencë botërore, jo-ekskluzive dhe pa pagesë, për të strehuar, ruajtur, riprodhuar, përkthyer dhe shfaqur përmbajtjen tënde vetëm për të operuar shërbimin për ty dhe mysafirët e tu.",
          "Je përgjegjës që ke të drejtën të përdorësh përmbajtjen që ngarkon dhe që ajo është në përputhje me ligjin e zbatueshëm, përfshirë rregullat për shitjen e alkoolit dhe sigurinë ushqimore kur është rasti.",
        ],
      },
      {
        heading: "9. Përdorimi i pranueshëm",
        paragraphs: ["Duke përdorur EasyHost, pranon të mos:"],
        list: [
          "Përdorësh shërbimin për të shitur produkte ose shërbime të paligjshme, ose të ndaluara nga ligjet vendore.",
          "Shtremborosh çmimin, përmbajtjen ose disponueshmërinë e artikujve në menunë tënde.",
          "Ngarkosh përmbajtje që cenon pronësinë intelektuale, privatësinë ose të drejtat e të tjerëve.",
          "Tentosh të hysh pa autorizim në llogari, sisteme ose infrastrukturë tonën.",
          "Rishesh ose nën-licencosh EasyHost te palë të treta pa lejen tonë me shkrim.",
          "Përdorësh EasyHost për të dërguar spam, ngacmuar ose dëmtuar mysafirët apo përdoruesit e tjerë.",
        ],
      },
      {
        heading: "10. Disponueshmëria dhe ndryshimet",
        paragraphs: [
          "Synojmë disponueshmëri të lartë, por shërbimi ofrohet “ashtu siç është” dhe “sipas disponueshmërisë”. Mund të modifikojmë, pezullojmë ose ndërpresim funksione me njoftim të arsyeshëm. Për ndryshime thelbësore që ndikojnë negativisht klientët me pagesë, do të njoftojmë të paktën 30 ditë përpara.",
          "Mirëmbajtjet e planifikuara njoftohen paraprakisht sa herë është e mundur. Mirëmbajtjet emergjente mund të ndodhin pa njoftim.",
        ],
      },
      {
        heading: "11. Përfundimi",
        paragraphs: [
          "Mund ta anulosh abonimin në çdo kohë. Ne mund të pezullojmë ose mbyllim llogarinë tënde nëse shkel këto kushte materialisht, nuk paguan ose përdor shërbimin në mënyrë që rrezikon përdoruesit ose infrastrukturën tonë. Do të japim njoftim dhe mundësi për rregullim kur është e arsyeshme.",
          "Pas përfundimit, funksionet aktive çaktivizohen. Mund të kërkosh eksportim të të dhënave brenda 30 ditësh; pas kësaj, mund t’i fshijmë, sipas detyrimeve ligjore për ruajtjen.",
        ],
      },
      {
        heading: "12. Kufizimi i përgjegjësisë",
        paragraphs: [
          "Në masën më të lartë të lejuar me ligj, EasyHost ofrohet pa asnjë garanci, të shprehur ose të nënkuptuar. Nuk garantojmë se shërbimi do të jetë i pandërprerë, pa gabime apo do të përmbushë çdo nevojë.",
          "Përgjegjësia jonë totale ndaj teje për të gjitha pretendimet që lidhen me shërbimin kufizohet në shumat që na ke paguar gjatë 12 muajve para ngjarjes që krijon pretendimin. Nuk jemi përgjegjës për dëme indirekte, të rastësishme, pasuese ose ndëshkuese, ose për humbje fitimi, të ardhurash, të dhënash apo emri tregtar.",
          "Asgjë në këto kushte nuk përjashton përgjegjësinë që nuk mund të përjashtohet me ligj (p.sh. mashtrim ose neglizhencë e rëndë, ose të drejta që ke si konsumator në vendin tënd).",
        ],
      },
      {
        heading: "13. Zhdëmtimi",
        paragraphs: [
          "Bie dakord të mbash EasyHost të pa-përgjegjshëm për pretendimet që rrjedhin nga përmbajtja jote, shitja e artikujve te mysafirët ose shkelja jote e këtyre kushteve — përveç në masën që shkaktohen nga neglizhenca ose sjellja e qëllimshme jonë.",
        ],
      },
      {
        heading: "14. Ligji në fuqi dhe mosmarrëveshjet",
        paragraphs: [
          "Këto kushte rregullohen nga ligjet e " +
            JURISDICTION_AL +
            ", pa marrë parasysh parimet e konfliktit të ligjeve. Mosmarrëveshjet do të paraqiten para gjykatave kompetente të Tiranës, " +
            JURISDICTION_AL +
            ". Nëse je konsumator me banim në BE, ruan mbrojtjet e ligjit të detyrueshëm të konsumatorit në vendin tënd.",
        ],
      },
      {
        heading: "15. Ndryshimet në këto kushte",
        paragraphs: [
          "Mund t’i përditësojmë këto kushte. Data në krye të faqes pasqyron ndryshimin më të fundit. Për ndryshime thelbësore, do të njoftojmë klientët me pagesë me email të paktën 30 ditë përpara. Vazhdimi i përdorimit pas hyrjes në fuqi do të thotë që i pranon ndryshimet.",
        ],
      },
    ],
    contactHeading: "Kontakti",
    contactBody:
      "Pyetje për këto kushte? Na shkruaj te " +
      CONTACT_EMAIL +
      ". I përgjigjemi çdo mesazhi.",
  },
  it: {
    badge: "Legale",
    title: "Termini di servizio",
    intro:
      "Questi termini regolano l'accesso e l'uso di EasyHost. Creando un account o utilizzando il servizio, li accetti. Leggili con attenzione: spiegano come viene fornito il prodotto, come funziona la fatturazione e di cosa è responsabile ciascuna parte.",
    lastUpdatedLabel: "Aggiornati il",
    sections: [
      {
        heading: "1. Chi siamo",
        paragraphs: [
          COMPANY +
            " è un servizio software-as-a-service gestito da Tirana, " +
            JURISDICTION_IT +
            ". In questi termini, “EasyHost”, “noi” e “nostro/i” si riferiscono a EasyHost. “Tu” si riferisce alla persona fisica o giuridica che crea un account.",
          "Puoi contattarci a " + CONTACT_EMAIL + " per qualsiasi domanda su questi termini.",
        ],
      },
      {
        heading: "2. Il servizio",
        paragraphs: [
          "EasyHost permette agli host di affitti brevi e agli operatori dell'ospitalità (“host”) di creare un menù digitale brandizzato, posizionare un QR code nella loro proprietà e accettare ordini dagli ospiti per articoli in camera e servizi aggiuntivi.",
          "EasyHost fornisce solo software. Non possediamo, gestiamo, vendiamo o forniamo gli articoli elencati nei menù degli host e non siamo parte di alcuna transazione tra host e ospite.",
        ],
      },
      {
        heading: "3. Account e requisiti",
        paragraphs: [
          "Devi avere almeno 18 anni ed essere in grado di stipulare un contratto vincolante per usare EasyHost. Sei responsabile della sicurezza delle tue credenziali e di tutto ciò che avviene sotto il tuo account.",
          "Quando ti registri, crei un'Organizzazione che può contenere una o più Proprietà. Puoi aggiungere membri del team in seguito. Sei responsabile di tutto ciò che fanno i membri del tuo team all'interno della tua Organizzazione.",
        ],
      },
      {
        heading: "4. Piani, prova e fatturazione",
        paragraphs: [
          "EasyHost è offerto con piani mensili in abbonamento. Piani e prezzi attuali sono su /pricing e possono cambiare con preavviso. Oggi i piani sono:",
        ],
        list: [
          "Starter — 15 € al mese, una proprietà.",
          "Pro — 29 € al mese, fino a cinque proprietà.",
        ],
      },
      {
        heading: "5. Prova gratuita",
        paragraphs: [
          "Ogni nuovo account ottiene 7 giorni di prova gratuita. Non è richiesto alcun metodo di pagamento per iniziare. Durante la prova puoi creare e testare i menù, generare QR code e collegare un account di pagamento. Al termine della prova, le funzioni operative (accettare ordini, aggiungere proprietà, generare nuovi QR code) sono bloccate finché non viene attivato un piano a pagamento. I tuoi dati vengono conservati.",
        ],
      },
      {
        heading: "6. Pagamenti e ruolo di Paddle",
        paragraphs: [
          "Le quote di abbonamento sono gestite da Paddle.com Inc. e dalle sue affiliate (“Paddle”), il nostro merchant of record. Quando ti abboni, Paddle addebita il metodo di pagamento scelto, gestisce l'IVA ed emette le fatture. Le condizioni di Paddle (paddle.com/legal) si applicano a quella transazione oltre alle nostre.",
          "Gli abbonamenti si rinnovano automaticamente ogni mese al prezzo in vigore, salvo cancellazione. Puoi annullare in qualsiasi momento da /settings/billing o dal portale clienti di Paddle. Dopo la cancellazione, il piano rimane attivo fino alla fine del periodo pagato.",
          "Pagamenti falliti: in caso di addebito non riuscito, riproveremo e ti avviseremo. Se l'abbonamento rimane non pagato, le funzioni operative vengono bloccate fino al ripristino del pagamento.",
        ],
      },
      {
        heading: "7. Pagamenti degli ospiti",
        paragraphs: [
          "Gli ospiti pagano direttamente l'host tramite una connessione di pagamento di proprietà dell'host. I metodi supportati includono Stripe Connect (carta, Apple Pay, Google Pay), bonifico tramite IBAN e contante registrato dall'host.",
          "EasyHost non è un istituto di pagamento. Non gestiamo fondi degli ospiti, non deteniamo denaro per conto di host o ospiti e non siamo responsabili di tasse, rimborsi, chargeback o controversie tra host e ospite. L'host è il venditore di registro per ogni transazione con l'ospite.",
        ],
      },
      {
        heading: "8. I tuoi contenuti",
        paragraphs: [
          "Resti proprietario di tutto ciò che carichi: loghi, foto, nomi degli articoli, descrizioni, prezzi, branding e qualsiasi altro materiale (“i tuoi contenuti”). Ci concedi una licenza mondiale, non esclusiva e gratuita per ospitare, conservare, riprodurre, tradurre e visualizzare i tuoi contenuti al solo scopo di erogare il servizio per te e i tuoi ospiti.",
          "Sei responsabile di avere il diritto di usare i contenuti caricati e che essi rispettino la legge applicabile, comprese le norme sulla vendita di alcolici e sulla sicurezza alimentare ove pertinenti.",
        ],
      },
      {
        heading: "9. Uso accettabile",
        paragraphs: ["Usando EasyHost ti impegni a non:"],
        list: [
          "Usare il servizio per vendere articoli o servizi illegali o vietati dalle leggi locali.",
          "Travisare il prezzo, il contenuto o la disponibilità degli articoli del tuo menù.",
          "Caricare contenuti che violino proprietà intellettuale, privacy o altri diritti altrui.",
          "Tentare di accedere senza autorizzazione ad altri account, ai nostri sistemi o alla nostra infrastruttura.",
          "Rivendere o concedere in sub-licenza EasyHost a terzi senza il nostro permesso scritto.",
          "Usare EasyHost per inviare spam, molestare o danneggiare ospiti o altri utenti.",
        ],
      },
      {
        heading: "10. Disponibilità e modifiche",
        paragraphs: [
          "Puntiamo a un'alta disponibilità, ma il servizio è fornito “così com'è” e “come disponibile”. Possiamo modificare, sospendere o interrompere funzionalità con preavviso ragionevole. Per modifiche sostanziali che impattano negativamente i clienti paganti, daremo preavviso di almeno 30 giorni.",
          "La manutenzione programmata viene annunciata in anticipo quando possibile. La manutenzione di emergenza può avvenire senza preavviso.",
        ],
      },
      {
        heading: "11. Cessazione",
        paragraphs: [
          "Puoi annullare l'abbonamento in qualsiasi momento. Possiamo sospendere o chiudere il tuo account se violi sostanzialmente questi termini, non paghi o usi il servizio in modo da mettere a rischio altri utenti o la nostra infrastruttura. Daremo preavviso e una possibilità di porre rimedio quando ragionevole.",
          "Alla cessazione, le funzioni operative vengono disattivate. Puoi richiedere l'esportazione dei tuoi dati entro 30 giorni; dopo, possiamo eliminarli, fatte salve eventuali obbligazioni legali di conservazione.",
        ],
      },
      {
        heading: "12. Limitazione di responsabilità",
        paragraphs: [
          "Nei limiti massimi consentiti dalla legge, EasyHost è fornito senza garanzie di alcun tipo, espresse o implicite. Non garantiamo che il servizio sarà ininterrotto, privo di errori o adatto a ogni esigenza.",
          "La nostra responsabilità totale verso di te per tutti i reclami legati al servizio è limitata agli importi che ci hai pagato nei 12 mesi precedenti l'evento che dà origine al reclamo. Non siamo responsabili di danni indiretti, incidentali, consequenziali o punitivi, né di mancato profitto, ricavo, dati o avviamento.",
          "Nulla in questi termini esclude la responsabilità che non può essere esclusa per legge (ad esempio, frode o colpa grave, o i diritti che hai come consumatore nel tuo paese).",
        ],
      },
      {
        heading: "13. Manleva",
        paragraphs: [
          "Accetti di manlevare EasyHost da reclami derivanti dai tuoi contenuti, dalla vendita di articoli agli ospiti o dalla tua violazione di questi termini — salvo nella misura in cui siano causati dalla nostra negligenza o dolo.",
        ],
      },
      {
        heading: "14. Legge applicabile e controversie",
        paragraphs: [
          "Questi termini sono regolati dalla legge della " +
            JURISDICTION_IT +
            ", senza riguardo ai principi sui conflitti di legge. Le controversie saranno portate davanti ai tribunali competenti di Tirana, " +
            JURISDICTION_IT +
            ". Se sei un consumatore residente nell'UE, mantieni le tutele inderogabili del diritto del consumo del tuo paese.",
        ],
      },
      {
        heading: "15. Modifiche ai termini",
        paragraphs: [
          "Possiamo aggiornare questi termini. La data in cima alla pagina riflette l'ultima modifica. Per modifiche sostanziali avviseremo i clienti paganti via email con almeno 30 giorni di anticipo. L'uso continuato dopo l'entrata in vigore implica accettazione.",
        ],
      },
    ],
    contactHeading: "Contatti",
    contactBody:
      "Domande su questi termini? Scrivici a " +
      CONTACT_EMAIL +
      ". Rispondiamo a ogni messaggio.",
  },
  de: {
    badge: "Rechtliches",
    title: "Nutzungsbedingungen",
    intro:
      "Diese Bedingungen regeln deinen Zugang zu und deine Nutzung von EasyHost. Mit der Erstellung eines Kontos oder der Nutzung des Dienstes stimmst du ihnen zu. Bitte lies sie sorgfältig — sie erklären, wie das Produkt bereitgestellt wird, wie die Abrechnung funktioniert und wofür jede Seite verantwortlich ist.",
    lastUpdatedLabel: "Zuletzt aktualisiert",
    sections: [
      {
        heading: "1. Wer wir sind",
        paragraphs: [
          COMPANY +
            " ist ein Software-as-a-Service-Dienst, betrieben aus Tirana, " +
            JURISDICTION_DE +
            ". In diesen Bedingungen beziehen sich 'EasyHost', 'wir', 'uns' und 'unser' auf EasyHost. 'Du' bezeichnet die natürliche oder juristische Person, die ein Konto erstellt.",
          "Bei Fragen zu diesen Bedingungen erreichst du uns unter " + CONTACT_EMAIL + ".",
        ],
      },
      {
        heading: "2. Der Dienst",
        paragraphs: [
          "EasyHost ermöglicht es Gastgeber:innen von Kurzzeitunterkünften und Beherbergungsbetrieben ('Hosts'), eine markenkonforme digitale Speisekarte zu erstellen, einen QR-Code in ihrer Unterkunft zu platzieren und Bestellungen von Gästen für Artikel und Zusatzleistungen entgegenzunehmen.",
          "EasyHost stellt ausschließlich Software bereit. Wir besitzen, betreiben, verkaufen oder liefern keine Artikel, die in Host-Speisekarten geführt werden, und sind nicht Partei einer Transaktion zwischen Host und Gast.",
        ],
      },
      {
        heading: "3. Konto und Voraussetzungen",
        paragraphs: [
          "Du musst mindestens 18 Jahre alt und geschäftsfähig sein, um EasyHost zu nutzen. Du bist für die Sicherheit deiner Zugangsdaten und für alles verantwortlich, was unter deinem Konto geschieht.",
          "Bei der Registrierung erstellst du eine Organisation, die eine oder mehrere Properties enthalten kann. Du kannst später Teammitglieder hinzufügen. Du haftest für alles, was deine Teammitglieder unter deiner Organisation tun.",
        ],
      },
      {
        heading: "4. Tarife, Probezeit und Abrechnung",
        paragraphs: [
          "EasyHost wird im monatlichen Abonnement angeboten. Aktuelle Tarife und Preise findest du auf /pricing; sie können mit Vorankündigung geändert werden. Aktuell:",
        ],
        list: [
          "Starter — 15 € pro Monat, eine Property.",
          "Pro — 29 € pro Monat, bis zu fünf Properties.",
        ],
      },
      {
        heading: "5. Kostenlose Probezeit",
        paragraphs: [
          "Jedes neue Konto erhält 7 Tage kostenlose Probezeit. Für den Start ist keine Zahlungsmethode erforderlich. Während der Probezeit kannst du Speisekarten erstellen und testen, QR-Codes generieren und ein Zahlungskonto verbinden. Nach Ablauf werden aktive Funktionen (Bestellungen annehmen, Properties hinzufügen, neue QR-Codes generieren) gesperrt, bis ein kostenpflichtiger Tarif aktiviert ist. Deine Daten bleiben erhalten.",
        ],
      },
      {
        heading: "6. Zahlungen und die Rolle von Paddle",
        paragraphs: [
          "Abonnementgebühren werden von Paddle.com Inc. und ihren verbundenen Unternehmen ('Paddle') als unser Merchant of Record verarbeitet. Beim Abschluss eines Abonnements belastet Paddle deine gewählte Zahlungsmethode, übernimmt die USt. und stellt Rechnungen aus. Die Bedingungen von Paddle (paddle.com/legal) gelten zusätzlich zu unseren für diese Transaktion.",
          "Abonnements verlängern sich automatisch jeden Monat zum dann geltenden Preis, sofern sie nicht gekündigt werden. Du kannst jederzeit über /settings/billing oder das Paddle-Kundenportal kündigen. Nach der Kündigung bleibt der Tarif bis zum Ende der bezahlten Periode aktiv.",
          "Fehlgeschlagene Zahlungen: Schlägt eine Belastung fehl, versuchen wir sie erneut und informieren dich. Bleibt das Abonnement unbezahlt, werden aktive Funktionen gesperrt, bis die Zahlung wiederhergestellt ist.",
        ],
      },
      {
        heading: "7. Zahlungen der Gäste",
        paragraphs: [
          "Gäste zahlen direkt an den Host über eine Zahlungsverbindung, die dem Host gehört. Unterstützte Methoden sind Stripe Connect (Karte, Apple Pay, Google Pay), Banküberweisung per IBAN und Barzahlung, die der Host erfasst.",
          "EasyHost ist kein Zahlungsinstitut. Wir berühren keine Gästegelder, halten kein Geld für Hosts oder Gäste und sind nicht verantwortlich für Steuern, Erstattungen, Chargebacks oder Streitigkeiten zwischen Host und Gast. Der Host ist der 'seller of record' jeder Gasttransaktion.",
        ],
      },
      {
        heading: "8. Deine Inhalte",
        paragraphs: [
          "Du behältst das Eigentum an allem, was du hochlädst: Logos, Fotos, Artikelbezeichnungen, Beschreibungen, Preise, Branding und sonstige Materialien ('deine Inhalte'). Du gewährst uns eine weltweite, nicht-exklusive, gebührenfreie Lizenz, deine Inhalte ausschließlich für den Betrieb des Dienstes für dich und deine Gäste zu hosten, zu speichern, zu vervielfältigen, zu übersetzen und anzuzeigen.",
          "Du bist dafür verantwortlich, dass du das Recht hast, die hochgeladenen Inhalte zu verwenden, und dass sie geltendes Recht einhalten, einschließlich Vorschriften zum Alkoholverkauf und zur Lebensmittelsicherheit, soweit zutreffend.",
        ],
      },
      {
        heading: "9. Zulässige Nutzung",
        paragraphs: ["Bei der Nutzung von EasyHost wirst du nicht:"],
        list: [
          "Den Dienst nutzen, um illegale oder nach örtlichem Recht verbotene Artikel oder Dienste zu verkaufen.",
          "Preis, Inhalt oder Verfügbarkeit von Artikeln deiner Speisekarte falsch darstellen.",
          "Inhalte hochladen, die geistige Eigentumsrechte, Privatsphäre oder andere Rechte Dritter verletzen.",
          "Unerlaubt versuchen, auf andere Konten, unsere Systeme oder unsere Infrastruktur zuzugreifen.",
          "EasyHost ohne unsere schriftliche Erlaubnis weiterverkaufen oder unterlizenzieren.",
          "EasyHost nutzen, um Spam zu versenden, Gäste oder andere Nutzer zu belästigen oder zu schädigen.",
        ],
      },
      {
        heading: "10. Verfügbarkeit und Änderungen",
        paragraphs: [
          "Wir streben hohe Verfügbarkeit an, der Dienst wird aber 'wie besehen' und 'nach Verfügbarkeit' bereitgestellt. Wir können Funktionen mit angemessener Vorankündigung ändern, aussetzen oder einstellen. Bei wesentlichen Änderungen, die zahlende Kunden nachteilig betreffen, kündigen wir mindestens 30 Tage im Voraus an.",
          "Geplante Wartungen werden nach Möglichkeit vorher angekündigt. Notwartungen können ohne Vorankündigung erfolgen.",
        ],
      },
      {
        heading: "11. Beendigung",
        paragraphs: [
          "Du kannst dein Abonnement jederzeit kündigen. Wir können dein Konto sperren oder schließen, wenn du diese Bedingungen wesentlich verletzt, nicht zahlst oder den Dienst so nutzt, dass andere Nutzer oder unsere Infrastruktur gefährdet sind. Wir werden angemessen vorab informieren und Gelegenheit zur Abhilfe geben.",
          "Nach Beendigung werden aktive Funktionen deaktiviert. Du kannst innerhalb von 30 Tagen einen Datenexport anfordern; danach können wir die Daten löschen, vorbehaltlich gesetzlicher Aufbewahrungspflichten.",
        ],
      },
      {
        heading: "12. Haftungsbeschränkung",
        paragraphs: [
          "Im gesetzlich höchstzulässigen Umfang wird EasyHost ohne ausdrückliche oder stillschweigende Gewährleistung bereitgestellt. Wir garantieren nicht, dass der Dienst unterbrechungsfrei, fehlerfrei oder für jeden Anwendungsfall geeignet ist.",
          "Unsere Gesamthaftung gegenüber dir für alle Ansprüche aus oder im Zusammenhang mit dem Dienst ist auf die Beträge begrenzt, die du uns in den 12 Monaten vor dem anspruchsbegründenden Ereignis gezahlt hast. Wir haften nicht für mittelbare, beiläufige, Folge- oder Strafschäden oder für entgangenen Gewinn, Umsatz, Daten oder Reputation.",
          "Nichts in diesen Bedingungen schließt eine Haftung aus, die gesetzlich nicht ausgeschlossen werden kann (z. B. bei Vorsatz oder grober Fahrlässigkeit oder Verbraucherrechte deines Landes).",
        ],
      },
      {
        heading: "13. Freistellung",
        paragraphs: [
          "Du stellst EasyHost von Ansprüchen frei, die sich aus deinen Inhalten, deinem Verkauf von Artikeln an Gäste oder deinem Verstoß gegen diese Bedingungen ergeben — außer soweit sie auf unserer Fahrlässigkeit oder vorsätzlichem Fehlverhalten beruhen.",
        ],
      },
      {
        heading: "14. Anwendbares Recht und Streitigkeiten",
        paragraphs: [
          "Diese Bedingungen unterliegen dem Recht von " +
            JURISDICTION_DE +
            " unter Ausschluss der Grundsätze des internationalen Privatrechts. Streitigkeiten werden vor den zuständigen Gerichten in Tirana, " +
            JURISDICTION_DE +
            ", geführt. Bist du Verbraucher mit Wohnsitz in der EU, bleiben die zwingenden Verbraucherrechte deines Landes erhalten.",
        ],
      },
      {
        heading: "15. Änderungen dieser Bedingungen",
        paragraphs: [
          "Wir können diese Bedingungen aktualisieren. Das Datum oben auf der Seite gibt die letzte Änderung an. Bei wesentlichen Änderungen informieren wir zahlende Kunden mindestens 30 Tage vorher per E-Mail. Mit weiterer Nutzung nach Inkrafttreten stimmst du den Änderungen zu.",
        ],
      },
    ],
    contactHeading: "Kontakt",
    contactBody:
      "Fragen zu diesen Bedingungen? Schreib uns an " +
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

export default async function TermsPage() {
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
