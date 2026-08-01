import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { themes, useTheme } from "@/lib/theme";

export function ThemeSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const light = tone === "light";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change look"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur transition-colors ${
          light
            ? "border-border bg-card/70 text-foreground hover:bg-card"
            : "border-white/20 bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <Palette className="h-3.5 w-3.5" />
        Looks
      </button>

      {open && (
        <div
          className={`fade-up absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border p-1.5 backdrop-blur-xl ${
            light ? "border-border bg-card/95 shadow-elevated" : "border-white/15 bg-black/70"
          }`}
        >
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                light ? "hover:bg-muted" : "hover:bg-white/10"
              }`}
            >
              <span className={`flex overflow-hidden rounded-full border ${light ? "border-border" : "border-white/20"}`}>
                {t.swatch.map((c) => (
                  <span key={c} className="h-5 w-3.5" style={{ background: c }} />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-xs font-medium ${light ? "text-foreground" : "text-white"}`}>{t.name}</span>
                <span className={`block truncate text-[10px] ${light ? "text-muted-foreground" : "text-white/50"}`}>{t.note}</span>
              </span>
              {theme === t.id && <Check className={`h-4 w-4 ${light ? "text-primary" : "text-white"}`} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
