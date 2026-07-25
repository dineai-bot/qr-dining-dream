import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dishes, type Dish } from "./menu";

export type CartItem = { id: string; qty: number; note?: string };

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  detailed: (CartItem & { dish: Dish })[];
};

const CartCtx = createContext<Ctx | null>(null);

const KEY = "dineai.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<Ctx>(() => {
    const detailed = items
      .map((i) => {
        const dish = dishes.find((d) => d.id === i.id);
        return dish ? { ...i, dish } : null;
      })
      .filter(Boolean) as (CartItem & { dish: Dish })[];

    const subtotal = detailed.reduce((s, i) => s + i.dish.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);

    return {
      items, count, subtotal, detailed,
      add: (id, qty = 1) =>
        setItems((prev) => {
          const ex = prev.find((p) => p.id === id);
          if (ex) return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { id, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
