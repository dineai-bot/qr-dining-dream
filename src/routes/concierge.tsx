import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dine/AppShell";
import { ArrowLeft, Mic, Send, Sparkles, UserRound } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { dishes } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/concierge")({
  component: Concierge,
  head: () => ({
    meta: [
      { title: "AI Concierge — DineAI" },
      { name: "description", content: "Chat with the DineAI concierge for pairings, recommendations, and dietary guidance." },
      { property: "og:title", content: "Your table's AI concierge" },
      { property: "og:description", content: "Warm, knowledgeable guidance from the digital host." },
    ],
  }),
});

type Msg = { id: string; role: "ai" | "user"; text: string; cards?: string[] };

const suggestions = [
  "Something light and vegetarian",
  "Pair the wagyu with a drink",
  "Nut-free desserts?",
  "What's the chef most proud of tonight?",
];

const scripted: Record<string, Msg> = {
  default: {
    id: "d",
    role: "ai",
    text: "Two thoughts: our black truffle tagliolini if you're in the mood for something quiet, or the wagyu if you'd like the room to notice. Either way, I'd start with the burrata.",
    cards: ["truffle-pasta", "wagyu-steak", "burrata"],
  },
  vegetarian: {
    id: "v",
    role: "ai",
    text: "For something light and green — the heirloom burrata, then the tagliolini. Both meatless. Both memorable.",
    cards: ["burrata", "truffle-pasta"],
  },
  pair: {
    id: "p",
    role: "ai",
    text: "The wagyu pairs beautifully with our smoked negroni — the applewood echoes the char. Want me to add one?",
    cards: ["smoke-negroni"],
  },
  dessert: {
    id: "de",
    role: "ai",
    text: "The molten chocolate is nut-free tonight. Rich, but the vanilla balances it.",
    cards: ["lava"],
  },
  chef: {
    id: "c",
    role: "ai",
    text: "Chef Anaïs is quietly proud of the tagliolini — she rolled the pasta this morning. It's her mother's recipe.",
    cards: ["truffle-pasta"],
  },
};

function reply(text: string): Msg {
  const t = text.toLowerCase();
  if (t.includes("veg")) return { ...scripted.vegetarian, id: crypto.randomUUID() };
  if (t.includes("pair") || t.includes("drink") || t.includes("wine") || t.includes("wagyu")) return { ...scripted.pair, id: crypto.randomUUID() };
  if (t.includes("dessert") || t.includes("nut")) return { ...scripted.dessert, id: crypto.randomUUID() };
  if (t.includes("chef") || t.includes("proud") || t.includes("special")) return { ...scripted.chef, id: crypto.randomUUID() };
  return { ...scripted.default, id: crypto.randomUUID() };
}

function Concierge() {
  const router = useRouter();
  const { add } = useCart();
  const [messages, setMessages] = useState<Msg[]>([{
    id: "hi", role: "ai",
    text: "Good evening. I'm your concierge tonight — a little bit sommelier, a little bit host. What are you in the mood for?",
  }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    const u: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, u]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, reply(text)]);
      setThinking(false);
    }, 900);
  };

  return (
    <AppShell>
      <header className="sticky top-0 z-20 bg-background/90 px-5 pt-6 pb-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => router.history.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "var(--gradient-hero)" }}>
              <span className="absolute inset-0 rounded-full pulse-ring bg-gold/40" />
              <Sparkles className="relative h-5 w-5 text-gold" />
            </div>
            <div>
              <div className="font-display text-lg leading-none">Concierge</div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-veg" /> Here with you
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-5 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`fade-up flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--gradient-gold)" }}>
                <Sparkles className="h-3.5 w-3.5 text-gold-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] ${m.role === "user" ? "" : ""}`}>
              {m.role === "user" ? (
                <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-soft">
                  <p className="text-sm">{m.text}</p>
                </div>
              ) : (
                <>
                  <p className="text-[15px] leading-relaxed text-foreground">{m.text}</p>
                  {m.cards && (
                    <div className="mt-3 space-y-2">
                      {m.cards.map((cid) => {
                        const d = dishes.find((x) => x.id === cid);
                        if (!d) return null;
                        return (
                          <div key={cid} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-soft">
                            <img src={d.image} alt="" className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-display text-sm">{d.name}</div>
                              <div className="text-xs text-muted-foreground">${d.price}</div>
                            </div>
                            <button
                              onClick={() => { add(d.id); toast.success(`Added ${d.name}`); }}
                              className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105"
                            >
                              Add
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
            {m.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <UserRound className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--gradient-gold)" }}>
              <Sparkles className="h-3.5 w-3.5 text-gold-foreground" />
            </div>
            <div className="flex gap-1 rounded-full bg-muted px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: "typing 1.2s infinite", animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </section>

      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-20 z-30 px-4 pb-2">
        <div className="mx-auto max-w-md">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="glass flex items-center gap-2 rounded-full py-2 pl-5 pr-2 shadow-elevated"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about anything on the menu…"
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary" aria-label="Voice">
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground transition-all disabled:opacity-40"
              style={{ background: "var(--gradient-hero)" }}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
