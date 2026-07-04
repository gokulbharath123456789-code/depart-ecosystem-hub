
-- =========================================================================
-- ENUMS
-- =========================================================================
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'pending','confirmed','picking','packing','ready_for_dispatch',
    'out_for_delivery','delivered','completed','cancelled','returned','refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM (
    'pending','authorized','paid','failed','refunded','partially_refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('upi','card','wallet','cod','netbanking','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.coupon_kind AS ENUM ('percent','fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_category AS ENUM (
    'order','payment','delivery','promotion','system','account'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend stock_movement_kind if 'sale' not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid
    WHERE t.typname='stock_movement_kind' AND e.enumlabel='sale'
  ) THEN
    ALTER TYPE public.stock_movement_kind ADD VALUE 'sale';
  END IF;
END $$;

-- =========================================================================
-- ADDRESSES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  full_name text NOT NULL,
  phone text NOT NULL,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  country text NOT NULL DEFAULT 'IN',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS addresses_user_idx ON public.addresses(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses owner all" ON public.addresses
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "addresses staff read" ON public.addresses
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- COUPONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  kind public.coupon_kind NOT NULL DEFAULT 'fixed',
  value numeric(12,2) NOT NULL DEFAULT 0,
  min_order numeric(12,2) NOT NULL DEFAULT 0,
  max_discount numeric(12,2),
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons public read active" ON public.coupons
  FOR SELECT USING (is_active = true);
CREATE POLICY "coupons staff write" ON public.coupons
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));
CREATE TRIGGER coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- ORDERS
-- =========================================================================
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 100001;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('DPT-' || nextval('public.order_number_seq')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  payment_method public.payment_method,
  channel text NOT NULL DEFAULT 'web',

  -- Snapshotted address
  address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  ship_full_name text NOT NULL,
  ship_phone text NOT NULL,
  ship_line1 text NOT NULL,
  ship_line2 text,
  ship_city text NOT NULL,
  ship_state text NOT NULL,
  ship_pincode text NOT NULL,
  ship_country text NOT NULL DEFAULT 'IN',

  warehouse_id uuid REFERENCES public.warehouses(id) ON DELETE SET NULL,
  delivery_slot text,

  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',

  coupon_code text,
  notes text,
  placed_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_placed_idx ON public.orders(placed_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders owner read" ON public.orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "orders owner insert" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders owner cancel" ON public.orders
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('pending','confirmed'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending','confirmed','cancelled'));
CREATE POLICY "orders staff all" ON public.orders
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- ORDER ITEMS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text,
  product_unit text,
  qty numeric(14,3) NOT NULL CHECK (qty > 0),
  unit_price numeric(12,2) NOT NULL,
  tax_rate numeric(5,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  subtotal numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON public.order_items(product_id);

GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items owner read" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "order_items owner insert" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "order_items staff all" ON public.order_items
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

-- =========================================================================
-- ORDER STATUS HISTORY
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  note text,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_status_history_order_idx ON public.order_status_history(order_id, created_at DESC);
GRANT SELECT, INSERT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "osh owner read" ON public.order_status_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "osh owner insert" ON public.order_status_history
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "osh staff all" ON public.order_status_history
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

-- =========================================================================
-- PAYMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'manual',
  provider_order_id text,
  provider_payment_id text,
  method public.payment_method,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status public.payment_status NOT NULL DEFAULT 'pending',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_order_idx ON public.payments(order_id);
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments owner read" ON public.payments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "payments owner insert" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "payments staff all" ON public.payments
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- INVOICES
-- =========================================================================
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 500001;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE DEFAULT ('INV-' || nextval('public.invoice_number_seq')),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  pdf_url text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invoices_order_idx ON public.invoices(order_id);
GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices owner read" ON public.invoices
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "invoices staff all" ON public.invoices
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.notification_category NOT NULL DEFAULT 'system',
  title text NOT NULL,
  body text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications owner all" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications staff all" ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

-- =========================================================================
-- HELPER: ensure single default address
-- =========================================================================
CREATE OR REPLACE FUNCTION public.tg_addresses_single_default()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE public.addresses SET is_default = false
      WHERE user_id = NEW.user_id AND id <> NEW.id AND is_default = true;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS addresses_single_default ON public.addresses;
CREATE TRIGGER addresses_single_default AFTER INSERT OR UPDATE OF is_default
  ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.tg_addresses_single_default();

-- =========================================================================
-- FUNCTION: place_order — atomic checkout
-- =========================================================================
CREATE OR REPLACE FUNCTION public.place_order(
  _address_id uuid,
  _items jsonb,               -- [{product_id, qty}]
  _payment_method public.payment_method DEFAULT 'cod',
  _delivery_slot text DEFAULT 'standard',
  _coupon_code text DEFAULT NULL,
  _notes text DEFAULT NULL
) RETURNS public.orders
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _addr public.addresses;
  _wh public.warehouses;
  _order public.orders;
  _item jsonb;
  _product public.products;
  _qty numeric;
  _subtotal numeric(12,2) := 0;
  _tax numeric(12,2) := 0;
  _delivery numeric(12,2) := 0;
  _discount numeric(12,2) := 0;
  _total numeric(12,2) := 0;
  _line_subtotal numeric(12,2);
  _line_tax numeric(12,2);
  _coupon public.coupons;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;

  SELECT * INTO _addr FROM public.addresses WHERE id = _address_id AND user_id = _uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'address_not_found'; END IF;

  SELECT * INTO _wh FROM public.warehouses WHERE is_default = true LIMIT 1;
  IF NOT FOUND THEN SELECT * INTO _wh FROM public.warehouses LIMIT 1; END IF;
  IF NOT FOUND THEN RAISE EXCEPTION 'no_warehouse'; END IF;

  IF jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'empty_cart'; END IF;

  -- Insert shell order
  INSERT INTO public.orders (
    user_id, address_id, warehouse_id, payment_method, delivery_slot,
    ship_full_name, ship_phone, ship_line1, ship_line2, ship_city, ship_state, ship_pincode, ship_country,
    coupon_code, notes
  ) VALUES (
    _uid, _addr.id, _wh.id, _payment_method, _delivery_slot,
    _addr.full_name, _addr.phone, _addr.line1, _addr.line2, _addr.city, _addr.state, _addr.pincode, _addr.country,
    _coupon_code, _notes
  ) RETURNING * INTO _order;

  -- Iterate items
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    SELECT * INTO _product FROM public.products WHERE id = (_item->>'product_id')::uuid;
    IF NOT FOUND THEN RAISE EXCEPTION 'product_not_found: %', _item->>'product_id'; END IF;
    _qty := (_item->>'qty')::numeric;
    IF _qty <= 0 THEN CONTINUE; END IF;

    _line_subtotal := round(_product.price * _qty, 2);
    _line_tax := round(_line_subtotal * _product.tax_rate / 100.0, 2);

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_sku, product_unit,
      qty, unit_price, tax_rate, subtotal
    ) VALUES (
      _order.id, _product.id, _product.name, _product.sku, _product.unit,
      _qty, _product.price, _product.tax_rate, _line_subtotal
    );

    _subtotal := _subtotal + _line_subtotal;
    _tax := _tax + _line_tax;

    -- Reduce inventory via existing helper (logs stock movement)
    PERFORM public.adjust_stock(
      _product.id, _wh.id, -_qty, 'sale'::stock_movement_kind,
      _order.order_number, 'Order ' || _order.order_number
    );
  END LOOP;

  -- Coupon
  IF _coupon_code IS NOT NULL AND length(_coupon_code) > 0 THEN
    SELECT * INTO _coupon FROM public.coupons
      WHERE code = upper(_coupon_code)
        AND is_active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (expires_at IS NULL OR expires_at >= now())
        AND (usage_limit IS NULL OR used_count < usage_limit);
    IF FOUND AND _subtotal >= _coupon.min_order THEN
      IF _coupon.kind = 'percent' THEN
        _discount := round(_subtotal * _coupon.value / 100.0, 2);
        IF _coupon.max_discount IS NOT NULL THEN
          _discount := LEAST(_discount, _coupon.max_discount);
        END IF;
      ELSE
        _discount := _coupon.value;
      END IF;
      UPDATE public.coupons SET used_count = used_count + 1 WHERE id = _coupon.id;
    END IF;
  END IF;

  -- Delivery fee
  IF _delivery_slot = 'express' THEN
    _delivery := 49;
  ELSIF _subtotal < 499 THEN
    _delivery := 39;
  ELSE
    _delivery := 0;
  END IF;

  _total := _subtotal + _tax + _delivery - _discount;

  UPDATE public.orders SET
    subtotal = _subtotal,
    tax_amount = _tax,
    delivery_fee = _delivery,
    discount_amount = _discount,
    total = _total
  WHERE id = _order.id
  RETURNING * INTO _order;

  -- Initial status entry
  INSERT INTO public.order_status_history (order_id, status, note, actor_id)
  VALUES (_order.id, 'pending', 'Order placed', _uid);

  -- Payment shell
  INSERT INTO public.payments (order_id, provider, method, amount, status)
  VALUES (
    _order.id,
    CASE WHEN _payment_method = 'cod' THEN 'cod' ELSE 'razorpay' END,
    _payment_method, _total,
    CASE WHEN _payment_method = 'cod' THEN 'pending'::payment_status ELSE 'pending'::payment_status END
  );

  -- Invoice
  INSERT INTO public.invoices (order_id, amount, tax_amount)
  VALUES (_order.id, _total, _tax);

  -- Notification
  INSERT INTO public.notifications (user_id, category, title, body, order_id)
  VALUES (_uid, 'order', 'Order placed',
          'Your order ' || _order.order_number || ' has been placed successfully.',
          _order.id);

  RETURN _order;
END $$;

REVOKE ALL ON FUNCTION public.place_order(uuid, jsonb, public.payment_method, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order(uuid, jsonb, public.payment_method, text, text, text) TO authenticated;

-- =========================================================================
-- FUNCTION: update_order_status (staff or owner-cancel)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_order_status(
  _order_id uuid,
  _status public.order_status,
  _note text DEFAULT NULL
) RETURNS public.orders
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _o public.orders;
  _is_staff boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT * INTO _o FROM public.orders WHERE id = _order_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'order_not_found'; END IF;

  _is_staff := public.has_any_role(_uid, ARRAY['admin','manager','staff']::app_role[]);

  IF NOT _is_staff THEN
    IF _o.user_id <> _uid THEN RAISE EXCEPTION 'forbidden'; END IF;
    IF _status <> 'cancelled' THEN RAISE EXCEPTION 'customers_can_only_cancel'; END IF;
    IF _o.status NOT IN ('pending','confirmed') THEN RAISE EXCEPTION 'cannot_cancel_now'; END IF;
  END IF;

  UPDATE public.orders SET
    status = _status,
    delivered_at = CASE WHEN _status = 'delivered' THEN now() ELSE delivered_at END,
    cancelled_at = CASE WHEN _status = 'cancelled' THEN now() ELSE cancelled_at END
  WHERE id = _order_id RETURNING * INTO _o;

  INSERT INTO public.order_status_history (order_id, status, note, actor_id)
  VALUES (_order_id, _status, _note, _uid);

  INSERT INTO public.notifications (user_id, category, title, body, order_id)
  VALUES (_o.user_id, 'order',
          'Order ' || _o.order_number || ' — ' || _status::text,
          COALESCE(_note, 'Your order status was updated to ' || _status::text || '.'),
          _o.id);

  RETURN _o;
END $$;

REVOKE ALL ON FUNCTION public.update_order_status(uuid, public.order_status, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, public.order_status, text) TO authenticated;

-- =========================================================================
-- Seed a couple of demo coupons
-- =========================================================================
INSERT INTO public.coupons (code, title, description, kind, value, min_order, is_active)
VALUES
  ('DEPART50', '₹50 off', 'Flat ₹50 off on orders above ₹299', 'fixed', 50, 299, true),
  ('WELCOME10', '10% off', '10% off (max ₹150) on your first order', 'percent', 10, 199, true)
ON CONFLICT (code) DO NOTHING;
UPDATE public.coupons SET max_discount = 150 WHERE code = 'WELCOME10' AND max_discount IS NULL;
