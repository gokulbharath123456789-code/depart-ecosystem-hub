# DEPART V2 — Phase 7 Architecture Audit

_Generated during Session A. This is the working baseline for the production refactor — Sessions B/C/D will use it as the checklist._

## Stack reality check

- Runtime: TanStack Start v1 on Cloudflare Workers (no Node host, no Express, no Mongo TCP).
- Backend (this session, just enabled): Lovable Cloud — Postgres + Supabase auth + Storage + Realtime + Email.
- Original Phase 7 request asked for Node+Express+MongoDB+Mongoose+Multer+Nodemailer+Socket.IO. None of those run inside this project. The user agreed to use Lovable Cloud (same end-state capabilities, no separate hosting).

## Session A — what shipped this turn

- DB foundation: `profiles`, `app_role` enum, `user_roles`, `has_role()`, `has_any_role()`, signup trigger (`handle_new_user`) that auto-creates a profile + default `customer` role. RLS enabled. SECURITY DEFINER exposure tightened (linter explicit-accept memo recorded).
- `/auth` route: email/password + Google OAuth via Lovable's broker. Google provider configured in Cloud.
- `useAuth()` hook + `<AuthGuard>` component. No file renames — guards wrap the existing `/account` and `/admin` layouts.
- `/account/*` requires sign-in.
- `/admin/*` requires sign-in AND one of `admin | manager | staff` roles. Auth routes inside `/admin/*` (login, otp, lock, forgot/reset) still bypass the guard.
- Real `supabase.auth.signOut()` wired in admin user menu + customer dashboard.
- Single `onAuthStateChange` subscriber lives in `__root.tsx` (filtered to identity transitions, no thrashing).
- Admin sidebar regrouped into the workflow groups requested: Dashboard / Sales / Catalog / Inventory / Purchasing / Customers / Marketing / Reports / System.
- Navbar shows "Sign in" CTA when signed-out, profile icon when signed-in.

## Phase 1 audit — findings

### Duplicate/redundant routes (keep, but document)

| Route(s) | Status | Recommendation |
|---|---|---|
| `admin.login.tsx` + `admin.forgot-password.tsx` + `admin.reset-password.tsx` + `admin.otp.tsx` + `admin.lock.tsx` | Functional but duplicate of `/auth` for admin specifically | Session B: redirect `/admin/login` → `/auth?redirect=/admin/dashboard`. Delete the four admin auth pages once the consolidated `/auth` covers OTP + password reset. |
| `/account/notifications` + `/admin/notifications` | Both ship — intentional (customer inbox vs admin ops feed) | Keep. Will share a single `notifications` table with `audience` column. |
| `/account/wallet` + `/admin/refunds` | Different concerns, no overlap | Keep. |

### Dead/mock data files (to remove progressively)

- `src/mock/products.ts` (~18 products, gradient emojis)
- `src/mock/categories.ts`
- `src/mock/brands.ts`
- `src/mock/testimonials.ts`
- `src/mock/account.ts` (user, orders, wallet, invoices, tickets, addresses)
- `src/features/admin/mock/data.ts` (analytics seed)
- `src/features/admin/mock/erp.ts` (100 products, 20 suppliers, 5 warehouses, 18 POs, 60 movements, 36 batches)
- `src/features/admin/mock/ops.ts` (500 orders, 100 customers, 25 drivers, 120 returns, 60 tickets)

**Rule for Sessions B/C/D**: a mock file is deleted only after every page that imports it has been migrated to a server function. Until then it stays — removing prematurely crashes the app on every visit.

### Components flagged

- `src/store/cart.ts`, `src/store/wishlist.ts` — currently localStorage-only. Session C will mirror to `cart_items` / `wishlist_items` tables for signed-in users; localStorage stays as the guest cart fallback.
- `src/store/erp.ts`, `src/store/ops.ts` — UI state (selection, view toggle). Keep as-is.
- `src/store/admin.ts` — theme + sidebar collapse + favorites. Keep, persisted to localStorage.
- `src/features/admin/components/AuthCard.tsx` — used only by the admin auth pages slated for deletion; will be removed alongside them.

### Navigation inconsistencies

- Mobile bottom nav (`MobileBottomNav`) links to `/account` even when signed out → will now redirect to `/auth` via the guard. Acceptable.
- Admin command palette includes "New purchase order" that points at a route which only renders a static form — no submit handler. Will gain a real `createServerFn` in Session B.

## Sessions B → D roadmap

### Session B — Catalog + Inventory online

SQL: `categories`, `brands`, `suppliers`, `warehouses`, `products`, `product_images`, `product_variants`, `inventory_levels` (per warehouse), `stock_movements`, `batches`. RLS: public SELECT for `categories`/`brands`/`products` (active only); admin/manager/staff write.

Server fns: `listProducts`, `getProduct`, `upsertProduct`, `archiveProduct`, `listCategories`, `listSuppliers`, `upsertSupplier`, `adjustStock`, `listMovements`, `listBatches`.

Storage bucket: `product-media` (public read), wired into `admin.products.new.tsx` step 6 (Media). Replaces every emoji placeholder with real Lovable Cloud Storage URLs.

Pages migrated off mock: `/shop`, `/category/$slug`, `/product/$slug`, `/admin/products`, `/admin/products/new`, `/admin/categories`, `/admin/inventory`, `/admin/warehouses`, `/admin/stock-movements`, `/admin/stock-adjustments`, `/admin/batches`, `/admin/suppliers`. Mock files deleted at end: `mock/products.ts`, `mock/categories.ts`, `mock/brands.ts`, `features/admin/mock/erp.ts` (partial).

### Session C — Orders + Checkout + Fulfillment + CRM

SQL: `addresses`, `cart_items`, `wishlist_items`, `coupons`, `coupon_redemptions`, `orders`, `order_items`, `order_events` (audit), `shipments`, `delivery_partners`, `returns`, `refunds`. RLS: customer reads own; staff+ reads all.

Server fns: `addToCart`, `applyCoupon`, `placeOrder` (transactional: insert order + items + decrement inventory + insert order_event), `cancelOrder`, `listMyOrders`, `getMyOrder`, `listAdminOrders`, `advanceFulfillment` (status state machine), `requestReturn`, `approveReturn`, `issueRefund`.

Realtime: subscribe `orders` insert on admin dashboard + fulfillment Kanban; new-order toast.

Payments: COD only this session (Razorpay deferred per your earlier choice).

Email: order confirmation + status update via Lovable Email (auto via Lovable Cloud).

### Session D — Dashboard live data, CRM, audit log, polish

SQL: `notifications`, `support_tickets`, `ticket_messages`, `audit_log`, `loyalty_tiers`, `customer_loyalty`.

Server fns: `listMyNotifications`, `listAdminMetrics` (revenue, orders, AOV, low-stock count), `listSupportTickets`, `createTicket`, `replyTicket`, `recordAudit`.

Real dashboard widgets reading from DB. Realtime notifications. Final mock-file deletion. Final cleanup pass — remove unused stores, dead components, broken imports, console warnings.

## How a developer becomes admin

New signups get `customer` role automatically. To promote yourself for testing the admin shell, the workspace owner runs this in the Cloud SQL editor once (replace the email):

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'you@example.com'
ON CONFLICT DO NOTHING;
```

Session B will add an admin-only "Team" page that calls a privileged `grantRole` server function (verified `has_role('admin')`) so further role grants happen in-app.