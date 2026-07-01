
-- Storage policies for product-media bucket
CREATE POLICY "product-media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-media');

CREATE POLICY "product-media staff insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-media'
    AND public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

CREATE POLICY "product-media staff update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-media'
    AND public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

CREATE POLICY "product-media staff delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-media'
    AND public.has_any_role(auth.uid(), ARRAY['admin','manager','staff']::app_role[]));

-- Atomic stock adjustment: update level + write movement
CREATE OR REPLACE FUNCTION public.adjust_stock(
  _product_id UUID,
  _warehouse_id UUID,
  _delta NUMERIC,
  _kind public.stock_movement_kind,
  _reference TEXT DEFAULT NULL,
  _note TEXT DEFAULT NULL
)
RETURNS public.stock_movements
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _movement public.stock_movements;
BEGIN
  INSERT INTO public.inventory_levels (product_id, warehouse_id, on_hand)
  VALUES (_product_id, _warehouse_id, GREATEST(_delta, 0))
  ON CONFLICT (product_id, warehouse_id)
  DO UPDATE SET on_hand = public.inventory_levels.on_hand + _delta,
                updated_at = now();

  INSERT INTO public.stock_movements (product_id, warehouse_id, kind, qty, reference, note, created_by)
  VALUES (_product_id, _warehouse_id, _kind, _delta, _reference, _note, auth.uid())
  RETURNING * INTO _movement;

  RETURN _movement;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.adjust_stock(UUID, UUID, NUMERIC, public.stock_movement_kind, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.adjust_stock(UUID, UUID, NUMERIC, public.stock_movement_kind, TEXT, TEXT) TO authenticated;
