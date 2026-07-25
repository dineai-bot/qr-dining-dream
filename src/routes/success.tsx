import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { Check, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/success")({
  component: Success,
  head: () => ({
    meta: [
      { title: "Order Sent — DineAI" },
      { name: "description", content: "Your order has been sent to the kitchen." },
      { property: "og:title", content: "Sent to the kitchen" },
      { property: "og:description", content: "The chef has your order. Enjoy the evening." },
    ],
  }),
});

function Success() {
  return (
    <AppShell hideNav>
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="relative">
          <div className="pulse-ring absolute inset-0 rounded-full bg-primary/30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full shadow-gold" style={{ background: "var(--gradient-gold)" }}>
            <Check className="h-12 w-12 text-gold-foreground" strokeWidth={3} />
          </div>
        </div>
        <h1 className="fade-up mt-8 font-display text-4xl leading-tight" style={{ animationDelay: "150ms" }}>Sent to the kitchen</h1>
        <p className="fade-up mt-3 max-w-xs text-muted-foreground" style={{ animationDelay: "250ms" }}>
          Chef Anaïs has your order. We'll bring it out when it's just right.
        </p>

        <div className="fade-up mt-8 w-full max-w-sm rounded-3xl bg-card p-5 shadow-elevated" style={{ animationDelay: "350ms" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
              <div className="font-display text-lg">#A12-0742</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Ready in</div>
              <div className="font-display text-lg">~18 min</div>
            </div>
          </div>
        </div>

        <div className="fade-up mt-8 flex w-full max-w-sm flex-col gap-2" style={{ animationDelay: "500ms" }}>
          <Link
            to="/track"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-4 font-medium text-primary-foreground shadow-elevated"
            style={{ background: "var(--gradient-hero)" }}
          >
            Track your order
          </Link>
          <Link to="/concierge" className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-gold" /> Ask about dessert
          </Link>
          <button className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" /> Share feedback later
          </button>
        </div>
      </div>
    </AppShell>
  );
}
