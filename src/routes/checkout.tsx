import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { ArrowLeft, Check, CreditCard, MapPin, ScanLine, Wallet } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({
    meta: [
      { title: "Checkout — DineAI" },
      { name: "description", content: "Confirm your table's order in a single tap." },
      { property: "og:title", content: "Confirm your order" },
      { property: "og:description", content: "Simple, elegant, fast." },
    ],
  }),
});

const methods = [
  { id: "card", label: "Card", icon: CreditCard, hint: "Visa ending 4242" },
  { id: "wallet", label: "Apple Pay", icon: Wallet, hint: "One tap" },
  { id: "table", label: "Pay at table", icon: ScanLine, hint: "Server brings the bill" },
];

function Checkout() {
  const { subtotal, count, clear } = useCart();
  const total = subtotal * 1.08;
  const router = useRouter();
  const nav = useNavigate();
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);

  if (count === 0) {
    return (
      <AppShell>
        <div className="px-5 pt-20 text-center">
          <p className="font-display text-2xl">Your table is empty.</p>
          <Link to="/menu" className="mt-4 inline-block text-primary">Browse the menu →</Link>
        </div>
      </AppShell>
    );
  }

  const place = () => {
    setPlacing(true);
    setTimeout(() => {
      clear();
      nav({ to: "/success" });
    }, 1400);
  };

  return (
    <AppShell hideNav>
      <header className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl">Confirm order</h1>
        </div>
      </header>

      <section className="mx-5 mt-6 rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Serving to</div>
            <div className="font-display text-base">Table 12 · Marigold Room</div>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-4 rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
            <div className="font-display text-base">{count} item{count > 1 ? "s" : ""}</div>
          </div>
          <div className="font-display text-lg">${total.toFixed(2)}</div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Estimated to arrive in ~20 minutes.</p>
      </section>

      <section className="mx-5 mt-6">
        <h2 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Payment</h2>
        <div className="space-y-2">
          {methods.map(({ id, label, icon: Icon, hint }) => {
            const active = method === id;
            return (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{hint}</div>
                </div>
                {active && <Check className="h-5 w-5 text-primary" />}
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md px-4 pb-4">
          <button
            onClick={place}
            disabled={placing}
            className="flex w-full items-center justify-between rounded-full px-6 py-4 text-primary-foreground shadow-elevated transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          >
            <span className="font-medium">{placing ? "Sending to kitchen…" : "Confirm & send"}</span>
            <span className="font-display text-lg">${total.toFixed(2)}</span>
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            By confirming, your table's order goes straight to the kitchen.
          </p>
        </div>
      </div>

      {placing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="font-display text-lg">Sending to the kitchen…</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
