# EasyHost — Project Brief for Claude Code

> Save this file as `CLAUDE.md` in your project root. Claude Code automatically reads it as project context for every session.

---

## 1. What We Are Building

**EasyHost** is a multi-tenant SaaS platform that lets short-term rental hosts (Airbnb, boutique hotels, vacation rentals) offer a premium in-room minibar and add-on services experience to their guests through a beautifully designed digital menu.

Each host signs up, creates branded menus for their properties, connects their own payment account, generates a unique QR code, and places it in their rental. Guests scan, browse, select what they consumed, and pay by card, bank transfer, or cash. Money flows directly from guest to host — we never touch it. We charge the host a flat monthly subscription per property.

### Core User Stories

**Host:**
- I sign up and onboard one or more properties in minutes
- I build a custom menu (snacks, drinks, alcohol, services) with photos and prices
- I connect my Paysera account so guest card payments land directly in my bank
- I download a QR code, print it, place it in my rental
- I see real-time orders, revenue, and inventory alerts
- I get notified when an item is running low

**Guest:**
- I scan a QR code in my rental
- I land on a beautifully branded menu (matches the property's vibe)
- I browse by category, add items to my cart
- I pay by card (Paysera), bank transfer (SEPA), or mark as cash
- I get an email receipt
- I never have to download an app or create an account

**Platform Owner (you):**
- I see all hosts, their subscription status, revenue
- I can suspend, refund, or comp accounts
- I see platform analytics

---

## 2. Business Model

- **Pricing:** €15/month per property. Simple, predictable.
- **Billing:** Paddle (merchant of record — handles VAT, works in Albania, sends webhooks for subscription state).
- **Free trial:** 14 days, no credit card required.
- **Payment flow:** Hosts connect their own Paysera/PayPal/IBAN. Guest payments go directly to hosts. EasyHost never touches guest payments — only charges hosts a separate subscription via Paddle. This avoids financial licensing complexity.

---

## 3. Tech Stack (Strict — do not substitute without asking)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | One codebase for marketing, dashboard, guest menu |
| Language | **TypeScript** | Type safety across the stack |
| Database | **PostgreSQL via Supabase** | Hosted Postgres + storage in one |
| ORM | **Prisma** | Type-safe queries, great with Next.js |
| Auth | **Clerk** | Multi-tenant org support out of the box |
| Subscription Billing | **Paddle** | Merchant of record, works in Albania, full webhooks |
| Guest Payments | **Paysera API** | Licensed in Albania, hosts connect via OAuth |
| Email | **Resend** | Clean API, great DX |
| Image Storage | **Cloudinary** | Menu photos, logos, host branding |
| QR Generation | **`qrcode` npm package** | Server-side, downloadable as PNG/SVG |
| i18n | **next-intl** | Best App Router i18n library |
| UI Components | **shadcn/ui + Tailwind CSS** | Customizable, owned, no lock-in |
| Charts | **Recharts** | For analytics dashboard |
| Forms | **react-hook-form + zod** | Validation everywhere |
| Deployment | **Vercel** | Native Next.js host |

---

## 4. Languages (i18n)

Initial launch must support:
- 🇬🇧 English (default)
- 🇦🇱 Albanian (Shqip)
- 🇮🇹 Italian
- 🇩🇪 German

Architecture must allow easy addition of more languages later (French, Spanish, Greek, Turkish). All user-facing strings live in `/messages/{locale}.json`. No hardcoded copy in components.

The **guest menu** must auto-detect browser language and let the guest switch via a flag dropdown in the top right. The **host dashboard** uses the language the host set in their profile.

---

## 5. Design System

### Visual Direction

EasyHost looks and feels like a refined cousin of Airbnb — warm, hospitable, premium, modern. Inspired by:
- **Airbnb** for color, spacing, photography, and overall warmth
- **KAZA Swap** (reference image 1) for typography hierarchy, rounded card composition, and friendly hero layouts
- **3D playful icons** (reference image 2) for menu item categories and feature illustrations
- **Line icons with orange accents** (reference image 3) for property types and onboarding

The product must feel **handcrafted by a designer**, never "generic SaaS template" or "AI-generated on a Wednesday."

### Color Palette

```css
/* Primary — warm orange (hospitable, Airbnb-adjacent) */
--primary: #FF5A1F;          /* Main accent, CTAs */
--primary-hover: #E54A12;
--primary-soft: #FFE8DE;     /* Backgrounds, hover states */

/* Neutrals */
--background: #FFFFFF;
--surface: #FAFAF7;          /* Cards, secondary surfaces (warm off-white) */
--border: #EBEBEB;
--foreground: #222222;       /* Main text, near-black */
--muted: #717171;            /* Secondary text */
--muted-light: #B0B0B0;

/* Semantic */
--success: #008A05;
--warning: #F5A623;
--error: #C13515;

/* Dark mode (host dashboard optional) */
--background-dark: #1A1A1A;
--surface-dark: #262626;
```

### Typography

- **Font family:** Inter (free, modern, near-identical to Airbnb's Cereal)
- **Display headings:** 700 weight, tight tracking (-0.02em)
- **Body:** 400 weight, 1.5 line-height
- **Scale:**
  - Hero: 56-72px (responsive)
  - H1: 40px
  - H2: 32px
  - H3: 24px
  - Body: 16px
  - Small: 14px
  - Caption: 12px

### Spacing & Layout

- Base unit: 4px (Tailwind default)
- Card border-radius: **12-16px** (warm, friendly)
- Button border-radius: **8-12px**
- Image border-radius: **16-24px** (Airbnb-like)
- Soft shadows: `0 2px 8px rgba(0,0,0,0.04)` for cards, never harsh
- Generous whitespace — let things breathe

### Component Patterns

- **Cards:** White surface, soft shadow, 16px radius, lots of internal padding
- **Buttons:** Primary = solid orange, Secondary = white with black border, Ghost = no border
- **Icons:** Use Lucide React for UI, the 3D-style icons (reference image 2) for menu category headers, line icons (reference image 3) for property type selectors
- **Inputs:** Light gray border, rounded 8px, focus state with orange ring
- **Navigation:** Clean horizontal nav, no dropdowns until necessary

### Photography & Imagery

- Real, warm, lifestyle photography (no stock-looking shots)
- Menu item photos: square, well-lit, consistent style
- Hero imagery: cozy interiors, hosts smiling, guests enjoying
- Plenty of breathing room around images

---

## 6. Multi-Tenant Architecture

### Tenancy Model

- An **Organization** is a customer (one host, one company, one chain). One Clerk account = one Organization.
- An Organization can have **multiple Properties** (Airbnbs, hotels, suites).
- Each Property has its own **menu**, **branding**, **payment connection**, and **QR code**.
- Each Property has its own slug used in the guest URL: `app.easyhost.com/m/{property-slug}`.
- **Subscription is billed per Property** — €15/month each.

### URL Structure

```
easyhost.com                          → Marketing site
easyhost.com/pricing
easyhost.com/how-it-works
easyhost.com/waitlist

app.easyhost.com                      → Host dashboard (auth required)
app.easyhost.com/sign-in
app.easyhost.com/sign-up
app.easyhost.com/onboarding
app.easyhost.com/dashboard
app.easyhost.com/properties
app.easyhost.com/properties/[id]
app.easyhost.com/properties/[id]/menu
app.easyhost.com/properties/[id]/qr
app.easyhost.com/properties/[id]/analytics
app.easyhost.com/properties/[id]/inventory
app.easyhost.com/settings
app.easyhost.com/settings/branding
app.easyhost.com/settings/payments
app.easyhost.com/settings/billing

app.easyhost.com/m/[property-slug]    → GUEST MENU (no auth)
app.easyhost.com/m/[slug]/cart
app.easyhost.com/m/[slug]/checkout
app.easyhost.com/m/[slug]/pay/paysera
app.easyhost.com/m/[slug]/pay/cash
app.easyhost.com/m/[slug]/success

admin.easyhost.com                    → Platform admin (your eyes only)
```

---

## 7. Database Schema (Prisma)

```prisma
model Organization {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  logoUrl           String?
  primaryColor      String   @default("#FF5A1F")
  defaultLanguage   String   @default("en")
  paddleCustomerId  String?  @unique
  subscriptionStatus String  @default("trialing") // trialing, active, past_due, cancelled
  trialEndsAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  users      User[]
  properties Property[]
}

model User {
  id           String   @id @default(cuid())
  clerkUserId  String   @unique
  email        String
  name         String?
  role         String   @default("owner") // owner, staff
  language     String   @default("en")
  orgId        String
  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
}

model Property {
  id                String   @id @default(cuid())
  orgId             String
  organization      Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  name              String
  slug              String   @unique
  type              String   // apartment, villa, cottage, suite, etc.
  address           String?
  timezone          String   @default("Europe/Tirane")
  currency          String   @default("EUR")

  // Branding (overrides org defaults)
  logoUrl           String?
  accentColor       String?
  heroImageUrl      String?
  welcomeMessage    Json?    // multilingual { en: "...", al: "...", it: "...", de: "..." }

  // Payment connections (host's own accounts)
  payseraAccountId  String?
  paypalEmail       String?
  iban              String?
  acceptCash        Boolean  @default(true)

  // Subscription (per-property billing)
  paddleSubscriptionId String? @unique
  subscriptionStatus   String  @default("trialing")

  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  menus     Menu[]
  orders    Order[]
}

model Menu {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  name       Json     // multilingual
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())

  items MenuItem[]
}

model MenuItem {
  id                  String   @id @default(cuid())
  menuId              String
  menu                Menu     @relation(fields: [menuId], references: [id], onDelete: Cascade)
  name                Json     // multilingual { en: "Coca Cola", al: "Koka Kola", ... }
  description         Json?    // multilingual
  category            String   // beverages, snacks, alcohol, services
  imageUrl            String?
  price               Decimal  @db.Decimal(10, 2)
  currency            String   @default("EUR")
  isAvailable         Boolean  @default(true)
  stockQuantity       Int?
  lowStockThreshold   Int?
  displayOrder        Int      @default(0)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  orderItems OrderItem[]
}

model Order {
  id                  String   @id @default(cuid())
  propertyId          String
  property            Property @relation(fields: [propertyId], references: [id])
  guestSessionId      String   // anonymous session token
  guestEmail          String?
  guestName           String?
  status              String   @default("pending") // pending, paid, cash_pending, cancelled
  paymentMethod       String?  // paysera, paypal, bank_transfer, cash
  totalAmount         Decimal  @db.Decimal(10, 2)
  currency            String
  payseraTransactionId String?
  paidAt              DateTime?
  language            String   @default("en")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  items OrderItem[]
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItemId  String
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id])
  itemNameSnapshot Json   // snapshot at time of order
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
}

model InventoryAlert {
  id         String   @id @default(cuid())
  propertyId String
  menuItemId String
  alertType  String   // low_stock, out_of_stock
  sentAt     DateTime @default(now())
  resolvedAt DateTime?
}

model WaitlistEntry {
  id        String   @id @default(cuid())
  email     String   @unique
  language  String?
  source    String?
  createdAt DateTime @default(now())
}
```

---

## 8. Build Phases

Work in this strict order. Do not skip ahead.

### Phase 0 — Project Setup
1. Initialize Next.js 14 with App Router, TypeScript, Tailwind, ESLint
2. Set up Supabase project, get connection string
3. Install Prisma, push initial schema
4. Set up Clerk for auth
5. Set up next-intl for i18n with 4 languages (English, Albanian, Italian, German)
6. Configure shadcn/ui with the custom color palette
7. Set up environment variables file (.env.example) — never commit .env

### Phase 1 — Landing Page + Waitlist (BUILD FIRST)
The marketing site goes live before the app. Capture emails from day one.

Pages:
1. `/` — Homepage with all sections (see Section 9 below)
2. `/pricing` — Detailed pricing page
3. `/how-it-works` — Three-step explainer
4. Waitlist email capture saves to `WaitlistEntry` table

Deploy to Vercel ASAP. Share the link, start marketing.

### Phase 2 — Personal Single-Property MVP
Hardcoded single property (yours). This proves the guest experience works end-to-end before going multi-tenant.

1. Guest menu at `/m/[slug]` — browse, cart, checkout
2. Paysera payment integration (test mode first, then live)
3. Cash payment flow
4. Email receipt to guest via Resend
5. Simple host view to see orders for the one property

### Phase 3 — Multi-Tenant SaaS
1. Clerk auth + Organization signup
2. Onboarding wizard (create first property, set branding, connect payment)
3. Properties dashboard
4. Menu builder (CRUD menu items with photos)
5. QR code generation per property
6. Branding settings (logo, accent color)
7. Paddle subscription integration + webhooks
8. 14-day free trial logic

### Phase 4 — Growth Features
1. Analytics dashboard (Recharts)
2. Inventory management + low-stock alerts
3. Multilingual menu builder (host can write item names in 4 langs)
4. SMS notifications (Twilio, optional)
5. Multi-property management UI
6. Staff users (org members beyond owner)

### Phase 5 — Polish & Scale
1. Admin panel at admin.easyhost.com
2. Referral program (hosts invite hosts)
3. Blog/SEO content
4. Mobile-optimized host dashboard
5. PDF receipt downloads
6. Export orders to CSV

---

## 9. Landing Page Structure

The landing page is the highest priority. It must convert visitors into waitlist signups.

### Sections (in order)

1. **Sticky Nav** — Logo "EasyHost" left | How it works, Pricing, Languages center | "Join waitlist" CTA right
2. **Hero**
   - Headline: "Turn your Airbnb into a five-star experience."
   - Subheadline: "EasyHost lets your guests order snacks, drinks, and extras from a beautiful in-room menu. You set the prices, you keep the profit."
   - "Coming soon" badge
   - Email capture: "Join the waitlist" → saves to DB
   - Phone mockup showing the guest menu
3. **The Problem** — "Snacks disappear. Cash gets awkward. You're leaving money on the table."
4. **How it works** — 3 horizontal steps with icons:
   - Stock your rental
   - Place the QR code
   - Get paid automatically
5. **Features grid** — 6 cards with the 3D icons:
   - 📱 Beautiful branded menu
   - 💳 Card payments to your account
   - 🏠 Multi-property management
   - 📊 Real-time analytics
   - 🌍 Multilingual for global guests
   - 🔔 Inventory alerts
6. **Guest experience preview** — Animated/static showcase of the menu in action
7. **Built for every type of stay** — Grid using the property type line icons (Apartment, Villa, Cottage, Suite, Beachfront, Hostel, Pool, Ecotourism)
8. **Pricing** — One card: €15/month per property, 14-day free trial, no card required. "Early bird: first 100 hosts get 50% off for life."
9. **Final CTA** — Big waitlist signup
10. **Footer** — Logo, links, language switcher, social, legal

---

## 10. Working Principles for Claude Code

### Always do this:
- ✅ Run `npm run build` and `npm run lint` after meaningful changes
- ✅ Use Server Components by default; Client Components only when needed (interactivity, hooks)
- ✅ All user-facing strings go through next-intl, never hardcoded
- ✅ Use Prisma's typed queries — never write raw SQL unless absolutely needed
- ✅ Validate all form inputs with zod
- ✅ Handle loading and error states for every async operation
- ✅ Mobile-first responsive design — design for 375px width first, scale up
- ✅ Accessibility: semantic HTML, alt text, focus states, keyboard nav

### Never do this:
- ❌ Don't hardcode strings — they all need translations
- ❌ Don't expose secrets in client code or commit `.env`
- ❌ Don't use `any` in TypeScript — use `unknown` and narrow
- ❌ Don't ship without error handling
- ❌ Don't add new dependencies without explaining why
- ❌ Don't skip the design system — use the color tokens, typography scale, spacing

### Code organization

```
/app
  /(marketing)              → Landing page (no auth)
    /page.tsx
    /pricing/page.tsx
    /how-it-works/page.tsx
  /(dashboard)              → Host dashboard (auth required)
    /dashboard
    /properties
    /settings
  /m/[slug]                 → Guest menu (no auth)
  /api
    /webhooks/paddle
    /webhooks/paysera
    /trpc                   (optional)
/components
  /ui                       → shadcn primitives
  /marketing                → Landing page components
  /dashboard                → Host dashboard components
  /guest                    → Guest menu components
/lib
  /db.ts                    → Prisma client
  /auth.ts                  → Clerk helpers
  /paysera.ts               → Paysera API wrapper
  /paddle.ts                → Paddle API wrapper
  /resend.ts                → Email sending
/messages
  /en.json
  /al.json
  /it.json
  /de.json
/prisma
  /schema.prisma
/public
  /images
```

### When in doubt
Ask me. Don't guess on:
- Pricing changes
- Payment flow changes
- Database schema changes that require migration
- New external services or dependencies
- Anything that touches money

---

## 11. Environment Variables (.env.example)

```bash
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Paddle
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Paysera
PAYSERA_PROJECT_ID=
PAYSERA_SIGN_PASSWORD=
PAYSERA_CLIENT_ID=
PAYSERA_CLIENT_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@easyhost.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MARKETING_URL=http://localhost:3000
```

---

## 12. First Task

When I start a new session, your first job is:

1. Confirm you've read this entire CLAUDE.md
2. Run `git status` and `ls` to understand the current state of the project
3. Ask me what we're working on today
4. Suggest the smallest next step that gets us closer to shipping

If the project is empty, start with **Phase 0 — Project Setup**, one step at a time, confirming with me before installing dependencies or making big architectural decisions.

---

## 13. Tone & Communication

- Be direct. Skip "Certainly!" and "I'd be happy to."
- Show the plan before writing big chunks of code.
- After making changes, summarize what changed and why in 2-3 lines.
- Flag risks and tradeoffs honestly.
- If I'm about to do something dumb, tell me.

---

**Built with care in Tirana, Albania. 🇦🇱**
