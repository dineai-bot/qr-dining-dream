import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import heroLight from "@/assets/hero-light.jpg";
import { ThemeSwitcher } from "@/components/dine/ThemeSwitcher";
import { pastelThemes, useTheme } from "@/lib/theme";

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
  const [greet, setGreet] = useState("Welcome");
  const { theme } = useTheme();
  const pastel = pastelThemes.includes(theme);
  useEffect(() => setGreet(greeting()), []);

  return (
    <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img src={pastel ? heroLight : hero} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: pastel
              ? "linear-gradient(180deg, color-mix(in oklab, var(--background) 20%, transparent) 0%, color-mix(in oklab, var(--background) 60%, transparent) 40%, color-mix(in oklab, var(--background) 96%, transparent) 100%)"
              : "linear-gradient(180deg, rgba(15,25,20,0.35) 0%, rgba(15,25,20,0.55) 40%, rgba(15,25,20,0.95) 100%)",
          }}
        />
      </div>

      <div
        className={`relative flex min-h-dvh flex-col px-6 pb-10 pt-10 ${pastel ? "text-foreground" : "text-white"}`}
      >
        <div className="fade-up flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
              <Sparkles className="h-4 w-4 text-gold-foreground" />
            </div>
            <span className="font-display text-xl tracking-tight">DineAI</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs backdrop-blur ${
                pastel ? "border-border bg-card/70" : "border-white/20 bg-white/10"
              }`}
            >
              <MapPin className="mr-1 inline h-3 w-3" /> Table 12
            </span>
            <ThemeSwitcher tone={pastel ? "light" : "dark"} />
          </div>
        </div>

        <div className="mt-auto space-y-6 fade-up" style={{ animationDelay: "150ms" }}>
          <div>
            <p className={`text-sm uppercase tracking-[0.3em] ${pastel ? "text-muted-foreground" : "text-white/60"}`}>{greet}</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05]">
              Welcome to the <em className="gradient-text-gold not-italic">Marigold</em> table.
            </h1>
            <p className={`mt-4 max-w-xs text-base ${pastel ? "text-muted-foreground" : "text-white/70"}`}>
              Tonight, our chef is featuring winter truffle. Take your time. We'll be here.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 backdrop-blur-md ${
              pastel ? "border-border bg-card/70 shadow-soft" : "border-white/15 bg-white/5"
            }`}
          >
            <div className={`flex items-center gap-2 text-xs uppercase tracking-widest ${pastel ? "text-primary" : "text-gold"}`}>
              <Sparkles className="h-3.5 w-3.5" /> Tonight's special
            </div>
            <div className="mt-1 font-display text-lg">Black Truffle Tagliolini</div>
            <div className={`mt-2 flex items-center gap-3 text-xs ${pastel ? "text-muted-foreground" : "text-white/60"}`}>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ready in ~18 min</span>
              <span>Chef Anaïs</span>
            </div>
          </div>

          <Link
            to="/home"
            className="group flex items-center justify-between rounded-full py-4 pl-6 pr-4 text-lg font-medium shadow-elevated transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--gradient-hero)", color: "var(--hero-foreground)" }}
          >
            Start dining
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
          <p className={`text-center text-xs ${pastel ? "text-muted-foreground" : "text-white/50"}`}>
            Your server, Priya, is caring for your table tonight.
          </p>
        </div>
      </div>
    </div>
  );
}
