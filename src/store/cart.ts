"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { L10n } from "@/lib/types";

export interface CartItem {
  id: string;
  slug: string;
  name: L10n;
  image: string;
  weight: string;
  price: number;
  stock: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(qty, stock > 0 ? stock : 99));

/** Shopping cart — persisted in localStorage */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              open: true,
              items: s.items.map((i) => (i.id === item.id ? { ...i, ...item, qty: clampQty(i.qty + qty, item.stock) } : i)),
            };
          }
          return { open: true, items: [...s.items, { ...item, qty: clampQty(qty, item.stock) }] };
        }),
      setQty: (id, qty) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty: clampQty(qty, i.stock) } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "sifa-bali-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
