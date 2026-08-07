import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronRight, Bell, MapPin } from "lucide-react";
import { AppShell } from "@/components/dine/AppShell";
import { ConciergeOrb } from "@/components/dine/ConciergeOrb";
import { MenuCard } from "@/components/dine/MenuCard";
import { categories, dishes } from "@/lib/menu";


export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Menu — DineAI" },
      { name: "description", content: "Explore chef's picks, seasonal specials, and today's recommendations." },
      { property: "og:title", content: "The DineAI menu" },
      { property: "og:description", content: "Chef's picks and seasonal specials, curated for you." },
    ],
  }),
});

function Home() {
  const chefs = dishes.filter((d) => d.badges?.includes("chef")).slice(0, 4);
  const popular = dishes.filter((d) => d.badges?.includes("bestseller"));

  return (
    <AppShell>
      <header className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />Table 12 · Marigold Room</p>
            <h1 className="mt-1 font-display text-3xl leading-tight">Good evening, guest.</h1>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-soft" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-ember" />
          </button>
        </div>

        <Link to="/search" className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-muted-foreground shadow-soft transition-shadow hover:shadow-elevated">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-sm">Search dishes, ingredients, cuisines…</span>
          <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-[10px]">Voice</kbd>
        </Link>

        <Link
          to="/concierge"
          className="group relative mt-4 block overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-elevated transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--gradient-hero)" }}
        >
          <span
            className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full opacity-40 blur-2xl"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="relative flex items-center gap-4">
            <ConciergeOrb size={52} active />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/60">AI Concierge</span>
                <span className="rounded-full border border-gold/40 bg-gold/15 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-gold">Live</span>
              </div>
              <div className="mt-1 font-display text-lg leading-tight">Meet Aria, your digital host</div>
              <p className="mt-1 text-xs text-white/60">Pairings, allergies, or "surprise me" — just ask.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="relative mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["What's light tonight?", "Pair my wagyu", "Nut-free desserts"].map((q) => (
              <span key={q} className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] text-white/85">
                {q}
              </span>
            ))}
          </div>
        </Link>

      </header>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="font-display text-xl">Explore</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/menu"
              search={{ cat: c.id }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <span aria-hidden>{c.emoji}</span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Chef's picks tonight</h2>
          <Link to="/menu" className="text-xs text-primary">See all</Link>
        </div>
        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chefs.map((d, i) => (
            <div key={d.id} className="w-64 shrink-0">
              <MenuCard dish={d} index={i} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Popular this week</h2>
          <Link to="/menu" className="text-xs text-primary">See all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {popular.map((d, i) => (
            <MenuCard key={d.id} dish={d} index={i} />
          ))}
        </div>
      </section>

      <section className="mt-10 px-5">
        <div className="rounded-3xl p-6 shadow-soft" style={{ background: "var(--gradient-warm)" }}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">A note from the kitchen</p>
          <p className="mt-2 font-display text-lg leading-snug">
            "Slow food, quiet room. If anything doesn't feel right, tell us."
          </p>
          <p className="mt-3 text-sm text-muted-foreground">— Chef Anaïs</p>
        </div>
      </section>
    </AppShell>
  );
}
