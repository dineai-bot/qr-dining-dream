import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { useCart } from "@/lib/cart";
import { ArrowLeft, Minus, Plus, Sparkles, Ticket, Trash2 } from "lucide-react";
import { VegDot } from "@/components/dine/VegDot";
import { dishes } from "@/lib/menu";

export const Route = createFileRoute("/cart")({
  component: Cart,
  head: () => ({
    meta: [
      { title: "Your Table — DineAI" },
      { name: "description", content: "Review your order before sending it to the kitchen." },
      { property: "og:title", content: "Review your order" },
      { property: "og:description", content: "Everything you've chosen for tonight, in one place." },
    ],
  }),
});

function Cart() {
  const { detailed, setQty, subtotal, remove } = useCart();
  const router = useRouter();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const upsell = dishes.find((d) => d.id === "lava");

  return (
    <AppShell>
      <header className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Table 12</p>
            <h1 className="font-display text-2xl">Your order</h1>
          </div>
        </div>
      </header>

      {detailed.length === 0 ? (
        <div className="mx-5 mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">🍽️</div>
          <p className="font-display text-xl">Nothing at the table yet</p>
          <p className="mt-1 text-sm text-muted-foreground">The menu is right this way.</p>
          <Link to="/menu" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Explore the menu</Link>
        </div>
      ) : (
        <>
          <section className="mt-6 space-y-3 px-5">
            {detailed.map((i) => (
              <div key={i.id} className="fade-up flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
                <img src={i.dish.image} alt="" loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <VegDot veg={i.dish.veg} />
                    <span className="truncate font-display text-base">{i.dish.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{i.dish.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full bg-secondary px-1.5 py-1">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-background" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-5 text-center text-sm font-medium">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-background" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display">${(i.dish.price * i.qty).toFixed(2)}</span>
                      <button onClick={() => remove(i.id)} className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Remove">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {upsell && !detailed.find((d) => d.id === upsell.id) && (
            <section className="mx-5 mt-5">
              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold"><Sparkles className="h-3.5 w-3.5" /> Concierge suggests</div>
                <div className="mt-3 flex items-center gap-3">
                  <img src={upsell.image} alt="" loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="font-display text-base">{upsell.name}</div>
                    <div className="text-xs text-muted-foreground">Sweeten the ending — ${upsell.price}</div>
                  </div>
                  <Link to="/dish/$id" params={{ id: upsell.id }} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Add</Link>
                </div>
              </div>
            </section>
          )}

          <section className="mx-5 mt-5">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Special instructions</label>
            <textarea rows={2} placeholder="Extra crispy? Allergies?" className="mt-2 w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:border-primary" />
          </section>

          <section className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-border p-4">
            <Ticket className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm">Apply a coupon</span>
            <button className="text-sm font-medium text-primary">Add</button>
          </section>

          <section className="mx-5 mt-5 space-y-2 rounded-2xl bg-card p-4 shadow-soft">
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Taxes & service (8%)" value={`$${tax.toFixed(2)}`} />
            <div className="my-2 border-t border-border" />
            <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            <p className="pt-1 text-xs text-muted-foreground">Estimated preparation ~ 20 minutes</p>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto max-w-md px-4 pb-4">
              <Link
                to="/checkout"
                className="flex items-center justify-between rounded-full px-6 py-4 text-primary-foreground shadow-elevated transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "var(--gradient-hero)" }}
              >
                <span className="font-medium">Send to kitchen</span>
                <span className="font-display text-lg">${total.toFixed(2)}</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "font-display text-lg" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "text-foreground" : ""}>{value}</span>
    </div>
  );
}
