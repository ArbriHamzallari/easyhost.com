# EasyHost — Project Brief for Claude Code

> This file is read automatically every session. Keep it current as the product evolves.

---

## 1. What We Are Building

**EasyHost** is a multi-tenant SaaS platform that lets short-term rental hosts (Airbnb hosts, boutique hotels, vacation rental managers) offer a premium in-room minibar and add-on services experience to their guests through a beautifully designed digital menu.

Each host signs up, answers a quick intent question, onboards their property step by step, builds a branded menu, connects their Stripe account, generates a unique QR code, and places it in their rental. Guests scan, browse, select what they consumed, and pay by Apple Pay, Google Pay, card, bank transfer, or cash. Money flows directly from guest to host — we never touch it. We charge the host a flat monthly subscription via Paddle.

**Live at:** easyhost.pro (Vercel, connected to real domain)

### Core User Stories

**Host:**
- I sign up, answer an intent question, and onboard my property step by step (Apple device style)
- I build a custom menu — I type item names once in my language, guests see them in theirs automatically
- I connect my Stripe account so guest card / Apple Pay / Google Pay payments land directly in my bank
- I generate a QR code and place it in my rental
- I see real-time orders, revenue, and inventory alerts in my dashboard
- I get notified when orders arrive or stock runs low (web now; native push when the app ships)

**Guest:**
- I scan a QR code in my rental
- I land on a beautifully branded menu in my language (auto-detected, switchable)
- I browse by category, add items to my cart
- I pay by Apple Pay, Google Pay, card (Stripe), bank transfer (IBAN), or cash
- I get an email receipt
- I never download an app or create an account

**Platform Owner (you):**
- I see all hosts, subscription status, and revenue
- I can suspend, refund, or comp accounts
- I see platform analytics

---

## 2. Business Model

| Plan | Price | Properties |
|---|---|---|
| Starter | €15/month | 1 property |
| Pro | €29/month | up to 5 properties |

- **Billing:** Paddle (merchant of record — handles VAT, works in Albania)
- **Trial:** 7 days free, no credit card required. Starts at account creation. After 7 days, features lock (dashboard readable, but orders cannot be accepted and new QR codes cannot be generated) until a plan is activated.
- **Early bird:** first 100 hosts get 50% off their plan for life (Paddle discount code)
- **Payment flow:** Hosts connect Stripe Connect (or enter IBAN). Guest payments go directly to hosts. EasyHost never touches guest money.

---

## 3. Tech Stack (do not substitute without asking)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | One codebase for marketing, dashboard, guest menu |
| Language | **TypeScript** | Type safety across the stack |
| Database | **PostgreSQL via Supabase** | Hosted Postgres + Realtime + storage |
| ORM | **Prisma** | Type-safe queries |
| Auth | **Clerk** | Multi-tenant org support |
| Subscription Billing | **Paddle** | Merchant of record, works in Albania |
| Guest Payments | **Stripe Connect** | Card, Apple Pay, Google Pay — direct payout to host |
| Bank Transfer | **IBAN (manual)** | Host enters IBAN; guests get bank details at checkout |
| Auto-Translation | **Google Translate** (`@google-cloud/translate`) | Host types item name once; auto-translated to all 4 languages |
| Email | **Resend** | Receipts, waitlist, notifications |
| Image Storage | **Cloudinary** | Menu photos, logos, host branding |
| QR Generation | **`qrcode` npm** | Server-side PNG/SVG download |
| Realtime | **Supabase Realtime** | Live order feed and stock alerts in host dashboard |
| i18n | **next-intl** | App Router i18n, 4 languages |
| UI Components | **shadcn/ui + Tailwind CSS** | Design system |
| Charts | **Recharts** | Analytics dashboard |
| Forms | **react-hook-form + zod** | Validation everywhere |
| Deployment | **Vercel** | easyhost.pro |
| Future (mobile) | **React Native / Expo** | App Store — native push notifications for hosts |

---

## 4. Languages (i18n)

Supported at launch: **English** (default), **Albanian** (sq), **Italian** (it), **German** (de)

