import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { MenuCard } from "@/components/dine/MenuCard";
import { categories, dishes } from "@/lib/menu";
import { z } from "zod";

const search = z.object({ cat: z.string().optional() });

export const Route = createFileRoute("/menu")({
  component: Menu,
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Full Menu — DineAI" },
      { name: "description", content: "Browse the complete DineAI menu by category." },
      { property: "og:title", content: "The DineAI menu" },
      { property: "og:description", content: "Browse every dish, drink, and dessert on tonight's menu." },
    ],
  }),
});

function Menu() {
  const { cat } = Route.useSearch();
  const nav = useNavigate();
  const active = cat ?? "signature";
  const filtered = active === "signature"
    ? dishes.filter((d) => d.badges?.includes("signature") || d.badges?.includes("chef"))
    : dishes.filter((d) => d.category === active);

  return (
    <AppShell>
      <header className="px-5 pt-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Menu</p>
        <h1 className="mt-1 font-display text-3xl leading-tight">Tonight's offering</h1>
      </header>

      <div className="mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => nav({ to: "/menu", search: { cat: c.id } })}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              <span aria-hidden>{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      <section className="mt-6 px-5">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">🕯️</div>
            <p className="font-display text-lg">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another section — the chef is always adding.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((d, i) => <MenuCard key={d.id} dish={d} index={i} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}
