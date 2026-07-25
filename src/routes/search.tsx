import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { MenuCard } from "@/components/dine/MenuCard";
import { dishes } from "@/lib/menu";
import { ArrowLeft, Mic, Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search — DineAI" },
      { name: "description", content: "Search dishes, ingredients, and cuisines on the DineAI menu." },
      { property: "og:title", content: "Search the menu" },
      { property: "og:description", content: "Find the perfect dish for your mood tonight." },
    ],
  }),
});

const trending = ["Truffle", "Wagyu", "Margherita", "Burrata", "Negroni"];

function SearchPage() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return dishes.filter((d) =>
      [d.name, d.description, d.category, ...(d.ingredients ?? [])].join(" ").toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <AppShell>
      <header className="sticky top-0 z-20 bg-background/95 px-5 pt-6 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-soft">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Truffle, pizza, something light…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q ? (
              <button onClick={() => setQ("")} aria-label="Clear"><X className="h-4 w-4 text-muted-foreground" /></button>
            ) : (
              <button aria-label="Voice search" className="text-primary"><Mic className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </header>

      {!q && (
        <div className="px-5">
          <section className="mt-4">
            <h2 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Trending tonight</h2>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <button key={t} onClick={() => setQ(t)} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary">
                  {t}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <section className="mt-6 px-5">
        {q && results.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">🔍</div>
            <p className="font-display text-lg">No matches for "{q}"</p>
            <p className="mt-1 text-sm text-muted-foreground">Ask the concierge — it knows the whole kitchen.</p>
          </div>
        )}
        <div className="grid gap-4">
          {results.map((d, i) => <MenuCard key={d.id} dish={d} index={i} />)}
        </div>
      </section>
    </AppShell>
  );
}
