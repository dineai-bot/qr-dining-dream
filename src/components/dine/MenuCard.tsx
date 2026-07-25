import { Link } from "@tanstack/react-router";
import { Plus, Star, Clock, Flame } from "lucide-react";
import type { Dish } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { VegDot } from "./VegDot";
import { toast } from "sonner";

export function MenuCard({ dish, index = 0 }: { dish: Dish; index?: number }) {
  const { add } = useCart();
  return (
    <div
      className="fade-up group relative overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to="/dish/$id" params={{ id: dish.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {dish.badges?.includes("chef") && (
            <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-foreground shadow-gold" style={{ background: "var(--gradient-gold)" }}>
              Chef's Pick
            </span>
          )}
          {dish.badges?.includes("bestseller") && !dish.badges?.includes("chef") && (
            <span className="absolute left-3 top-3 rounded-full bg-ember/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <VegDot veg={dish.veg} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-gold text-gold" /> {dish.rating}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {dish.prepMins}m
          </span>
          {dish.spice > 0 && (
            <span className="flex items-center text-xs text-ember">
              {Array.from({ length: dish.spice }).map((_, i) => (
                <Flame key={i} className="h-3 w-3" />
              ))}
            </span>
          )}
        </div>
        <Link to="/dish/$id" params={{ id: dish.id }}>
          <h3 className="font-display text-lg leading-tight">{dish.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl">${dish.price}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              add(dish.id);
              toast.success(`Added ${dish.name}`);
            }}
            className="group/btn flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-all hover:scale-110 hover:shadow-elevated active:scale-95"
            aria-label={`Add ${dish.name}`}
          >
            <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
