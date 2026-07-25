import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { Check, ChefHat, Clock, ClipboardCheck, Flame, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/track")({
  component: Track,
  head: () => ({
    meta: [
      { title: "Order Tracking — DineAI" },
      { name: "description", content: "Watch your order move from the kitchen to your table." },
      { property: "og:title", content: "Your order, in progress" },
      { property: "og:description", content: "Live updates from Chef Anaïs and the kitchen." },
    ],
  }),
});

const steps = [
  { label: "Received", icon: ClipboardCheck, note: "The kitchen has your order" },
  { label: "Preparing", icon: ChefHat, note: "Chef Anaïs is plating" },
  { label: "Cooking", icon: Flame, note: "On the fire" },
  { label: "Ready", icon: UtensilsCrossed, note: "Heading to your table" },
  { label: "Served", icon: Check, note: "Enjoy" },
];

function Track() {
  const [stage, setStage] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s < 4 ? s + 1 : s)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell>
      <header className="px-5 pt-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Order · #A12-0742</p>
        <h1 className="mt-1 font-display text-3xl leading-tight">On its way</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Clock className="mr-1 inline h-3.5 w-3.5" /> Estimated ~{Math.max(2, 18 - stage * 4)} minutes remaining
        </p>
      </header>

      <section className="mx-5 mt-6 overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-elevated" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <span className="absolute inset-0 rounded-full pulse-ring bg-gold/40" />
            <ChefHat className="relative h-7 w-7 text-gold" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60">Message from the kitchen</div>
            <p className="mt-1 font-display text-base leading-snug">"The truffle is being shaved now. Just a few minutes."</p>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-8">
        <ol className="relative space-y-6 border-l border-dashed border-border pl-8">
          {steps.map((s, i) => {
            const state = i < stage ? "done" : i === stage ? "active" : "todo";
            const Icon = s.icon;
            return (
              <li key={s.label} className="relative">
                <span
                  className={`absolute -left-[42px] flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    state === "done" ? "border-primary bg-primary text-primary-foreground" :
                    state === "active" ? "border-primary bg-background text-primary" :
                    "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {state === "active" && <span className="absolute inset-0 rounded-full pulse-ring bg-primary/40" />}
                  <Icon className="h-4 w-4" />
                </span>
                <div className={`font-display text-lg ${state === "todo" ? "text-muted-foreground" : ""}`}>{s.label}</div>
                <div className="text-sm text-muted-foreground">{s.note}</div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mx-5 mt-8">
        <Link to="/concierge" className="block rounded-2xl border border-gold/30 bg-gold/5 p-4 text-center text-sm text-primary">
          Have a question? Ask the concierge →
        </Link>
      </div>
    </AppShell>
  );
}
