import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Flame, Heart, Minus, Plus, Star } from "lucide-react";
import { findDish, dishes } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { VegDot } from "@/components/dine/VegDot";
import { useState } from "react";
import { toast } from "sonner";
import { MenuCard } from "@/components/dine/MenuCard";

export const Route = createFileRoute("/dish/$id")({
  component: DishPage,
  loader: ({ params }) => {
    const dish = findDish(params.id);
    if (!dish) throw notFound();
    return { dish };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.dish.name ?? "Dish"} — DineAI` },
      { name: "description", content: loaderData?.dish.description ?? "A dish from the DineAI menu." },
      { property: "og:title", content: loaderData?.dish.name ?? "DineAI" },
      { property: "og:description", content: loaderData?.dish.description ?? "" },
    ],
  }),
});

function DishPage() {
  const { dish } = Route.useLoaderData();
  const { add } = useCart();
  const nav = useNavigate();
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const pairs = dishes.filter((d) => dish.pairs?.includes(d.id));

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background pb-36">
      <div className="relative">
        <img src={dish.image} alt={dish.name} className="aspect-square w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <button
            onClick={() => nav({ to: "/menu" })}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => { setFav(!fav); toast.success(fav ? "Removed from favourites" : "Saved to favourites"); }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            aria-label="Favorite"
          >
            <Heart className={`h-5 w-5 ${fav ? "fill-ember text-ember" : ""}`} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="-mt-6 rounded-t-3xl bg-background px-6 pt-6">
        <div className="mb-2 flex items-center gap-2">
          <VegDot veg={dish.veg} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-gold text-gold" /> {dish.rating}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {dish.prepMins} min
          </span>
          <span className="text-xs text-muted-foreground">· {dish.calories} kcal</span>
        </div>
        <h1 className="font-display text-3xl leading-tight">{dish.name}</h1>
        <p className="mt-2 text-muted-foreground">{dish.description}</p>

        {dish.story && (
          <p className="mt-4 rounded-2xl bg-muted p-4 font-display text-base italic leading-snug">"{dish.story}"</p>
        )}

        {dish.ingredients && (
          <section className="mt-6">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Ingredients</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {dish.ingredients.map((i) => (
                <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs">{i}</span>
              ))}
            </div>
          </section>
        )}

        {dish.allergens && dish.allergens.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Allergens</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {dish.allergens.map((a) => (
                <span key={a} className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-xs text-ember">{a}</span>
              ))}
            </div>
          </section>
        )}

        {dish.spice > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Spice level:</span>
            <span className="flex text-ember">
              {Array.from({ length: 3 }).map((_, i) => (
                <Flame key={i} className={`h-4 w-4 ${i < dish.spice ? "" : "opacity-20"}`} />
              ))}
            </span>
          </div>
        )}

        {pairs.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 font-display text-lg">Pairs beautifully with</h3>
            <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pairs.map((p, i) => (
                <div key={p.id} className="w-60 shrink-0"><MenuCard dish={p} index={i} /></div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-4">
          <p className="text-xs uppercase tracking-widest text-gold">AI concierge</p>
          <p className="mt-1 text-sm">This pairs beautifully with our smoked negroni. Would you like me to add one?</p>
          <Link to="/concierge" className="mt-2 inline-block text-xs font-medium text-primary">Ask the concierge →</Link>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md px-4 pb-4">
          <div className="glass flex items-center gap-3 rounded-full p-2 shadow-elevated">
            <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-background" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="min-w-6 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-background" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => { add(dish.id, qty); toast.success(`${qty} × ${dish.name} added`); }}
              className="flex flex-1 items-center justify-between rounded-full px-5 py-3 text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "var(--gradient-hero)" }}
            >
              <span className="font-medium">Add to table</span>
              <span className="font-display text-lg">${(dish.price * qty).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
