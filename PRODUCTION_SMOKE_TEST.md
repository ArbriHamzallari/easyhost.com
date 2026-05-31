# Production smoke test checklist

Run these manually after deploying `release/production-launch` to production.

## Marketing & waitlist

- [ ] Marketing homepage loads in **English** (`/`)
- [ ] Marketing homepage loads in **Albanian** (`/al`)
- [ ] Marketing homepage loads in **Italian** (`/it`)
- [ ] Marketing homepage loads in **German** (`/de`)
- [ ] Waitlist signup submits successfully
- [ ] Waitlist welcome email arrives at the guest address
- [ ] Admin notify email arrives at `RESEND_NOTIFY_EMAIL`

## Host onboarding

- [ ] Sign up as a new host → lands on `/onboarding`
- [ ] Complete all 6 onboarding steps → lands on `/dashboard`
- [ ] Create a menu item → Google Translate fills the other 3 languages (en, al, it, de)

## Payments & guest flow

- [ ] Connect **Stripe Connect** (use Stripe test/sandbox account on first run)
- [ ] Generate QR code → download PNG
- [ ] Open `/m/[slug]` in a browser → branded guest menu renders
- [ ] Add items to cart → checkout → pay with Stripe test card (`4242…`)
- [ ] Success page shows after payment
- [ ] Order appears on host dashboard in **real time** (Supabase Realtime)
- [ ] Guest receipt email arrives

## Billing & limits

- [ ] Open Paddle checkout from `/settings/billing` → upgrade to **Starter**
- [ ] Paddle webhook fires → `subscriptionStatus` becomes `active` in database
- [ ] As **Starter**, try to create a 2nd property → property limit banner + billing CTA
- [ ] Upgrade to **Pro** (optional) → can add up to 5 properties

## Trial lockout (if testing expired trial)

- [ ] After trial ends without subscription: dashboard still loads (read-only)
- [ ] Menu mutations, QR generation, and mark-paid are blocked with billing CTA

## Webhooks (staging / logs)

- [ ] Invalid Paddle webhook signature returns **401**
- [ ] Invalid Stripe webhook signature returns **401**
