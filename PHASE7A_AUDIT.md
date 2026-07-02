# DEPART V2 — Phase 7A Audit

Snapshot after Sessions A + B (Foundation + Catalog/Inventory).
Complements `PHASE7_AUDIT.md`; focuses on what is still broken, mock, or
duplicated. No new features here — this drives stabilization work only.

## 1. Authentication (RESOLVED in this pass)

- ❌ Removed `admin.login.tsx`, `admin.otp.tsx`, `admin.forgot-password.tsx`,
  `admin.reset-password.tsx`, `admin.lock.tsx` — all were fake shells that
  `setTimeout(navigate(...))` and bypassed real auth.
- ❌ Removed `AUTH_PATHS` bypass from `src/routes/admin.tsx` — every
  `/admin/*` route now goes through `AuthGuard`.
- ❌ Removed "Lock screen" item from `AdminHeader` and the fake sign-out
  link from `CommandPalette`; both now use the real Supabase sign-out flow.
- ✅ Added `/reset-password` top-level route calling
  `supabase.auth.updateUser({ password })` (required by
  `resetPasswordForEmail`).
- ✅ `/auth` now:
  - Shows a real "Forgot password?" trigger that calls
    `resetPasswordForEmail(email, { redirectTo: origin + "/reset-password" })`.
  - After successful sign-in redirects by role: staff/manager/admin →
    `/admin`, everyone else → `/account`. Explicit `?redirect=` still wins.

## 2. Auth items still open (do next)

- Email verification currently redirects to `window.location.origin`
  which resolves to the Lovable preview host when unpublished. To make
  verification links land on the DEPART brand:
  1. Attach a custom domain (Project → Domains).
  2. Scaffold branded Lovable auth email templates so the `{{ .SiteURL }}`
     they render uses the custom domain.
- `AdminHeader` still hard-codes "Aanya Sharma / aanya@depart.in" — should
  read from `useAuth().user` + `profiles.full_name`.
- No `manager` / `staff` role assignment UI yet; only `customer` is
  auto-granted by the signup trigger. `admin.users.tsx` is still mock.

## 3. Mock data still imported by routes

Grep of `@/mock` / `@/features/admin/mock` / `useErpStore` / `useOpsStore`
shows these route files remain on mock data. Migrate module-by-module in
following sessions; each must land as a working DB-backed page before the
mock import is deleted.

### Customer surfaces
- `index.tsx` (homepage best-sellers / testimonials)
- `cart.tsx`, `checkout.tsx`, `wishlist.tsx`
- `account.*` (13 files — orders, wallet, coupons, invoices, tracking,
  returns, reviews, notifications, addresses, support, settings, wishlist)

### Admin surfaces still mock
- Sales: `admin.orders`, `admin.fulfillment`, `admin.returns`,
  `admin.refunds`, `admin.delivery`, `admin.delivery-partners`,
  `admin.routes`, `admin.delivery-analytics`
- Purchasing: `admin.purchase-orders`
- Customers: `admin.customers`, `admin.crm`, `admin.loyalty`,
  `admin.tickets`, `admin.knowledge-base`
- Marketing: `admin.marketing`, `admin.notifications`
- Reports: `admin.dashboard`, `admin.analytics`
- System: `admin.users`, `admin.workflows`, `admin.bulk-operations`,
  `admin.barcodes`, `admin.forecast`
- Products: `admin.products` still imports mocks for a few widgets even
  though the main table is DB-backed.

### Mock source files (delete only after last importer is migrated)
- `src/mock/*` (7 files)
- `src/features/admin/mock/*` (3 files)
- `src/store/erp.ts`, `src/store/ops.ts` (mock-only slices)

## 4. Duplicate / dead code

- `src/store/erp.ts` and `src/store/ops.ts` will be dead after mock removal.
- `src/features/admin/mock/data.ts` duplicates `src/mock/*` shapes.
- `useNavigate` imported twice in `AdminHeader.tsx` (harmless, but noise).
- `Moon` icon no longer used in `AdminHeader.tsx` after lock-screen removal.

## 5. Migrations required for remaining modules

To land the mock removals above we need at minimum these tables (schemas
to be designed per module in later sessions):

- `orders`, `order_items`, `order_events`, `fulfillments`, `shipments`,
  `deliveries`, `delivery_partners`, `routes`
- `returns`, `refunds`
- `carts`, `cart_items`, `wishlists`, `addresses`, `wallet_ledger`,
  `coupons`, `coupon_redemptions`
- `crm_notes`, `loyalty_accounts`, `loyalty_events`,
  `support_tickets`, `ticket_messages`, `kb_articles`
- `campaigns`, `notifications`, `push_subscriptions`
- `purchase_orders`, `po_items`
- `workflows`, `workflow_runs`
- `reviews`

Storage: reuse existing `product-media` bucket; add `user-avatars` bucket
when profile-edit lands.

## 6. Validation gates for each future session

Every module migration ships with:
1. Migration + GRANT + RLS + policies.
2. `src/features/<module>/api.ts` + `hooks.ts` (TanStack Query).
3. Route(s) swapped to real hooks — loading + empty + error states.
4. Mock import removed from that route.
5. Typecheck clean.
