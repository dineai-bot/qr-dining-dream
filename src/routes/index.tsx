import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "Welcome — DineAI" },
      { name: "description", content: "Scan, sit, and let our AI concierge guide your evening at DineAI." },
      { property: "og:title", content: "Welcome to DineAI" },
      { property: "og:description", content: "A quieter, more thoughtful way to dine." },
    ],
  }),
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Welcome() {
  return (
    <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img src={hero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,25,20,0.35) 0%, rgba(15,25,20,0.55) 40%, rgba(15,25,20,0.95) 100%)" }} />
      </div>

      <div className="relative flex min-h-dvh flex-col px-6 pb-10 pt-10 text-white">
        <div className="fade-up flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
              <Sparkles className="h-4 w-4 text-gold-foreground" />
            </div>
            <span className="font-display text-xl tracking-tight">DineAI</span>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <MapPin className="mr-1 inline h-3 w-3" /> Table 12
          </span>
        </div>

        <div className="mt-auto space-y-6 fade-up" style={{ animationDelay: "150ms" }}>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">{greeting()}</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05]">
              Welcome to the <em className="gradient-text-gold not-italic">Marigold</em> table.
            </h1>
            <p className="mt-4 max-w-xs text-base text-white/70">
              Tonight, our chef is featuring winter truffle. Take your time. We'll be here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Tonight's special
            </div>
            <div className="mt-1 font-display text-lg">Black Truffle Tagliolini</div>
            <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ready in ~18 min</span>
              <span>Chef Anaïs</span>
            </div>
          </div>

          <Link
            to="/home"
            className="group flex items-center justify-between rounded-full py-4 pl-6 pr-4 text-lg font-medium text-primary-foreground shadow-elevated transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, oklch(0.42 0.1 160), oklch(0.28 0.07 165))" }}
          >
            Start dining
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
          <p className="text-center text-xs text-white/50">Your server, Priya, is caring for your table tonight.</p>
        </div>
      </div>
    </div>
  );
}
