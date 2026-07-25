import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function FloatingCart() {
  const { count, subtotal } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (count === 0) return null;
  if (path === "/cart" || path === "/checkout" || path === "/") return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-30 px-4 pb-1">
      <Link
        to="/cart"
        className="fade-up mx-auto flex max-w-md items-center justify-between rounded-full px-5 py-3 text-primary-foreground shadow-elevated transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
              {count}
            </span>
          </div>
          <div className="text-left">
            <div className="text-[11px] uppercase tracking-widest text-white/60">Your table</div>
            <div className="text-sm font-medium">{count} item{count > 1 ? "s" : ""} · ${subtotal.toFixed(2)}</div>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">Review →</span>
      </Link>
    </div>
  );
}
