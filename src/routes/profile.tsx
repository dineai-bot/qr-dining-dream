import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { ChevronRight, Heart, MapPin, Moon, Receipt, Sparkles, Utensils } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Your Profile — DineAI" },
      { name: "description", content: "Your dining preferences, favourites, and past visits." },
      { property: "og:title", content: "Your dining profile" },
      { property: "og:description", content: "Preferences and favourites, saved between visits." },
    ],
  }),
});

const rows = [
  { icon: Heart, label: "Favourites", value: "3 dishes" },
  { icon: Receipt, label: "Past orders", value: "12 visits" },
  { icon: Utensils, label: "Dietary preferences", value: "Vegetarian · No nuts" },
  { icon: MapPin, label: "Usual table", value: "Marigold Room" },
  { icon: Moon, label: "Appearance", value: "Auto" },
];

function Profile() {
  return (
    <AppShell>
      <header className="px-5 pt-8">
        <h1 className="font-display text-3xl">You</h1>
      </header>

      <section className="mx-5 mt-6 flex items-center gap-4 rounded-3xl p-5 shadow-soft" style={{ background: "var(--gradient-warm)" }}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full font-display text-2xl shadow-gold" style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}>
          A
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg">Amelie Rousseau</div>
          <div className="text-sm text-muted-foreground">Member since 2023 · Marigold list</div>
        </div>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Gold</div>
      </section>

      <section className="mx-5 mt-6 space-y-2">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{value}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </section>

      <section className="mx-5 mt-6">
        <Link to="/concierge" className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4">
          <Sparkles className="h-5 w-5 text-gold" />
          <div className="flex-1 text-sm">
            <div className="font-medium">Teach the concierge</div>
            <div className="text-xs text-muted-foreground">Tell us how you like to eat</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>
    </AppShell>
  );
}