- All UI strings live in `/messages/{locale}.json` — never hardcoded in components
- **Guest menu:** auto-detects browser language, switchable via flag dropdown (top right)
- **Host dashboard:** uses the language set in the host's profile
- **Menu item names/descriptions:** Host types in their chosen language → Google Translate auto-translates to the other 3 and stores all in the same JSON field. Host can manually override any translation.

Planned additions: French, Spanish, Greek, Turkish.

---

## 5. Design System

### Visual Direction
EasyHost looks and feels like a refined cousin of Airbnb — warm, hospitable, premium, modern. Never "generic SaaS template" or "AI-generated on a Wednesday."

### Color Palette

```css
--primary: #FF5A1F;
--primary-hover: #E54A12;
--primary-soft: #FFE8DE;
--background: #FFFFFF;
--surface: #FAFAF7;
--border: #EBEBEB;
--foreground: #222222;
--muted: #717171;
--muted-light: #B0B0B0;
--success: #008A05;
--warning: #F5A623;
--error: #C13515;
--background-dark: #1A1A1A;
--surface-dark: #262626;
```

### Typography
- **Font:** Inter
- **Display:** 700 weight, -0.02em tracking
- **Body:** 400 weight, 1.5 line-height
- Scale: Hero 56–72px / H1 40px / H2 32px / H3 24px / Body 16px / Small 14px / Caption 12px

### Spacing & Layout
- Card radius: 12–16px
- Button radius: 8–12px
- Image radius: 16–24px
- Shadow: `0 2px 8px rgba(0,0,0,0.04)`
- Generous whitespace — let things breathe

### Component Patterns
- **Cards:** White surface, soft shadow, 16px radius, generous internal padding
- **Buttons:** Primary = solid orange / Secondary = white + black border / Ghost = no border
- **Icons:** Lucide React for UI; 3D-style icons for menu category headers; line icons for property type selectors
- **Inputs:** Light gray border, 8px radius, orange focus ring

---

## 6. Multi-Tenant Architecture

- An **Organization** = one customer (custom Prisma model — one Clerk user maps to one app org on first login)
- An Organization has a **subscription tier** (starter / pro) that controls property limits
- Starter: max 1 property. Pro: max 5 properties.
- Each **Property** has its own menu, branding, payment config, and QR code
- Guest URL: `easyhost.pro/m/{property-slug}`

### URL Structure

```
easyhost.pro                             → Marketing + host dashboard + guest menu (LIVE)
easyhost.pro/pricing
easyhost.pro/how-it-works
easyhost.pro/privacy
easyhost.pro/sign-in
easyhost.pro/sign-up
easyhost.pro/onboarding                  → Step-by-step wizard (post sign-up)
easyhost.pro/dashboard                 → Home: orders, revenue, alerts
easyhost.pro/properties                → Property list
easyhost.pro/properties/[id]
easyhost.pro/properties/[id]/menu      → Menu builder
easyhost.pro/properties/[id]/qr        → QR code download
easyhost.pro/properties/[id]/analytics → Revenue charts + top items
easyhost.pro/properties/[id]/inventory → Stock management
easyhost.pro/settings
easyhost.pro/settings/billing          → Paddle subscription + plan management

easyhost.pro/m/[property-slug]         → Guest menu (no auth)
easyhost.pro/m/[slug]/checkout
easyhost.pro/m/[slug]/success

admin.easyhost.pro                       → Platform admin (your eyes only)
```

---

## 7. Database Schema (Prisma)

