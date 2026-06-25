import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (id, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === id ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...s.items, { productId: id, qty }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== id)
              : s.items.map((i) => (i.productId === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "depart-cart" },
  ),
);

export const useCartCount = () =>
  useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));