```prisma
model Organization {
  id                   String    @id @default(cuid())
  name                 String
  slug                 String    @unique
  logoUrl              String?
  primaryColor         String    @default("#FF5A1F")
  defaultLanguage      String    @default("en")
  intentType           String?   // airbnb_host, hotel_owner, vacation_rental_manager, other
  // Paddle billing — at org level, not per property
  paddleCustomerId     String?   @unique
  paddleSubscriptionId String?   @unique
  subscriptionStatus   String    @default("trialing") // trialing, active, past_due, cancelled
  subscriptionTier     String    @default("starter")  // starter, pro
  trialEndsAt          DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

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
  id        String  @id @default(cuid())
  orgId     String
  name      String
  slug      String  @unique
  type      String  // apartment, villa, cottage, suite, hotel, hostel, beachfront, other
  address   String?
  timezone  String  @default("Europe/Tirane")
  currency  String  @default("EUR")

  // Branding (skippable during onboarding, required before QR generation)
  logoUrl        String?
  accentColor    String?
  heroImageUrl   String?
  welcomeMessage Json?   // multilingual { en, sq, it, de }

  // Payment connections (host's own accounts — at least one required for QR generation)
  stripeAccountId          String?
  stripeOnboardingComplete Boolean @default(false)
  iban                     String?
  acceptCash               Boolean @default(true)

  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  menus        Menu[]
  orders       Order[]
}

model Menu {
  id         String   @id @default(cuid())
  propertyId String
  name       Json     // multilingual
  isActive   Boolean  @default(true)
  isDraft    Boolean  @default(true) // draft until: >= 1 item + payment method configured
  createdAt  DateTime @default(now())

  property Property   @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  items    MenuItem[]
}

model MenuItem {
  id                String   @id @default(cuid())
  menuId            String
  // name/description: host sets primary lang; Google Translate fills the rest; host can override
  name              Json     // { en, sq, it, de }
  description       Json?    // { en, sq, it, de }
  category          String   // beverages, snacks, alcohol, services (or custom)
  imageUrl          String?
  price             Decimal  @db.Decimal(10, 2)
  currency          String   @default("EUR")
  isAvailable       Boolean  @default(true)
  stockQuantity     Int      // required — tracked for low-stock alerts
  lowStockThreshold Int      @default(3)
  displayOrder      Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  menu       Menu        @relation(fields: [menuId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

model Order {
  id                    String    @id @default(cuid())
  propertyId            String
  guestSessionId        String
  guestEmail            String?
  guestName             String?
  status                String    @default("pending") // pending, paid, bank_transfer_pending, cash_pending, cancelled
  paymentMethod         String?   // stripe, bank_transfer, cash
  totalAmount           Decimal   @db.Decimal(10, 2)
  currency              String
  stripePaymentIntentId String?
  receiptSentAt         DateTime?
  paidAt                DateTime?
  language              String    @default("en")
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  property Property    @relation(fields: [propertyId], references: [id])
  items    OrderItem[]
}

model OrderItem {
  id               String  @id @default(cuid())
  orderId          String
  menuItemId       String
  itemNameSnapshot Json    // snapshot at time of order (all languages)
  quantity         Int
  unitPrice        Decimal @db.Decimal(10, 2)

  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem MenuItem @relation(fields: [menuItemId], references: [id])
}

model InventoryAlert {
  id         String    @id @default(cuid())
  propertyId String
  menuItemId String
  alertType  String    // low_stock, out_of_stock
  sentAt     DateTime  @default(now())
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

### DONE ✅
- **Phase 0:** Next.js 16, Supabase/Prisma, Clerk, next-intl (4 langs), shadcn/ui, Tailwind, env setup
- **Phase 1:** Full marketing site live at easyhost.pro — Hero, How it Works, Features, Pricing, Testimonials, FAQ, Footer. Waitlist saves to DB + sends welcome + admin notify emails. Admin waitlist view with CSV export.
- **Phase 2:** Host onboarding wizard (intent → property → address → branding → payment → complete) + dashboard home with trial banner, checklist, realtime orders
- **Phase 3:** Menu builder with CRUD, drag-and-drop, Google Translate, QR generation
- **Phase 4:** Guest menu, checkout (Stripe / IBAN / cash), receipts, stock decrement
- **Phase 5:** Paddle billing, trial lockout, property limits, webhooks
- **Phase 6:** Supabase Realtime order feed in dashboard
- **Phase 7 (partial):** Analytics page (Recharts revenue, top items, recent orders) + inventory management page

---

### Phase 1.5 — Marketing Polish (NEXT)

- [ ] Update all pricing copy to two-tier model (Starter €15 / Pro €29)
- [x] Fix hardcoded `app.easyhost.pro` references → `easyhost.pro` apex
- [x] SEO: sitemap + robots.txt (per-page metadata audit still open)
- [ ] Fix i18n routing (locale in URL path, not just cookie)

---

### Phase 2 — Host Onboarding (DONE ✅)

**2a. Post sign-up intent screen**
- Single question: "What best describes you?" with 4 options (Airbnb host / Hotel owner / Vacation rental manager / Other)
- Saves to `Organization.intentType`
- Drives personalization of tips and menu templates later

**2b. Property wizard (one step at a time — Apple device style)**
1. Property name
2. Property type — icon grid (Apartment, Villa, Cottage, Suite, Hotel, Hostel, Beachfront, Other)
3. Address (autocomplete) — timezone auto-detected from address
4. Currency (default EUR)
5. Branding — logo upload (Cloudinary), accent color picker, hero image. All skippable. Label: "Required to generate your QR code."
6. Payment method — Connect Stripe (OAuth) OR enter IBAN OR skip. Label: "Required to go live."
7. Summary screen — completion checklist with what's done and what's pending → "Go to dashboard"

**2c. Dashboard (home screen post-onboarding)**
- Empty state with big CTA: "Build your first menu"
- 7-day trial countdown banner
- Completion checklist: branding / payment method / first menu item / QR generated
- Real-time order feed (Supabase Realtime subscription)
- Revenue summary: today / this week / this month
- Low-stock alerts panel

---

### Phase 3 — Menu Builder (DONE ✅)

- CRUD for menu items per property
- Item fields: name (required, typed in host's language) / photo (optional, Cloudinary) / price (required) / stock count (required) / category / description (optional)
- On save: Google Translate auto-translates name + description to the other 3 languages, stores in JSON. Host can manually edit any translation.
- Categories: Beverages / Snacks / Alcohol / Services / Custom
- Drag-and-drop display order
- Menu templates per property type ("Airbnb Starter Pack", "Hotel Minibar", etc.)
- Tips panel alongside builder: contextual copy to guide hosts ("Add a photo — items with photos convert 30% better")
- Menu stays in draft until: ≥1 item + payment method configured
- QR code unlocked when menu is not draft (has items + payment method set)
- QR download: PNG and SVG, branded with property accent color

---

### Phase 4 — Guest Menu Experience (DONE ✅)

**`/m/[property-slug]`**
- Branded with property logo, accent color, hero image
- Auto-detect guest browser language → serve menu item names in that language
- Language switcher: flag dropdown, top right
- Browse by category, full-screen item detail view
- Cart (local state, no login required)
- Checkout: guest name + email (required for receipt)

**Payment flow:**
- Stripe connected → Stripe Elements (card + Apple Pay + Google Pay via Payment Request Button)
- IBAN only → show bank details + amount; guest selects "I'll pay by bank transfer"
- Cash → available if host has enabled it; guest selects "I'll pay in cash"

**Post-payment:**
- Order confirmation / success page
- Email receipt to guest via Resend
- Stock quantity decremented automatically
- Real-time notification pushed to host dashboard (Supabase Realtime)

---

### Phase 5 — Paddle Billing (DONE ✅)

- Two Paddle products: Starter (€15/month) and Pro (€29/month)
- 7-day trial starts automatically at account creation — no card required
- After trial expires: features lock. Host can view dashboard but cannot accept orders, generate QRs, or add properties until plan is active.
- Property limit enforced: Starter → max 1, Pro → max 5. Attempting to exceed shows upgrade prompt.
- Webhook handlers: `subscription.activated`, `subscription.updated`, `subscription.cancelled`, `subscription.payment_failed`
- Billing settings page: current plan, properties used vs. allowed, upgrade/downgrade, cancel
- Early-bird discount: first 100 hosts get 50% off for life (Paddle coupon code)

---

### Phase 6 — Notifications & Real-time (DONE ✅ — web; email alerts for low stock still open)

**Web (build now):**
- Supabase Realtime subscriptions in host dashboard
- Toast + notification panel for: new order received, low stock alert, item out of stock
- Email alerts for low stock / out of stock via Resend

**App (future — design for it now):**
- All dashboard data must come from clean API routes (not server-only logic) so a React Native / Expo app can consume the same endpoints
- Push notification infrastructure to be added when app is built
- Do not couple dashboard logic to the web rendering layer

---

### Phase 7 — Analytics & Inventory (PARTIAL — NEXT)

- [x] Revenue charts (Recharts): daily / weekly / monthly summary
- [x] Top-selling items + recent orders list
- [ ] Order history with filters (date, status, payment method)
- [x] Inventory management: stock levels per item, per-item update
- [x] Low-stock threshold settings per item
- [ ] Automated email when item hits threshold

---

### Phase 8 — Admin & Scale

- Admin panel at admin.easyhost.pro
- All hosts, subscription status, revenue overview
- Suspend / comp / refund accounts
- Waitlist management (already built at /admin/waitlist)
- Platform-wide analytics
- Referral program (hosts invite hosts → discount)
- CSV exports (orders, revenue)
- Blog / SEO content

---

## 9. Payment Architecture Detail

### Stripe Connect (primary)
- Hosts connect via Stripe Connect OAuth (Standard account — host owns the Stripe account)
- Guest payments: Stripe Payment Intent with `transfer_data.destination` = host's Stripe account ID
- EasyHost takes no cut from guest payments; subscription revenue via Paddle is separate
- Apple Pay + Google Pay: Stripe.js Payment Request Button — works automatically when Stripe is connected
- Apple Pay domain verification for easyhost.pro: Stripe handles this automatically

### IBAN / Bank Transfer (fallback)
- Host enters IBAN in property settings
- At checkout, guest sees: bank name, IBAN, amount, reference (order ID)
- Guest selects "I'll pay by bank transfer" → order status = `bank_transfer_pending`
- Host manually marks as received in dashboard → status → `paid`

### Cash
- Toggle per property (default: on)
- Guest selects cash at checkout → order status = `cash_pending`
- Host marks as received in dashboard

---

## 10. Working Principles

### Always:
- Server Components by default; Client Components only when interactivity or hooks are needed
- All user-facing strings through next-intl — never hardcoded
- Prisma typed queries — no raw SQL
- Validate all inputs with zod at system boundaries
- Handle loading and error states for every async operation
- Mobile-first: design at 375px, scale up
- Semantic HTML, alt text, focus states, keyboard navigation
- Run `npm run build` and `npm run lint` after meaningful changes

### Never:
- Hardcode strings
- Expose secrets in client code or commit `.env`
- Use `any` in TypeScript — use `unknown` and narrow
- Ship without error handling
- Add dependencies without explaining why
- Skip the design system (color tokens, typography scale, spacing)

### Code Organization

```
/app
  /(marketing)              → Landing page (DONE)
  /(dashboard)              → Host dashboard (auth required)
    /onboarding
    /dashboard
    /properties/[id]
    /settings
  /m/[slug]                 → Guest menu (no auth)
  /api
    /webhooks/paddle
    /webhooks/stripe
/components
  /ui                       → shadcn primitives
  /marketing                → Landing page (DONE)
  /dashboard                → Host dashboard components
  /guest                    → Guest menu components
/lib
  /prisma.ts
  /backend/lib/auth.ts      → Clerk helpers (requireUser, getOrgUser, checkAdmin)
  /stripe.ts                → Stripe Connect helpers
  /paddle.ts                → Paddle API wrapper
  /translate.ts             → Google Translate wrapper
  /resend.ts                → Email sending
  /realtime.ts              → Supabase Realtime helpers
/messages
  /en.json
  /sq.json
  /it.json
  /de.json
/prisma
  /schema.prisma
/public
  /images
```

### When in doubt, ask. Never guess on:
- Pricing or plan limit changes
- Payment flow changes
- Schema migrations
- New external services
- Anything that touches money

---

## 11. Environment Variables (.env.example)

```bash
# Database (Supabase)
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding
CLERK_WEBHOOK_SECRET=

# Paddle
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
PADDLE_STARTER_PRICE_ID=
PADDLE_PRO_PRICE_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_CONNECT_CLIENT_ID=

# Google Translate (menu item auto-translation)
GOOGLE_TRANSLATE_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@easyhost.pro

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# App (canonical apex domain)
NEXT_PUBLIC_APP_URL=https://easyhost.pro
NEXT_PUBLIC_MARKETING_URL=https://easyhost.pro
ADMIN_USER_IDS=
```

---

## 12. Session Start Protocol

1. Confirm CLAUDE.md has been read
2. Check current phase — what's done, what's next
3. Ask what we're working on today
4. Suggest the smallest next step toward shipping

---

**Built with care in Tirana, Albania.**
